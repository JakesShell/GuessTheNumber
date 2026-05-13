import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Shared.jsx";
import HomePage from "./pages/HomePage.jsx";
import KpiLibraryPage from "./pages/KpiLibraryPage.jsx";
import LearnerProfilePage from "./pages/LearnerProfilePage.jsx";
import ManagerReviewPage from "./pages/ManagerReviewPage.jsx";
import SecurityAwsPage from "./pages/SecurityAwsPage.jsx";
import SimulationLabPage from "./pages/SimulationLabPage.jsx";
import TrainingHistoryPage from "./pages/TrainingHistoryPage.jsx";

const API_BASE = "http://localhost:8080";

export default function App() {
  const [role, setRole] = useState("Learner");
  const [theme, setTheme] = useState(() => localStorage.getItem("metricforge-theme") ?? "light");
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("metricforge-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard`, {
      headers: { "x-demo-role": role }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load MetricForge dashboard data");
        return response.json();
      })
      .then(setDashboard)
      .catch((err) => setError(err.message));
  }, [role]);

  if (error) {
    return (
      <Layout role={role} setRole={setRole} theme={theme} setTheme={setTheme}>
        <div className="panel">
          <h1>MetricForge API unavailable</h1>
          <p>{error}. Make sure the backend is running on port 8080.</p>
        </div>
      </Layout>
    );
  }

  if (!dashboard) {
    return (
      <Layout role={role} setRole={setRole} theme={theme} setTheme={setTheme}>
        <div className="panel">
          <h1>Loading MetricForge...</h1>
          <p>Fetching KPI training scenarios and learner readiness data.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role={role} setRole={setRole} theme={theme} setTheme={setTheme}>
      <Routes>
        <Route path="/" element={<HomePage dashboard={dashboard} />} />
        <Route path="/simulation-lab" element={<SimulationLabPage dashboard={dashboard} role={role} />} />
        <Route path="/manager-review" element={<ManagerReviewPage dashboard={dashboard} role={role} />} />
        <Route path="/kpi-library" element={<KpiLibraryPage dashboard={dashboard} />} />
        <Route path="/training-history" element={<TrainingHistoryPage dashboard={dashboard} />} />
        <Route path="/learners/:id" element={<LearnerProfilePage dashboard={dashboard} />} />
        <Route path="/security" element={<SecurityAwsPage />} />
      </Routes>
    </Layout>
  );
}