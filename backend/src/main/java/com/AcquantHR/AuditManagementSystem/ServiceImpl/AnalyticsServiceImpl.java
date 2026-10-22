package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.AcquantHR.AuditManagementSystem.DTO.AnalyticsOverview;
import com.AcquantHR.AuditManagementSystem.DTO.AuditRiskDto;
import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.Compliance;
import com.AcquantHR.AuditManagementSystem.Entity.Finding;
import com.AcquantHR.AuditManagementSystem.Repo.AuditRepository;
import com.AcquantHR.AuditManagementSystem.Repo.ComplianceRepository;
import com.AcquantHR.AuditManagementSystem.Repo.FindingRepository;
import com.AcquantHR.AuditManagementSystem.Service.AnalyticsService;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final List<String> SEVERITIES = List.of("CRITICAL", "HIGH", "MEDIUM", "LOW");

    private final AuditRepository auditRepository;
    private final FindingRepository findingRepository;
    private final ComplianceRepository complianceRepository;

    public AnalyticsServiceImpl(
            AuditRepository auditRepository,
            FindingRepository findingRepository,
            ComplianceRepository complianceRepository) {
        this.auditRepository = auditRepository;
        this.findingRepository = findingRepository;
        this.complianceRepository = complianceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsOverview getOverview() {
        List<Audit> audits = auditRepository.findAll();
        List<Finding> findings = findingRepository.findAll();
        List<Compliance> complianceItems = complianceRepository.findAll();

        long activeAudits = audits.stream()
                .filter(audit -> isOneOf(audit.getStatus(), "PENDING", "IN_PROGRESS"))
                .count();
        long overdueAudits = audits.stream()
                .filter(this::isOverdue)
                .count();
        long openFindings = findings.stream()
                .filter(this::isOpenFinding)
                .count();
        long criticalOpenFindings = findings.stream()
                .filter(finding -> isOpenFinding(finding) && equalsIgnoreCase(finding.getSeverity(), "CRITICAL"))
                .count();
        long compliantItems = complianceItems.stream()
                .filter(item -> equalsIgnoreCase(item.getStatus(), "COMPLIANT"))
                .count();
        long nonCompliantItems = complianceItems.stream()
                .filter(item -> equalsIgnoreCase(item.getStatus(), "NON_COMPLIANT"))
                .count();

        Map<String, Long> findingsBySeverity = new LinkedHashMap<>();
        for (String severity : SEVERITIES) {
            findingsBySeverity.put(severity, findings.stream()
                    .filter(finding -> equalsIgnoreCase(finding.getSeverity(), severity))
                    .count());
        }

        double complianceRate = complianceItems.isEmpty()
                ? 0.0
                : Math.round((compliantItems * 1000.0) / complianceItems.size()) / 10.0;

        List<String> recommendations = buildRecommendations(
                audits, overdueAudits, criticalOpenFindings, nonCompliantItems);
        List<AuditRiskDto> highestRiskAudits = audits.stream()
                .map(audit -> scoreAudit(audit, findings, complianceItems))
                .sorted((left, right) -> Integer.compare(right.riskScore(), left.riskScore()))
                .limit(5)
                .toList();

        return new AnalyticsOverview(
                audits.size(),
                activeAudits,
                overdueAudits,
                findings.size(),
                openFindings,
                criticalOpenFindings,
                complianceItems.size(),
                compliantItems,
                nonCompliantItems,
                complianceRate,
                findingsBySeverity,
                recommendations,
                highestRiskAudits);
    }

    private AuditRiskDto scoreAudit(
            Audit audit,
            List<Finding> allFindings,
            List<Compliance> allComplianceItems) {
        int score = riskLevelScore(audit.getRiskLevel());
        String primaryRisk = "Inherent audit risk";

        List<Finding> findings = allFindings.stream()
                .filter(finding -> belongsToAudit(finding.getAudit(), audit))
                .toList();
        int findingRisk = findings.stream()
                .filter(this::isOpenFinding)
                .mapToInt(this::findingRisk)
                .sum();
        int complianceRisk = (int) allComplianceItems.stream()
                        .filter(item -> belongsToAudit(item.getAudit(), audit))
                        .filter(item -> equalsIgnoreCase(item.getStatus(), "NON_COMPLIANT"))
                        .count() * 15;
        boolean overdue = isOverdue(audit);
        boolean unassigned = audit.getAuditor() == null;
        boolean incompletePlan = isBlank(audit.getScope())
                || isBlank(audit.getObjectives())
                || audit.getStartDate() == null
                || audit.getEndDate() == null;

        int cappedFindingRisk = Math.min(35, findingRisk);
        int cappedComplianceRisk = Math.min(30, complianceRisk);
        score += cappedFindingRisk + cappedComplianceRisk;
        if (overdue) {
            score += 20;
        }
        if (unassigned) {
            score += 10;
        }
        if (incompletePlan) {
            score += 8;
        }

        if (cappedFindingRisk > 0
                && cappedFindingRisk >= cappedComplianceRisk
                && cappedFindingRisk >= (overdue ? 20 : 0)) {
            primaryRisk = "Open findings";
        } else if (cappedComplianceRisk > 0 && cappedComplianceRisk >= (overdue ? 20 : 0)) {
            primaryRisk = "Non-compliant requirements";
        } else if (overdue) {
            primaryRisk = "Past planned end date";
        } else if (unassigned) {
            primaryRisk = "No auditor assigned";
        } else if (incompletePlan) {
            primaryRisk = "Incomplete audit plan";
        }

        int boundedScore = Math.min(100, score);
        String riskLevel = boundedScore >= 70 ? "CRITICAL"
                : boundedScore >= 45 ? "HIGH"
                : boundedScore >= 20 ? "MEDIUM" : "LOW";
        return new AuditRiskDto(audit.getId(), audit.getTitle(), riskLevel, boundedScore, primaryRisk);
    }

    private int riskLevelScore(String riskLevel) {
        return switch (normalize(riskLevel)) {
            case "CRITICAL" -> 40;
            case "HIGH" -> 30;
            case "LOW" -> 8;
            case "MEDIUM" -> 18;
            default -> 12;
        };
    }

    private int findingRisk(Finding finding) {
        return switch (normalize(finding.getSeverity())) {
            case "CRITICAL" -> 25;
            case "HIGH" -> 15;
            case "MEDIUM" -> 8;
            case "LOW" -> 3;
            default -> 5;
        };
    }

    private boolean isOverdue(Audit audit) {
        return audit.getEndDate() != null
                && audit.getEndDate().isBefore(LocalDate.now())
                && !isOneOf(audit.getStatus(), "COMPLETED", "CANCELLED");
    }

    private boolean isOpenFinding(Finding finding) {
        return !isOneOf(finding.getStatus(), "RESOLVED", "CLOSED");
    }

    private boolean belongsToAudit(Audit relatedAudit, Audit audit) {
        return relatedAudit != null
                && relatedAudit.getId() != null
                && relatedAudit.getId().equals(audit.getId());
    }

    private List<String> buildRecommendations(
            List<Audit> audits,
            long overdueAudits,
            long criticalOpenFindings,
            long nonCompliantItems) {
        List<String> recommendations = new ArrayList<>();
        if (criticalOpenFindings > 0) {
            recommendations.add("Prioritize remediation for " + criticalOpenFindings
                    + " open critical finding(s) and confirm an accountable owner.");
        }
        if (nonCompliantItems > 0) {
            recommendations.add("Review " + nonCompliantItems
                    + " non-compliant requirement(s) and record corrective evidence.");
        }
        if (overdueAudits > 0) {
            recommendations.add("Re-baseline " + overdueAudits
                    + " overdue audit(s) or close them if fieldwork is complete.");
        }
        long incompletePlans = audits.stream()
                .filter(audit -> isBlank(audit.getScope())
                        || isBlank(audit.getObjectives())
                        || audit.getStartDate() == null
                        || audit.getEndDate() == null)
                .count();
        if (incompletePlans > 0) {
            recommendations.add("Complete scope, objectives, and dates for "
                    + incompletePlans + " audit plan(s) before fieldwork.");
        }
        if (recommendations.isEmpty()) {
            recommendations.add("No immediate risk signals detected. Continue routine evidence reviews and monitoring.");
        }
        return recommendations;
    }

    private boolean isOneOf(String value, String... candidates) {
        for (String candidate : candidates) {
            if (equalsIgnoreCase(value, candidate)) {
                return true;
            }
        }
        return false;
    }

    private boolean equalsIgnoreCase(String left, String right) {
        return left != null && left.equalsIgnoreCase(right);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
