import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {

    const location = useLocation();

    return (
        <div className="app-layout">

            <Navbar />

            <div className="main-layout">

                <Sidebar />

                <main className="page-content" key={location.pathname}>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Layout;