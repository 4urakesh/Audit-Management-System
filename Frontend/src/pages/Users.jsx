import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {

    // =========================
    // USERS STATE
    // =========================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // SEARCH
    // =========================

    const [searchTerm, setSearchTerm] = useState("");


    // =========================
    // ADD / EDIT MODAL
    // =========================

    const [showModal, setShowModal] = useState(false);

    const [modalMode, setModalMode] = useState("create"); // "create" | "edit"

    const [editingUserId, setEditingUserId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [formError, setFormError] = useState("");


    // =========================
    // DELETE STATE
    // =========================

    const [deletingId, setDeletingId] = useState(null);


    // =========================
    // FORM DATA
    // =========================

    const emptyForm = {
        name: "",
        email: "",
        password: "",
        role: "AUDITOR"
    };

    const [formData, setFormData] = useState(emptyForm);


    // =========================
    // GET ALL USERS
    // =========================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.error("Users API Error:", error);

            if (error.response?.status === 401) {

                setError("Session expired. Please login again.");

            } else if (error.response?.status === 403) {

                setError(
                    "You don't have permission to view users."
                );

            } else {

                setError("Failed to load users.");

            }

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD USERS
    // =========================

    useEffect(() => {

        fetchUsers();

    }, []);


    // =========================
    // OPEN CREATE MODAL
    // =========================

    const openCreateModal = () => {

        setModalMode("create");

        setEditingUserId(null);

        setFormData(emptyForm);

        setFormError("");

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (user) => {

        setModalMode("edit");

        setEditingUserId(user.id);

        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: getRoleName(user) || "AUDITOR"
        });

        setFormError("");

        setShowModal(true);
    };


    // =========================
    // CLOSE MODAL
    // =========================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setFormError("");

        setFormData(emptyForm);

        setEditingUserId(null);
    };


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =========================
    // BUILD FRIENDLY ERROR MESSAGE
    // =========================

    const getErrorMessage = (error, fallback) => {

        if (error.response?.status === 401) {
            return "Session expired. Please login again.";
        }

        if (error.response?.status === 403) {
            return "You don't have permission to do this.";
        }

        return (
            error.response?.data?.message ||
            fallback
        );
    };


    // =========================
    // SAVE USER (CREATE OR EDIT)
    // =========================

    const handleSaveUser = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            setFormError("");

            if (modalMode === "create") {

                await api.post("/users", formData);

            } else {

                const payload = {
                    name: formData.name,
                    email: formData.email,
                    role: { name: formData.role }
                };

                if (formData.password && formData.password.trim() !== "") {
                    payload.password = formData.password;
                }

                await api.put(`/users/${editingUserId}`, payload);
            }

            setShowModal(false);
            setFormData(emptyForm);
            setEditingUserId(null);

            await fetchUsers();

        } catch (error) {

            console.error("Save User Error:", error);

            setFormError(
                getErrorMessage(
                    error,
                    modalMode === "create"
                        ? "Failed to create user."
                        : "Failed to update user."
                )
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE USER
    // =========================

    const handleDeleteUser = async (user) => {

        const confirmed = window.confirm(
            `Delete user "${user.name}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(user.id);

            setError("");

            await api.delete(`/users/${user.id}`);

            await fetchUsers();

        } catch (error) {

            console.error("Delete User Error:", error);

            setError(
                getErrorMessage(error, "Failed to delete user.")
            );

        } finally {

            setDeletingId(null);

        }
    };


    // =========================
    // CLOSE MODAL ON OVERLAY
    // =========================

    const handleOverlayClick = (event) => {

        if (
            event.target === event.currentTarget &&
            !saving
        ) {

            closeModal();

        }
    };


    // =========================
    // GET ROLE NAME
    // =========================

    function getRoleName(user) {

        if (!user?.role) {
            return "N/A";
        }

        if (typeof user.role === "string") {
            return user.role;
        }

        return user.role.name || "N/A";
    }


    // =========================
    // ROLE CSS CLASS
    // =========================

    const getRoleClass = (user) => {

        const role = getRoleName(user);

        return `role-${role.toLowerCase()}`;
    };


    // =========================
    // FILTERED USERS (client-side search)
    // =========================

    const filteredUsers = users.filter((user) => {

        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return true;
        }

        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();

        return name.includes(term) || email.includes(term);
    });


    // =========================
    // JSX
    // =========================

    return (
        <div className="users-page">


            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Users
                    </h1>

                    <p>
                        Manage users and their roles
                    </p>

                </div>


                <button
                    type="button"
                    className="add-user-btn"
                    onClick={openCreateModal}
                >

                    <span>
                        +
                    </span>

                    Add User

                </button>

            </div>


            {/* =========================
                PAGE ERROR
            ========================= */}

            {error && (

                <div className="users-error">
                    {error}
                </div>

            )}


            {/* =========================
                SEARCH BAR
            ========================= */}

            <div className="table-search-wrapper">

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>

                <input
                    type="text"
                    className="table-search-input"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            </div>


            {/* =========================
                USERS TABLE
            ========================= */}

            <div className="users-table-container">

                {loading ? (

                    <div className="users-message">
                        Loading users...
                    </div>

                ) : users.length === 0 ? (

                    <div className="users-message no-users">
                        No users found.
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="users-message no-users">
                        No users match "{searchTerm}".
                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.map((user) => {

                                const roleName =
                                    getRoleName(user);

                                const roleClass =
                                    getRoleClass(user);

                                const isDeleting =
                                    deletingId === user.id;

                                return (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>


                                        <td className="user-name-cell">
                                            {user.name}
                                        </td>


                                        <td>
                                            {user.email}
                                        </td>


                                        <td>

                                            <span
                                                className={`role-badge ${roleClass}`}
                                            >
                                                {roleName}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="user-actions">

                                                <button
                                                    type="button"
                                                    className="user-action-btn edit"
                                                    onClick={() => openEditModal(user)}
                                                    disabled={isDeleting}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="user-action-btn delete"
                                                    onClick={() => handleDeleteUser(user)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================
                ADD / EDIT USER MODAL
            ================================= */}

            {showModal && (

                <div
                    className="user-modal-overlay"
                    onMouseDown={handleOverlayClick}
                >

                    <div className="user-modal">


                        {/* =========================
                            MODAL HEADER
                        ========================= */}

                        <div className="user-modal-header">

                            <div>

                                <h2>
                                    {modalMode === "create"
                                        ? "Add New User"
                                        : "Edit User"}
                                </h2>

                                <p>
                                    {modalMode === "create"
                                        ? "Create a new user and assign a role"
                                        : "Update user details and role"}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                &times;
                            </button>

                        </div>


                        {/* =========================
                            ADD / EDIT USER FORM
                        ========================= */}

                        <form
                            className="add-user-form"
                            onSubmit={handleSaveUser}
                        >


                            {/* =========================
                                FORM ERROR
                            ========================= */}

                            {formError && (

                                <div className="user-form-error">
                                    {formError}
                                </div>

                            )}


                            {/* =========================
                                NAME
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* =========================
                                EMAIL
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* =========================
                                PASSWORD
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="password">
                                    Password
                                    {modalMode === "edit" && (
                                        <span className="optional-label">
                                            {" "}(leave blank to keep unchanged)
                                        </span>
                                    )}
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={
                                        modalMode === "create"
                                            ? "Enter password"
                                            : "New password (optional)"
                                    }
                                    required={modalMode === "create"}
                                    minLength="6"
                                    disabled={saving}
                                />

                            </div>


                            {/* =========================
                                ROLE
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="role">
                                    Role
                                </label>

                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                >

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                    <option value="AUDITOR">
                                        AUDITOR
                                    </option>

                                    <option value="COMPLIANCE_OFFICER">
                                        COMPLIANCE OFFICER
                                    </option>

                                </select>

                            </div>


                            {/* =========================
                                MODAL ACTIONS
                            ========================= */}

                            <div className="user-modal-actions">


                                {/* CANCEL */}

                                <button
                                    type="button"
                                    className="user-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                {/* SAVE */}

                                <button
                                    type="submit"
                                    className="user-create-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : modalMode === "create"
                                            ? "Create User"
                                            : "Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Users;