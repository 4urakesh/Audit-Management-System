import { useEffect, useState } from "react";
import api from "../services/api";

const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function Analytics() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/analytics/overview");
                setOverview(response.data);
            } catch (requestError) {
                console.error("Analytics API Error:", requestError);
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load analytics. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, []);

    const maxSeverityCount = Math.max(
        1,
        ...SEVERITIES.map((severity) => overview?.findingsBySeverity?.[severity] || 0)
    );

    return (
        <div className="analytics-page">
            <div className="page-header analytics-header">
                <div>
                    <h1>AI &amp; Analytics</h1>
                    <p>Explainable risk signals from your audit portfolio</p>
                </div>
                <span className="analytics-local-badge">LOCAL ANALYSIS</span>
            </div>

            {loading && <p className="dashboard-message">Loading analytics...</p>}
            {error && <p className="dashboard-error" role="alert">{error}</p>}

            {!loading && !error && overview && (
                <>
                    <section className="analytics-metrics" aria-label="Portfolio metrics">
                        <article className="analytics-metric">
                            <span>Total audits</span>
                            <strong>{overview.totalAudits}</strong>
                            <small>{overview.activeAudits} active</small>
                        </article>
                        <article className="analytics-metric analytics-warning">
                            <span>Overdue audits</span>
                            <strong>{overview.overdueAudits}</strong>
                            <small>Past planned end date</small>
                        </article>
                        <article className="analytics-metric analytics-danger">
                            <span>Open findings</span>
                            <strong>{overview.openFindings}</strong>
                            <small>{overview.criticalOpenFindings} critical</small>
                        </article>
                        <article className="analytics-metric">
                            <span>Compliance rate</span>
                            <strong>{overview.complianceRate}%</strong>
                            <small>{overview.compliantItems} of {overview.totalComplianceItems} requirements compliant</small>
                        </article>
                    </section>

                    <div className="analytics-grid">
                        <section className="analytics-panel">
                            <div className="analytics-panel-heading">
                                <div>
                                    <h2>AI risk recommendations</h2>
                                    <p>Rule-based guidance ranked from current records</p>
                                </div>
                            </div>
                            <ul className="recommendation-list">
                                {overview.recommendations.map((recommendation) => (
                                    <li key={recommendation}>{recommendation}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="analytics-panel">
                            <div className="analytics-panel-heading">
                                <div>
                                    <h2>Finding severity</h2>
                                    <p>{overview.totalFindings} findings across all audits</p>
                                </div>
                            </div>
                            <div className="severity-chart">
                                {SEVERITIES.map((severity) => {
                                    const count = overview.findingsBySeverity?.[severity] || 0;
                                    return (
                                        <div className="severity-row" key={severity}>
                                            <span>{severity}</span>
                                            <div className="severity-track" aria-label={`${count} ${severity.toLowerCase()} findings`}>
                                                <div
                                                    className={`severity-bar severity-bar-${severity.toLowerCase()}`}
                                                    style={{ width: `${(count / maxSeverityCount) * 100}%` }}
                                                />
                                            </div>
                                            <strong>{count}</strong>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="analytics-footnote">
                                {overview.nonCompliantItems} requirement(s) currently marked non-compliant.
                            </p>
                        </section>
                    </div>

                    <section className="analytics-panel risk-panel">
                        <div className="analytics-panel-heading">
                            <div>
                                <h2>Highest-risk audits</h2>
                                <p>Prioritized using inherent risk, open findings, compliance gaps, schedule, ownership, and plan completeness.</p>
                            </div>
                        </div>
                        {overview.highestRiskAudits.length === 0 ? (
                            <p className="analytics-empty">Create an audit to see portfolio risk analysis.</p>
                        ) : (
                            <div className="risk-list">
                                {overview.highestRiskAudits.map((audit) => (
                                    <article className="risk-row" key={audit.auditId}>
                                        <div className="risk-title">
                                            <strong>{audit.title || `Audit #${audit.auditId}`}</strong>
                                            <span>{audit.primaryRisk}</span>
                                        </div>
                                        <div className="risk-score">
                                            <span className={`risk-level risk-${audit.riskLevel.toLowerCase()}`}>
                                                {audit.riskLevel}
                                            </span>
                                            <strong>{audit.riskScore}<small>/100</small></strong>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <p className="analytics-disclaimer">
                        Recommendations are generated locally from your records using transparent rules. They support, but do not replace, professional audit judgment.
                    </p>
                </>
            )}
        </div>
    );
}

export default Analytics;
