import { NavLink } from "react-router-dom";

function Sidebar() {

    // =========================
    // GET LOGGED-IN USER ROLE
    // =========================

    const storedUser = localStorage.getItem("user");

    let role = "";

    try {
        const user = storedUser ? JSON.parse(storedUser) : {};
        role = user.role || "";
    } catch (error) {
        console.error("Invalid user data in Local Storage");
    }


    // =========================
    // ACCESS RULES (matches backend SecurityConfig)
    // =========================

    const canViewUsers = role === "ADMIN";

    const canViewAudits =
        role === "ADMIN" || role === "AUDITOR";

    const canViewFindings =
        role === "ADMIN" || role === "AUDITOR";

    const canViewCompliance =
        role === "ADMIN" || role === "COMPLIANCE_OFFICER";


    return (
        <aside className="sidebar">

            <div className="logo">
                <h2>AuditPro</h2>
                <span>Management System</span>
            </div>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/analytics">
                    AI &amp; Analytics
                </NavLink>

                {canViewUsers && (
                    <NavLink to="/users">
                        Users
                    </NavLink>
                )}

                {canViewAudits && (
                    <NavLink to="/audits">
                        Audits
                    </NavLink>
                )}

                {canViewFindings && (
                    <NavLink to="/findings">
                        Findings
                    </NavLink>
                )}

                {canViewCompliance && (
                    <NavLink to="/compliance">
                        Compliance
                    </NavLink>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;