import { useNavigate } from "react-router-dom";
import useTheme from "../hookes/useTheme";

function Navbar() {

    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();

    // Local Storage se user data lena
    const storedUser = localStorage.getItem("user");

    let user = {};

    try {
        user = storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
        console.error("Invalid user data in Local Storage");
    }

    const name = user.name || "User";
    const role = user.role || "USER";


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    return (
        <header className="navbar">

            {/* Left Side */}

            <div className="navbar-left">

                <div className="navbar-logo-mark">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                        <path
                            d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h2>
                    Audit Management System
                </h2>

            </div>


            {/* Right Side */}

            <div className="navbar-right">

                {/* THEME TOGGLE */}

                <button
                    type="button"
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    title={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                >

                    {theme === "light" ? (

                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <path
                                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                    ) : (

                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                    )}

                </button>


                <div className="user-info">

                    <span className="user-name">
                        {name}
                    </span>

                    <span className="user-role">
                        {role}
                    </span>

                </div>


                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;