import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "AUDITOR"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.post("/auth/register", formData);


            // ==========================
            // REGISTER SUCCESSFUL -> GO TO LOGIN
            // ==========================

            navigate("/login", {
                state: {
                    registered: true
                }
            });


        } catch (error) {

            console.error("REGISTER ERROR:", error);

            console.error("REGISTER RESPONSE ERROR:", error.response);


            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Registration failed. Please check your details."
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
                        Create your account
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
                    REGISTER FORM
                ========================== */}

                <form onSubmit={handleRegister}>


                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            disabled={loading}
                        />

                    </div>


                    {/* ROLE */}

                    <div className="form-group">

                        <label>
                            Role
                        </label>

                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >

                            <option value="AUDITOR">
                                AUDITOR
                            </option>

                            <option value="COMPLIANCE_OFFICER">
                                COMPLIANCE OFFICER
                            </option>

                        </select>

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: "100%"
                        }}
                        disabled={loading}
                    >

                        {loading
                            ? "Creating account..."
                            : "Register"
                        }

                    </button>

                </form>


                {/* ==========================
                    LOGIN LINK
                ========================== */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        fontSize: "14px",
                        color: "#6b7280"
                    }}
                >

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        style={{
                            color: "#4f46e5",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;