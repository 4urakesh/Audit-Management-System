package com.AcquantHR.AuditManagementSystem.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.Compliance;

public interface ComplianceRepository extends JpaRepository<Compliance, Long> {

    List<Compliance> findByAudit(Audit audit);

    List<Compliance> findByStatus(String status);
}
