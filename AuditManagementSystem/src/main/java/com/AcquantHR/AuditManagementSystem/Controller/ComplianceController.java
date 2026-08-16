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

import com.AcquantHR.AuditManagementSystem.Entity.Compliance;
import com.AcquantHR.AuditManagementSystem.Service.ComplianceService;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @PostMapping
    public ResponseEntity<Compliance> createCompliance(
            @RequestBody Compliance compliance) {

        return ResponseEntity.ok(
                complianceService.createCompliance(compliance)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compliance> getComplianceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                complianceService.getComplianceById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Compliance>> getAllCompliance() {

        return ResponseEntity.ok(
                complianceService.getAllCompliance()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compliance> updateCompliance(
            @PathVariable Long id,
            @RequestBody Compliance compliance) {

        return ResponseEntity.ok(
                complianceService.updateCompliance(id, compliance)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompliance(
            @PathVariable Long id) {

        complianceService.deleteCompliance(id);

        return ResponseEntity.ok(
                "Compliance deleted successfully"
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Compliance>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                complianceService.getComplianceByStatus(status)
        );
    }
}
