package com.AcquantHR.AuditManagementSystem.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "compliance")
public class Compliance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String requirement;

	private String description;

	private String status;

	@ManyToOne
	@JoinColumn(name = "audit_id")
	private Audit audit;

	public Compliance() {
	}

	public Compliance(Long id, String requirement, String description, String status, Audit audit) {

		this.id = id;
		this.requirement = requirement;
		this.description = description;
		this.status = status;
		this.audit = audit;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRequirement() {
		return requirement;
	}

	public void setRequirement(String requirement) {
		this.requirement = requirement;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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