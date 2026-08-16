import { useEffect, useState } from "react";
import api from "../services/api";
import useCountUp from "../hookes/useCountUp";

function Dashboard() {

    const [totalAudits, setTotalAudits] = useState(0);
    const [pendingAudits, setPendingAudits] = useState(0);
    const [totalFindings, setTotalFindings] = useState(0);
    const [totalCompliance, setTotalCompliance] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadDashboardData = async () => {

            try {

                setLoading(true);
                setError("");

                const auditsResponse = await api.get("/audits");

                const audits = auditsResponse.data;

                setTotalAudits(audits.length);

                const pending = audits.filter(
                    (audit) =>
                        audit.status?.toUpperCase() === "PENDING"
                );

                setPendingAudits(pending.length);

                const findingsResponse =
                    await api.get("/findings");

                setTotalFindings(
                    findingsResponse.data.length
                );

                const complianceResponse =
                    await api.get("/compliance");

                setTotalCompliance(
                    complianceResponse.data.length
                );

            } catch (error) {

                console.error(
                    "Dashboard API Error:",
                    error
                );

                if (error.response?.status === 401) {

                    setError(
                        "Session expired. Please login again."
                    );

                } else if (error.response?.status === 403) {

                    setError(
                        "You don't have permission to access dashboard data."
                    );

                } else {

                    setError(
                        "Unable to load dashboard data."
                    );
                }

            } finally {

                setLoading(false);

            }
        };


        loadDashboardData();

    }, []);


    const animatedAudits = useCountUp(totalAudits);
    const animatedPending = useCountUp(pendingAudits);
    const animatedFindings = useCountUp(totalFindings);
    const animatedCompliance = useCountUp(totalCompliance);


    return (

        <div className="dashboard">

            <h1>
                Dashboard
            </h1>

            {loading && (
                <p className="dashboard-message">
                    Loading dashboard...
                </p>
            )}

            {error && (
                <p className="dashboard-error">
                    {error}
                </p>
            )}

            {!loading && !error && (

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <h3>Total Audits</h3>
                        <p>{animatedAudits}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Pending Audits</h3>
                        <p>{animatedPending}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Findings</h3>
                        <p>{animatedFindings}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Compliance</h3>
                        <p>{animatedCompliance}</p>
                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;