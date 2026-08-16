package com.AcquantHR.AuditManagementSystem.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.Finding;


public interface FindingRepository extends JpaRepository<Finding, Long> {

    List<Finding> findByAudit(Audit audit);

    List<Finding> findBySeverity(String severity);

    List<Finding> findByStatus(String status);
}