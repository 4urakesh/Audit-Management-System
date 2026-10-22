package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.AcquantHR.AuditManagementSystem.DTO.AnalyticsOverview;
import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.Compliance;
import com.AcquantHR.AuditManagementSystem.Entity.Finding;
import com.AcquantHR.AuditManagementSystem.Repo.AuditRepository;
import com.AcquantHR.AuditManagementSystem.Repo.ComplianceRepository;
import com.AcquantHR.AuditManagementSystem.Repo.FindingRepository;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock
    private AuditRepository auditRepository;

    @Mock
    private FindingRepository findingRepository;

    @Mock
    private ComplianceRepository complianceRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    @Test
    void overviewAggregatesMetricsAndPrioritizesRiskSignals() {
        Audit overdueAudit = new Audit();
        overdueAudit.setId(1L);
        overdueAudit.setTitle("Access control review");
        overdueAudit.setStatus("IN_PROGRESS");
        overdueAudit.setRiskLevel("HIGH");
        overdueAudit.setEndDate(LocalDate.now().minusDays(1));

        Audit completedAudit = new Audit();
        completedAudit.setId(2L);
        completedAudit.setTitle("Vendor review");
        completedAudit.setStatus("COMPLETED");
        completedAudit.setRiskLevel("LOW");
        completedAudit.setStartDate(LocalDate.now().minusDays(5));
        completedAudit.setEndDate(LocalDate.now().plusDays(2));

        Finding criticalFinding = new Finding();
        criticalFinding.setTitle("Privileged account review overdue");
        criticalFinding.setSeverity("CRITICAL");
        criticalFinding.setStatus("OPEN");
        criticalFinding.setAudit(overdueAudit);

        Finding resolvedFinding = new Finding();
        resolvedFinding.setTitle("Old documentation");
        resolvedFinding.setSeverity("HIGH");
        resolvedFinding.setStatus("RESOLVED");
        resolvedFinding.setAudit(completedAudit);

        Compliance compliant = new Compliance();
        compliant.setStatus("COMPLIANT");
        compliant.setAudit(completedAudit);
        Compliance nonCompliant = new Compliance();
        nonCompliant.setStatus("NON_COMPLIANT");
        nonCompliant.setAudit(overdueAudit);

        when(auditRepository.findAll()).thenReturn(List.of(overdueAudit, completedAudit));
        when(findingRepository.findAll()).thenReturn(List.of(criticalFinding, resolvedFinding));
        when(complianceRepository.findAll()).thenReturn(List.of(compliant, nonCompliant));

        AnalyticsOverview overview = analyticsService.getOverview();

        assertEquals(2, overview.totalAudits());
        assertEquals(1, overview.activeAudits());
        assertEquals(1, overview.overdueAudits());
        assertEquals(2, overview.totalFindings());
        assertEquals(1, overview.openFindings());
        assertEquals(1, overview.criticalOpenFindings());
        assertEquals(50.0, overview.complianceRate());
        assertEquals(1L, overview.findingsBySeverity().get("CRITICAL"));
        assertEquals(1L, overview.findingsBySeverity().get("HIGH"));
        assertEquals(1L, overview.highestRiskAudits().get(0).auditId());
        assertTrue(overview.recommendations().stream()
                .anyMatch(recommendation -> recommendation.contains("critical finding")));
    }

    @Test
    void overviewReturnsZeroComplianceRateWhenNoRequirementsExist() {
        when(auditRepository.findAll()).thenReturn(List.of());
        when(findingRepository.findAll()).thenReturn(List.of());
        when(complianceRepository.findAll()).thenReturn(List.of());

        AnalyticsOverview overview = analyticsService.getOverview();

        assertEquals(0.0, overview.complianceRate());
        assertTrue(overview.highestRiskAudits().isEmpty());
        assertTrue(overview.recommendations().get(0).contains("No immediate risk"));
    }
}
