import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = ["PENDING", "COMPLIANT", "NON_COMPLIANT", "UNDER_REVIEW"];

function Compliance() {

    // =========================
    // COMPLIANCE STATE
    // =========================

    const [complianceItems, setComplianceItems] = useState([]);

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

    const [editingId, setEditingId] = useState(null);

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
        requirement: "",
        description: "",
        status: "PENDING",
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
    // GET ALL COMPLIANCE ITEMS
    // =========================

    const fetchCompliance = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/compliance");

            setComplianceItems(response.data);

        } catch (err) {

            console.error("Compliance API Error:", err);

            setError(
                getErrorMessage(err, "Failed to load compliance records.")
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

        fetchCompliance();

        fetchAudits();

    }, []);


    // =========================
    // OPEN CREATE MODAL
    // =========================

    const openCreateModal = () => {

        setModalMode("create");

        setEditingId(null);

        setFormData(emptyForm);

        setFormError("");

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (item) => {

        setModalMode("edit");

        setEditingId(item.id);

        setFormData({
            requirement: item.requirement || "",
            description: item.description || "",
            status: item.status || "PENDING",
            auditId: item.audit?.id ? String(item.audit.id) : ""
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

        setEditingId(null);
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
    // SAVE COMPLIANCE (CREATE OR EDIT)
    // =========================

    const handleSaveCompliance = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            setFormError("");

            const payload = {
                requirement: formData.requirement,
                description: formData.description,
                status: formData.status
            };

            if (formData.auditId) {
                payload.audit = { id: Number(formData.auditId) };
            }

            if (modalMode === "create") {

                await api.post("/compliance", payload);

            } else {

                await api.put(`/compliance/${editingId}`, payload);

            }

            setShowModal(false);
            setFormData(emptyForm);
            setEditingId(null);

            await fetchCompliance();

        } catch (err) {

            console.error("Save Compliance Error:", err);

            setFormError(
                getErrorMessage(
                    err,
                    modalMode === "create"
                        ? "Failed to create compliance record."
                        : "Failed to update compliance record."
                )
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE COMPLIANCE
    // =========================

    const handleDeleteCompliance = async (item) => {

        const confirmed = window.confirm(
            `Delete compliance record "${item.requirement}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(item.id);

            setError("");

            await api.delete(`/compliance/${item.id}`);

            await fetchCompliance();

        } catch (err) {

            console.error("Delete Compliance Error:", err);

            setError(
                getErrorMessage(err, "Failed to delete compliance record.")
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

    const getAuditTitle = (item) => {

        return item.audit?.title || "N/A";
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
                        Compliance
                    </h1>

                    <p>
                        Track compliance requirements per audit
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

                    New Requirement

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
                COMPLIANCE TABLE
            ========================= */}

            <div className="users-table-container">

                {loading ? (

                    <div className="users-message">
                        Loading compliance records...
                    </div>

                ) : complianceItems.length === 0 ? (

                    <div className="users-message no-users">
                        No compliance records found.
                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Requirement</th>
                                <th>Status</th>
                                <th>Audit</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {complianceItems.map((item) => {

                                const isDeleting =
                                    deletingId === item.id;

                                return (

                                    <tr key={item.id}>

                                        <td>
                                            {item.id}
                                        </td>

                                        <td className="user-name-cell">
                                            {item.requirement}
                                        </td>

                                        <td>
                                            <span className={getStatusClass(item.status)}>
                                                {item.status || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            {getAuditTitle(item)}
                                        </td>

                                        <td>

                                            <div className="user-actions">

                                                <button
                                                    type="button"
                                                    className="user-action-btn edit"
                                                    onClick={() => openEditModal(item)}
                                                    disabled={isDeleting}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="user-action-btn delete"
                                                    onClick={() => handleDeleteCompliance(item)}
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
                ADD / EDIT COMPLIANCE MODAL
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
                                        ? "New Compliance Requirement"
                                        : "Edit Compliance Requirement"}
                                </h2>

                                <p>
                                    {modalMode === "create"
                                        ? "Add a new compliance requirement for an audit"
                                        : "Update compliance requirement details"}
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
                            ADD / EDIT COMPLIANCE FORM
                        ========================= */}

                        <form
                            className="add-user-form"
                            onSubmit={handleSaveCompliance}
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
                                REQUIREMENT
                            ========================= */}

                            <div className="user-form-group">

                                <label htmlFor="requirement">
                                    Requirement
                                </label>

                                <input
                                    id="requirement"
                                    type="text"
                                    name="requirement"
                                    value={formData.requirement}
                                    onChange={handleChange}
                                    placeholder="Enter compliance requirement"
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
                                    placeholder="Enter description"
                                    disabled={saving}
                                />

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
                                AUDIT
                            ========================= */}

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
                                            ? "Create Requirement"
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

export default Compliance;