package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.Finding;
import com.AcquantHR.AuditManagementSystem.Entity.User;
import com.AcquantHR.AuditManagementSystem.Exception.ResourceNotFoundException;
import com.AcquantHR.AuditManagementSystem.Exception.UnauthorizedActionException;
import com.AcquantHR.AuditManagementSystem.Repo.AuditRepository;
import com.AcquantHR.AuditManagementSystem.Repo.FindingRepository;
import com.AcquantHR.AuditManagementSystem.Repo.UserRepository;
import com.AcquantHR.AuditManagementSystem.Service.FindingService;

@Service
public class FindingServiceImpl implements FindingService {

    private final FindingRepository findingRepository;
    private final UserRepository userRepository;
    private final AuditRepository auditRepository;

    public FindingServiceImpl(
            FindingRepository findingRepository,
            UserRepository userRepository,
            AuditRepository auditRepository) {

        this.findingRepository = findingRepository;
        this.userRepository = userRepository;
        this.auditRepository = auditRepository;
    }

    @Override
    public Finding createFinding(Finding finding) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User auditor = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Check role
        if (auditor.getRole() == null ||
                !auditor.getRole().getName().equals("AUDITOR")) {

            throw new UnauthorizedActionException(
                    "Only AUDITOR can create finding");
        }

        // Check audit
        if (finding.getAudit() == null ||
                finding.getAudit().getId() == null) {

            throw new ResourceNotFoundException(
                    "Audit ID is required");
        }

        Long auditId =
                finding.getAudit().getId();

        // Get actual audit from database
        Audit audit = auditRepository.findById(auditId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Audit not found with id: " + auditId));

        // Check auditor assignment
        if (audit.getAuditor() == null ||
                !audit.getAuditor().getId()
                        .equals(auditor.getId())) {

            throw new UnauthorizedActionException(
                    "This audit is not assigned to you");
        }

        // Set actual audit entity
        finding.setAudit(audit);

        return findingRepository.save(finding);
    }

    @Override
    public Finding getFindingById(Long id) {

        return findingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Finding not found with id: " + id));
    }

    @Override
    public List<Finding> getAllFindings() {

        return findingRepository.findAll();
    }

    @Override
    public Finding updateFinding(
            Long id,
            Finding finding) {

        Finding existingFinding =
                getFindingById(id);

        existingFinding.setTitle(
                finding.getTitle());

        existingFinding.setDescription(
                finding.getDescription());

        existingFinding.setSeverity(
                finding.getSeverity());

        existingFinding.setStatus(
                finding.getStatus());

        /*
         * Audit change nahi karenge.
         * Finding jis audit ke saath create hui hai,
         * wahi audit rahega.
         */

        return findingRepository.save(
                existingFinding);
    }

    @Override
    public void deleteFinding(Long id) {

        if (!findingRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Finding not found with id: " + id);
        }

        findingRepository.deleteById(id);
    }

    @Override
    public List<Finding> getFindingsByStatus(
            String status) {

        return findingRepository.findByStatus(status);
    }

    @Override
    public List<Finding> getFindingsBySeverity(
            String severity) {

        return findingRepository.findBySeverity(severity);
    }
}