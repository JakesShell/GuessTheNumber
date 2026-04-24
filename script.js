const scenarios = [
    {
        name: "Sales Conversion Estimate",
        description: "Estimate the monthly conversion target score for a sales campaign performance review."
    },
    {
        name: "Support Resolution Estimate",
        description: "Estimate the operational score for first-contact resolution performance in a support team."
    },
    {
        name: "Inventory Accuracy Estimate",
        description: "Estimate the accuracy score for stock-count performance in a warehouse review cycle."
    },
    {
        name: "Project Delivery Estimate",
        description: "Estimate the delivery health score for an ongoing internal project execution review."
    }
];

let currentScenario = scenarios[0];
let secretTarget = generateTarget();
let attempts = 0;
let completedRounds = 0;
let bestRound = null;
let history = [];

function generateTarget() {
    return Math.floor(Math.random() * 100) + 1;
}

function loadScenarios() {
    const select = document.getElementById("scenarioSelect");
    select.innerHTML = scenarios.map((scenario, index) => `
        <option value="${index}">${scenario.name}</option>
    `).join("");

    select.addEventListener("change", event => {
        currentScenario = scenarios[Number(event.target.value)];
        document.getElementById("scenarioDescription").textContent = currentScenario.description;
        resetRoundState();
    });
}

function resetRoundState() {
    secretTarget = generateTarget();
    attempts = 0;
    document.getElementById("attemptCount").textContent = "0";
    document.getElementById("feedbackText").textContent = "New round started. Enter your estimate.";
    document.getElementById("guessInput").value = "";
}

function updateScoreboard() {
    document.getElementById("roundCount").textContent = completedRounds;
    document.getElementById("bestScore").textContent = bestRound === null ? "N/A" : `${bestRound} attempts`;
}

function renderHistory() {
    const body = document.getElementById("historyBody");

    if (history.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5">No completed rounds yet.</td>
            </tr>
        `;
        return;
    }

    body.innerHTML = history.map(item => `
        <tr>
            <td>${item.scenario}</td>
            <td>${item.finalEstimate}</td>
            <td>${item.actualTarget}</td>
            <td>${item.attempts}</td>
            <td>${item.result}</td>
        </tr>
    `).join("");
}

function handleGuess() {
    const input = document.getElementById("guessInput");
    const feedbackText = document.getElementById("feedbackText");
    const guess = Number(input.value);

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        feedbackText.textContent = "Enter a whole number between 1 and 100.";
        return;
    }

    attempts += 1;
    document.getElementById("attemptCount").textContent = attempts;

    if (guess < secretTarget) {
        feedbackText.textContent = "Too low. Estimate higher.";
        return;
    }

    if (guess > secretTarget) {
        feedbackText.textContent = "Too high. Estimate lower.";
        return;
    }

    feedbackText.textContent = `Correct. You matched the target in ${attempts} attempts.`;

    completedRounds += 1;
    if (bestRound === null || attempts < bestRound) {
        bestRound = attempts;
    }

    history.unshift({
        scenario: currentScenario.name,
        finalEstimate: guess,
        actualTarget: secretTarget,
        attempts: attempts,
        result: "Matched Target"
    });

    if (history.length > 6) {
        history = history.slice(0, 6);
    }

    updateScoreboard();
    renderHistory();
}

document.addEventListener("DOMContentLoaded", () => {
    loadScenarios();
    document.getElementById("scenarioDescription").textContent = currentScenario.description;
    document.getElementById("submitGuess").addEventListener("click", handleGuess);
    document.getElementById("newRound").addEventListener("click", resetRoundState);
    updateScoreboard();
    renderHistory();
});
