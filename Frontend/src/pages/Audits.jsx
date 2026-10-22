import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function Audits() {

    // =========================
    // AUDITS STATE
    // =========================

    const [audits, setAudits] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // AUDITORS (for dropdown)
    // =========================

    const [auditors, setAuditors] = useState([]);

    const [auditorsAvailable, setAuditorsAvailable] = useState(true);


    // =========================
    // ADD / EDIT MODAL
    // =========================

    const [showModal, setShowModal] = useState(false);

    const [modalMode, setModalMode] = useState("create"); // "create" | "edit"

    const [editingAuditId, setEditingAuditId] = useState(null);

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
        title: "",
        description: "",
        scope: "",
        objectives: "",
        riskLevel: "MEDIUM",
        startDate: "",
        endDate: "",
        status: "PENDING",
        auditorId: ""
    };

    const [formData, setFormData] = useState(emptyForm);


    // =========================
    // BUILD FRIENDLY ERROR MESSAGE
    // =========================

    const getErrorMessage = (err, fallback) => {

        if (err.response?.status === 401) {
            return "Session expired. Please login again.";
        }

        if (err.response?.status === 403) {
            return "You don't have permission to do this.";
        }

        return (
            err.response?.data?.message ||
            fallback
        );
    };


    // =========================
    // GET ALL AUDITS
    // =========================

    const fetchAudits = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/audits");

            setAudits(response.data);

        } catch (err) {

            console.error("Audits API Error:", err);

            setError(
                getErrorMessage(err, "Failed to load audits.")
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // GET AUDITORS (users with role AUDITOR)
    // =========================

    const fetchAuditors = async () => {

        try {

            const response = await api.get("/users");

            const auditorUsers = response.data.filter((user) => {

                const roleName =
                    typeof user.role === "string"
                        ? user.role
                        : user.role?.name;

                return roleName === "AUDITOR";
            });

            setAuditors(auditorUsers);

            setAuditorsAvailable(true);

        } catch (err) {

            console.warn(
                "Could not load auditors (likely non-admin user):",
                err
            );

            setAuditors([]);

            setAuditorsAvailable(false);

        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        fetchAudits();

        fetchAuditors();

    }, []);


    // =========================
    // OPEN CREATE MODAL
    // =========================

    const openCreateModal = () => {

        setModalMode("create");

        setEditingAuditId(null);

        setFormData(emptyForm);

        setFormError("");

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (audit) => {

        setModalMode("edit");

        setEditingAuditId(audit.id);

        setFormData({
            title: audit.title || "",
            description: audit.description || "",
            scope: audit.scope || "",
            objectives: audit.objectives || "",
            riskLevel: audit.riskLevel || "MEDIUM",
            startDate: audit.startDate || "",
            endDate: audit.endDate || "",
            status: audit.status || "PENDING",
            auditorId: audit.auditor?.id ? String(audit.auditor.id) : ""
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

        setEditingAuditId(null);
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
    // SAVE AUDIT (CREATE OR EDIT)
    // =========================

    const handleSaveAudit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            setFormError("");

            const payload = {
                title: formData.title,
                description: formData.description,
                scope: formData.scope,
                objectives: formData.objectives,
                riskLevel: formData.riskLevel,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                status: formData.status
            };

            if (formData.auditorId) {
                payload.auditor = { id: Number(formData.auditorId) };
            }

            if (modalMode === "create") {

                await api.post("/audits", payload);

            } else {

                await api.put(`/audits/${editingAuditId}`, payload);

            }

            setShowModal(false);
            setFormData(emptyForm);
            setEditingAuditId(null);

            await fetchAudits();

        } catch (err) {

            console.error("Save Audit Error:", err);

            setFormError(
                getErrorMessage(
                    err,
                    modalMode === "create"
                        ? "Failed to create audit."
                        : "Failed to update audit."
                )
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE AUDIT
    // =========================

    const handleDeleteAudit = async (audit) => {

        const confirmed = window.confirm(
            `Delete audit "${audit.title}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(audit.id);

            setError("");

            await api.delete(`/audits/${audit.id}`);

            await fetchAudits();

        } catch (err) {

            console.error("Delete Audit Error:", err);

            setError(
                getErrorMessage(err, "Failed to delete audit.")
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
    // HELPERS
    // =========================

    const getStatusClass = (status) => {

        return `status-badge status-${(status || "unknown").toLowerCase()}`;
    };

    const getAuditorName = (audit) => {

        return audit.auditor?.name || "Unassigned";
    };


    // =========================
    // JSX
    // =========================

    return (
        <div className="audits-page">


            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Audits
                    </h1>

                    <p>
                        Track and manage audit engagements
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

                    New Audit

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
                AUDITS TABLE
            ========================= */}

            <div className="users-table-container">

                {loading ? (

                    <div className="users-message">
                        Loading audits...
                    </div>

                ) : audits.length === 0 ? (

                    <div className="users-message no-users">
                        No audits found.
                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Title</th>
                                <th>Risk</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Auditor</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {audits.map((audit) => {

                                const isDeleting =
                                    deletingId === audit.id;

                                return (

                                    <tr key={audit.id}>

                                        <td>
                                            {audit.id}
                                        </td>

                                        <td className="user-name-cell">
                                            {audit.title}
                                        </td>

                                        <td>
                                            <span className={`risk-level risk-${(audit.riskLevel || "medium").toLowerCase()}`}>
                                                {audit.riskLevel || "MEDIUM"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={getStatusClass(audit.status)}>
                                                {audit.status || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            {audit.startDate || "-"}
                                        </td>

                                        <td>
                                            {audit.endDate || "-"}
                                        </td>

                                        <td>
                                            {getAuditorName(audit)}
                                        </td>

                                        <td>

                                            <div className="user-actions">

                                                <button
                                                    type="button"
                                                    className="user-action-btn edit"
                                                    onClick={() => openEditModal(audit)}
                                                    disabled={isDeleting}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="user-action-btn delete"
                                                    onClick={() => handleDeleteAudit(audit)}
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
                ADD / EDIT AUDIT MODAL
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
                                        ? "New Audit"
                                        : "Edit Audit"}
                                </h2>

                                <p>
                                    {modalMode === "create"
                                        ? "Create a new audit engagement"
                                        : "Update audit details"}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        {/* =========================
                            ADD / EDIT AUDIT FORM
                        ========================= */}

                        <form
                            className="add-user-form"
                            onSubmit={handleSaveAudit}
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
                                TITLE
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="title">
                                    Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter audit title"
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* =========================
                                DESCRIPTION
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter audit description"
                                    disabled={saving}
                                />

                            </div>

                            <div className="user-form-group">
                                <label htmlFor="scope">Scope</label>
                                <textarea
                                    id="scope"
                                    name="scope"
                                    value={formData.scope}
                                    onChange={handleChange}
                                    placeholder="Systems, teams, locations, or processes covered"
                                    rows="3"
                                    disabled={saving}
                                />
                            </div>

                            <div className="user-form-group">
                                <label htmlFor="objectives">Objectives</label>
                                <textarea
                                    id="objectives"
                                    name="objectives"
                                    value={formData.objectives}
                                    onChange={handleChange}
                                    placeholder="What should this audit verify?"
                                    rows="3"
                                    disabled={saving}
                                />
                            </div>

                            <div className="user-form-group">
                                <label htmlFor="riskLevel">Inherent risk</label>
                                <select
                                    id="riskLevel"
                                    name="riskLevel"
                                    value={formData.riskLevel}
                                    onChange={handleChange}
                                    disabled={saving}
                                >
                                    {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((risk) => (
                                        <option key={risk} value={risk}>{risk}</option>
                                    ))}
                                </select>
                            </div>


                            {/* =========================
                                DATES
                            ========================= */}

                            <div className="user-form-row">

                                <div className="user-form-group">

                                    <label htmlFor="startDate">
                                        Start Date
                                    </label>

                                    <input
                                        id="startDate"
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />

                                </div>

                                <div className="user-form-group">

                                    <label htmlFor="endDate">
                                        End Date
                                    </label>

                                    <input
                                        id="endDate"
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* =========================
                                STATUS
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                >

                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            {/* =========================
                                AUDITOR
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="auditorId">
                                    Auditor
                                </label>

                                {auditorsAvailable ? (

                                    <select
                                        id="auditorId"
                                        name="auditorId"
                                        value={formData.auditorId}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >

                                        <option value="">
                                            Unassigned
                                        </option>

                                        {auditors.map((auditorUser) => (
                                            <option
                                                key={auditorUser.id}
                                                value={auditorUser.id}
                                            >
                                                {auditorUser.name}
                                            </option>
                                        ))}

                                    </select>

                                ) : (

                                    <p className="optional-label">
                                        You don't have permission to assign auditors.
                                    </p>

                                )}

                            </div>


                            {/* =========================
                                MODAL ACTIONS
                            ========================= */}

                            <div className="user-modal-actions">

                                <button
                                    type="button"
                                    className="user-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="user-create-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : modalMode === "create"
                                            ? "Create Audit"
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

export default Audits;