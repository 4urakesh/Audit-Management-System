package com.AcquantHR.AuditManagementSystem.DTO;

import java.util.List;
import java.util.Map;

public record AnalyticsOverview(
        long totalAudits,
        long activeAudits,
        long overdueAudits,
        long totalFindings,
        long openFindings,
        long criticalOpenFindings,
        long totalComplianceItems,
        long compliantItems,
        long nonCompliantItems,
        double complianceRate,
        Map<String, Long> findingsBySeverity,
        List<String> recommendations,
        List<AuditRiskDto> highestRiskAudits) {
}
