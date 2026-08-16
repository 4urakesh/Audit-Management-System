package com.AcquantHR.AuditManagementSystem.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Service.AuditService;

@RestController
@RequestMapping("/api/audits")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }
    
    @GetMapping("/auditor/{auditorId}")
    public ResponseEntity<List<Audit>> getAuditsByAuditor(
            @PathVariable Long auditorId) {

        return ResponseEntity.ok(
                auditService.getAuditsByAuditor(auditorId)
        );
    }

    // Create Audit
    @PostMapping
    public ResponseEntity<Audit> createAudit(
            @RequestBody Audit audit) {

        return ResponseEntity.ok(
                auditService.createAudit(audit)
        );
    }

    // Get Audit By ID
    @GetMapping("/{id}")
    public ResponseEntity<Audit> getAuditById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                auditService.getAuditById(id)
        );
    }

    // Get All Audits
    @GetMapping
    public ResponseEntity<List<Audit>> getAllAudits() {

        return ResponseEntity.ok(
                auditService.getAllAudits()
        );
    }

    // Update Audit
    @PutMapping("/{id}")
    public ResponseEntity<Audit> updateAudit(
            @PathVariable Long id,
            @RequestBody Audit audit) {

        return ResponseEntity.ok(
                auditService.updateAudit(id, audit)
        );
    }

    // Delete Audit
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAudit(
            @PathVariable Long id) {

        auditService.deleteAudit(id);

        return ResponseEntity.ok(
                "Audit deleted successfully"
        );
    }

    // Get Audits By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Audit>> getAuditsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                auditService.getAuditsByStatus(status)
        );
    }

    // Assign Auditor
    @PutMapping("/{auditId}/assign/{auditorId}")
    public ResponseEntity<Audit> assignAuditor(
            @PathVariable Long auditId,
            @PathVariable Long auditorId) {

        return ResponseEntity.ok(
                auditService.assignAuditor(
                        auditId,
                        auditorId
                )
        );
    }
    
    
}