export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateAccuracyScore(estimate, target) {
  const difference = Math.abs(Number(estimate) - Number(target));
  const toleranceBase = Math.max(Math.abs(target), 1);
  const errorRate = difference / toleranceBase;
  return clampScore(100 - errorRate * 130);
}

export function classifyThreshold(scenario, value) {
  const estimate = Number(value);

  if (scenario.criticalAbove !== undefined && estimate > scenario.criticalAbove) {
    return "Critical High";
  }

  if (scenario.criticalBelow !== undefined && estimate < scenario.criticalBelow) {
    return "Critical Low";
  }

  if (estimate >= scenario.healthyRange.min && estimate <= scenario.healthyRange.max) {
    return "Healthy";
  }

  if (estimate >= scenario.warningRange.min && estimate <= scenario.warningRange.max) {
    return "Warning";
  }

  return "Out Of Range";
}

export function calculateThresholdScore(scenario, estimate) {
  const estimateClass = classifyThreshold(scenario, estimate);
  const targetClass = classifyThreshold(scenario, scenario.target);

  if (estimateClass === targetClass) return 100;

  if (
    (estimateClass.includes("Critical") && targetClass === "Warning") ||
    (estimateClass === "Warning" && targetClass.includes("Critical")) ||
    (estimateClass === "Healthy" && targetClass === "Warning") ||
    (estimateClass === "Warning" && targetClass === "Healthy")
  ) {
    return 70;
  }

  return 42;
}

export function calculateDecisionScore(scenario, selectedDecision) {
  return selectedDecision === scenario.correctDecision ? 100 : 45;
}

export function evaluateAttempt(scenario, payload) {
  const accuracyScore = calculateAccuracyScore(payload.estimate, scenario.target);
  const thresholdScore = calculateThresholdScore(scenario, payload.estimate);
  const decisionScore = calculateDecisionScore(scenario, payload.selectedDecision);
  const readinessScore = clampScore(accuracyScore * 0.42 + thresholdScore * 0.28 + decisionScore * 0.3);

  let readinessLevel = "Ready";
  if (readinessScore < 60) readinessLevel = "Coaching Needed";
  else if (readinessScore < 75) readinessLevel = "Developing";
  else if (readinessScore < 88) readinessLevel = "Strong";

  const estimateClass = classifyThreshold(scenario, payload.estimate);

  return {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    metric: scenario.metric,
    estimate: Number(payload.estimate),
    target: scenario.target,
    unit: scenario.unit,
    selectedDecision: payload.selectedDecision,
    correctDecision: scenario.correctDecision,
    estimateClass,
    scores: {
      accuracyScore,
      thresholdScore,
      decisionScore,
      readinessScore
    },
    readinessLevel,
    feedback: buildFeedback(scenario, accuracyScore, thresholdScore, decisionScore, estimateClass),
    nextRecommendation: recommendNextScenario(scenario, readinessScore)
  };
}

export function buildFeedback(scenario, accuracyScore, thresholdScore, decisionScore, estimateClass) {
  const notes = [];

  if (accuracyScore >= 85) {
    notes.push("Your estimate was close to the target KPI.");
  } else {
    notes.push("Your estimate needs calibration against the scenario target and context clues.");
  }

  if (thresholdScore >= 85) {
    notes.push(`You correctly interpreted the KPI threshold as ${estimateClass}.`);
  } else {
    notes.push(`Your threshold interpretation was off. The target KPI falls into the ${classifyThreshold(scenario, scenario.target)} range.`);
  }

  if (decisionScore === 100) {
    notes.push("Your business action matched the recommended operational response.");
  } else {
    notes.push(`Decision coaching: ${scenario.coachingNote}`);
  }

  return notes;
}

export function recommendNextScenario(scenario, readinessScore) {
  if (readinessScore < 60) {
    return `Repeat ${scenario.category} foundation scenarios before moving to harder simulations.`;
  }

  if (readinessScore < 78) {
    return `Continue with another ${scenario.category} scenario and focus on threshold interpretation.`;
  }

  return "Move to a harder cross-functional scenario with more business context and risk pressure.";
}

export function buildDashboard(scenarios, learners, sessions) {
  const averageReadiness = Math.round(
    learners.reduce((sum, learner) => sum + learner.readinessScore, 0) / Math.max(learners.length, 1)
  );

  const coachingNeeded = learners.filter((learner) =>
    learner.status === "Coaching Needed" || learner.status === "At Risk"
  ).length;

  const categoryPerformance = scenarios.map((scenario) => {
    const relatedSessions = sessions.filter((session) => session.category === scenario.category);
    const averageScore = relatedSessions.length
      ? Math.round(relatedSessions.reduce((sum, session) => sum + session.readinessScore, 0) / relatedSessions.length)
      : null;

    return {
      category: scenario.category,
      scenarioCount: scenarios.filter((item) => item.category === scenario.category).length,
      averageScore
    };
  });

  const uniqueCategoryPerformance = [...new Map(categoryPerformance.map((item) => [item.category, item])).values()];

  return {
    metrics: {
      scenarioCount: scenarios.length,
      learnerCount: learners.length,
      averageReadiness,
      coachingNeeded,
      completedSessions: sessions.length
    },
    scenarios,
    learners,
    sessions,
    categoryPerformance: uniqueCategoryPerformance
  };
}