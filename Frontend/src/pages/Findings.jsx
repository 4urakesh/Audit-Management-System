import { useEffect, useState } from "react";
import api from "../services/api";

const SEVERITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function Findings() {

    // =========================
    // FINDINGS STATE
    // =========================

    const [findings, setFindings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // AUDITS (for dropdown)
    // =========================

    const [audits, setAudits] = useState([]);


    // =========================
    // ADD / EDIT MODAL
    // =========================

    const [showModal, setShowModal] = useState(false);

    const [modalMode, setModalMode] = useState("create"); // "create" | "edit"

    const [editingFindingId, setEditingFindingId] = useState(null);

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
        severity: "MEDIUM",
        status: "OPEN",
        auditId: ""
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
    // GET ALL FINDINGS
    // =========================

    const fetchFindings = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/findings");

            setFindings(response.data);

        } catch (err) {

            console.error("Findings API Error:", err);

            setError(
                getErrorMessage(err, "Failed to load findings.")
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // GET AUDITS (for dropdown)
    // =========================

    const fetchAudits = async () => {

        try {

            const response = await api.get("/audits");

            setAudits(response.data);

        } catch (err) {

            console.warn("Could not load audits for dropdown:", err);

            setAudits([]);

        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        fetchFindings();

        fetchAudits();

    }, []);


    // =========================
    // OPEN CREATE MODAL
    // =========================

    const openCreateModal = () => {

        setModalMode("create");

        setEditingFindingId(null);

        setFormData(emptyForm);

        setFormError("");

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (finding) => {

        setModalMode("edit");

        setEditingFindingId(finding.id);

        setFormData({
            title: finding.title || "",
            description: finding.description || "",
            severity: finding.severity || "MEDIUM",
            status: finding.status || "OPEN",
            auditId: finding.audit?.id ? String(finding.audit.id) : ""
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

        setEditingFindingId(null);
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
    // SAVE FINDING (CREATE OR EDIT)
    // =========================

    const handleSaveFinding = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            setFormError("");

            if (modalMode === "create") {

                if (!formData.auditId) {

                    setFormError("Please select an audit.");

                    setSaving(false);

                    return;
                }

                const payload = {
                    title: formData.title,
                    description: formData.description,
                    severity: formData.severity,
                    status: formData.status,
                    audit: { id: Number(formData.auditId) }
                };

                await api.post("/findings", payload);

            } else {

                // Update: audit is intentionally not sent - backend keeps
                // the finding's original audit regardless of what's sent.
                const payload = {
                    title: formData.title,
                    description: formData.description,
                    severity: formData.severity,
                    status: formData.status
                };

                await api.put(`/findings/${editingFindingId}`, payload);

            }

            setShowModal(false);
            setFormData(emptyForm);
            setEditingFindingId(null);

            await fetchFindings();

        } catch (err) {

            console.error("Save Finding Error:", err);

            setFormError(
                getErrorMessage(
                    err,
                    modalMode === "create"
                        ? "Failed to create finding."
                        : "Failed to update finding."
                )
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE FINDING
    // =========================

    const handleDeleteFinding = async (finding) => {

        const confirmed = window.confirm(
            `Delete finding "${finding.title}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(finding.id);

            setError("");

            await api.delete(`/findings/${finding.id}`);

            await fetchFindings();

        } catch (err) {

            console.error("Delete Finding Error:", err);

            setError(
                getErrorMessage(err, "Failed to delete finding.")
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

    const getSeverityClass = (severity) => {

        return `severity-badge severity-${(severity || "unknown").toLowerCase()}`;
    };

    const getStatusClass = (status) => {

        return `status-badge status-${(status || "unknown").toLowerCase()}`;
    };

    const getAuditTitle = (finding) => {

        return finding.audit?.title || "N/A";
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
                        Findings
                    </h1>

                    <p>
                        Track issues discovered during audits
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

                    New Finding

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
                FINDINGS TABLE
            ========================= */}

            <div className="users-table-container">

                {loading ? (

                    <div className="users-message">
                        Loading findings...
                    </div>

                ) : findings.length === 0 ? (

                    <div className="users-message no-users">
                        No findings found.
                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Title</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Audit</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {findings.map((finding) => {

                                const isDeleting =
                                    deletingId === finding.id;

                                return (

                                    <tr key={finding.id}>

                                        <td>
                                            {finding.id}
                                        </td>

                                        <td className="user-name-cell">
                                            {finding.title}
                                        </td>

                                        <td>
                                            <span className={getSeverityClass(finding.severity)}>
                                                {finding.severity || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={getStatusClass(finding.status)}>
                                                {finding.status || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            {getAuditTitle(finding)}
                                        </td>

                                        <td>

                                            <div className="user-actions">

                                                <button
                                                    type="button"
                                                    className="user-action-btn edit"
                                                    onClick={() => openEditModal(finding)}
                                                    disabled={isDeleting}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="user-action-btn delete"
                                                    onClick={() => handleDeleteFinding(finding)}
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
                ADD / EDIT FINDING MODAL
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
                                        ? "New Finding"
                                        : "Edit Finding"}
                                </h2>

                                <p>
                                    {modalMode === "create"
                                        ? "Report a new finding for an audit"
                                        : "Update finding details"}
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
                            ADD / EDIT FINDING FORM
                        ========================= */}

                        <form
                            className="add-user-form"
                            onSubmit={handleSaveFinding}
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
                                    placeholder="Enter finding title"
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
                                    placeholder="Enter finding description"
                                    disabled={saving}
                                />

                            </div>


                            {/* =========================
                                SEVERITY + STATUS
                            ========================= */}

                            <div className="user-form-row">

                                <div className="user-form-group">

                                    <label htmlFor="severity">
                                        Severity
                                    </label>

                                    <select
                                        id="severity"
                                        name="severity"
                                        value={formData.severity}
                                        onChange={handleChange}
                                        required
                                        disabled={saving}
                                    >

                                        {SEVERITY_OPTIONS.map((sev) => (
                                            <option key={sev} value={sev}>
                                                {sev}
                                            </option>
                                        ))}

                                    </select>

                                </div>

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

                            </div>


                            {/* =========================
                                AUDIT (create only)
                            ========================= */}

                            {modalMode === "create" ? (

                                <div className="user-form-group">

                                    <label htmlFor="auditId">
                                        Audit
                                    </label>

                                    <select
                                        id="auditId"
                                        name="auditId"
                                        value={formData.auditId}
                                        onChange={handleChange}
                                        required
                                        disabled={saving}
                                    >

                                        <option value="">
                                            Select an audit
                                        </option>

                                        {audits.map((audit) => (
                                            <option key={audit.id} value={audit.id}>
                                                {audit.title}
                                            </option>
                                        ))}

                                    </select>

                                    <p className="optional-label">
                                        Only audits assigned to you can be used.
                                    </p>

                                </div>

                            ) : (

                                <div className="user-form-group">

                                    <label>
                                        Audit
                                    </label>

                                    <p className="optional-label">
                                        {formData.title
                                            ? "Audit cannot be changed after creation."
                                            : ""}
                                    </p>

                                </div>

                            )}


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
                                            ? "Create Finding"
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

export default Findings;