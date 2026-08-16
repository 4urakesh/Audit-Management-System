package com.AcquantHR.AuditManagementSystem.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "findings")
public class Finding {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	private String description;

	private String severity;

	private String status;

	@ManyToOne
	@JoinColumn(name = "audit_id")
	private Audit audit;

	public Finding() {
	}

	public Finding(Long id, String title, String description, String severity, String status, Audit audit) {

		this.id = id;
		this.title = title;
		this.description = description;
		this.severity = severity;
		this.status = status;
		this.audit = audit;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Audit getAudit() {
		return audit;
	}

	public void setAudit(Audit audit) {
		this.audit = audit;
	}
}