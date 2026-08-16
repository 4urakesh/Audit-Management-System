package com.AcquantHR.AuditManagementSystem.Service;

import java.util.List;

import com.AcquantHR.AuditManagementSystem.Entity.Compliance;

public interface ComplianceService {

    Compliance createCompliance(Compliance compliance);

    Compliance getComplianceById(Long id);

    List<Compliance> getAllCompliance();

    Compliance updateCompliance(Long id, Compliance compliance);

    void deleteCompliance(Long id);

    List<Compliance> getComplianceByStatus(String status);
}