package com.AcquantHR.AuditManagementSystem.DTO;

public record AuditRiskDto(
        Long auditId,
        String title,
        String riskLevel,
        int riskScore,
        String primaryRisk) {
}
