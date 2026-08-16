package com.AcquantHR.AuditManagementSystem.Repo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.User;

public interface AuditRepository extends JpaRepository<Audit, Long> {

    List<Audit> findByStatus(String status);

    List<Audit> findByAuditor(User auditor);
}