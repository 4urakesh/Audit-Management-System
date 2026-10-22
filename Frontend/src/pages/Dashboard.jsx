import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useCountUp from "../hookes/useCountUp";

function Dashboard() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/analytics/overview");
                setOverview(response.data);
            } catch (requestError) {
                console.error("Dashboard API Error:", requestError);
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const totalAudits = useCountUp(overview?.totalAudits || 0);
    const overdueAudits = useCountUp(overview?.overdueAudits || 0);
    const openFindings = useCountUp(overview?.openFindings || 0);
    const complianceRate = useCountUp(overview?.complianceRate || 0);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            {loading && <p className="dashboard-message">Loading dashboard...</p>}
            {error && <p className="dashboard-error" role="alert">{error}</p>}

            {!loading && !error && overview && (
                <>
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <h3>Total Audits</h3>
                            <p>{totalAudits}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Overdue Audits</h3>
                            <p>{overdueAudits}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Open Findings</h3>
                            <p>{openFindings}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Compliance Rate</h3>
                            <p>{complianceRate}%</p>
                        </div>
                    </div>

                    <section className="dashboard-insight">
                        <div>
                            <h2>Portfolio insight</h2>
                            <p>{overview.recommendations[0]}</p>
                        </div>
                        <Link to="/analytics">Explore AI analytics</Link>
                    </section>
                </>
            )}
        </div>
    );
}

export default Dashboard;
