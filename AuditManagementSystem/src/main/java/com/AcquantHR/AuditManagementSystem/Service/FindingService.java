package com.AcquantHR.AuditManagementSystem.Service;

import java.util.List;

import com.AcquantHR.AuditManagementSystem.Entity.Finding;

public interface FindingService {

    Finding createFinding(Finding finding);

    Finding getFindingById(Long id);

    List<Finding> getAllFindings();

    Finding updateFinding(Long id, Finding finding);

    void deleteFinding(Long id);

    List<Finding> getFindingsByStatus(String status);

    List<Finding> getFindingsBySeverity(String severity);
}
