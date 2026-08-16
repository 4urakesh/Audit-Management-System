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

import com.AcquantHR.AuditManagementSystem.Entity.Finding;
import com.AcquantHR.AuditManagementSystem.Service.FindingService;

@RestController
@RequestMapping("/api/findings")
public class FindingController {

    private final FindingService findingService;

    public FindingController(FindingService findingService) {
        this.findingService = findingService;
    }

    @PostMapping
    public ResponseEntity<Finding> createFinding(
            @RequestBody Finding finding) {

        return ResponseEntity.ok(
                findingService.createFinding(finding)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Finding> getFindingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                findingService.getFindingById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Finding>> getAllFindings() {

        return ResponseEntity.ok(
                findingService.getAllFindings()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Finding> updateFinding(
            @PathVariable Long id,
            @RequestBody Finding finding) {

        return ResponseEntity.ok(
                findingService.updateFinding(id, finding)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFinding(
            @PathVariable Long id) {

        findingService.deleteFinding(id);

        return ResponseEntity.ok(
                "Finding deleted successfully"
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Finding>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                findingService.getFindingsByStatus(status)
        );
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Finding>> getBySeverity(
            @PathVariable String severity) {

        return ResponseEntity.ok(
                findingService.getFindingsBySeverity(severity)
        );
    }
}
