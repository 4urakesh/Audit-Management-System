package com.AcquantHR.AuditManagementSystem.Service;

import java.util.List;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;

public interface AuditService {

    Audit createAudit(Audit audit);

    Audit getAuditById(Long id);

    List<Audit> getAllAudits();

    Audit updateAudit(Long id, Audit audit);

    void deleteAudit(Long id);

    List<Audit> getAuditsByStatus(String status);
    
    Audit assignAuditor(Long auditId, Long auditorId);
    
    List<Audit> getAuditsByAuditor(Long auditorId);
}
