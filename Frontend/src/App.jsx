import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Audits from "./pages/Audits";
import Findings from "./pages/Findings";
import Compliance from "./pages/Compliance";
import Analytics from "./pages/Analytics";

import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Protected Routes */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<Layout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/analytics"
                            element={<Analytics />}
                        />

                        <Route
                            path="/users"
                            element={<Users />}
                        />

                        <Route
                            path="/audits"
                            element={<Audits />}
                        />

                        <Route
                            path="/findings"
                            element={<Findings />}
                        />

                        <Route
                            path="/compliance"
                            element={<Compliance />}
                        />

                    </Route>

                </Route>


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;