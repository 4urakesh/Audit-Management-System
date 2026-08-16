import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            const data = response.data;


            // ==========================
            // SAVE JWT TOKEN
            // ==========================

            localStorage.setItem(
                "token",
                data.token
            );


            // ==========================
            // SAVE USER DETAILS
            // ==========================

            const user = {
                name: data.name,
                email: data.email,
                role: data.role
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // ==========================
            // GO TO DASHBOARD
            // ==========================

            navigate("/dashboard");


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            console.error(
                "LOGIN RESPONSE ERROR:",
                error.response
            );


            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Invalid email or password"
                );

            } else if (error.request) {

                setError(
                    "Unable to connect to server. Please check backend."
                );

            } else {

                setError(
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* ==========================
                    LOGO
                ========================== */}

                <div className="auth-logo">

                    <h1>AuditPro</h1>

                    <p>
                        Audit Management System
                    </p>

                </div>


                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="alert alert-error">
                        {error}
                    </div>

                )}


                {/* ==========================
                    LOGIN FORM
                ========================== */}

                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: "100%"
                        }}
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* ==========================
                    REGISTER LINK
                ========================== */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        fontSize: "14px",
                        color: "#6b7280"
                    }}
                >

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        style={{
                            color: "#4f46e5",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;