package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.AcquantHR.AuditManagementSystem.Entity.Audit;
import com.AcquantHR.AuditManagementSystem.Entity.User;
import com.AcquantHR.AuditManagementSystem.Exception.ResourceNotFoundException;
import com.AcquantHR.AuditManagementSystem.Exception.UnauthorizedActionException;
import com.AcquantHR.AuditManagementSystem.Repo.AuditRepository;
import com.AcquantHR.AuditManagementSystem.Repo.UserRepository;
import com.AcquantHR.AuditManagementSystem.Service.AuditService;

@Service
public class AuditServiceImpl implements AuditService {


    private final AuditRepository auditRepository;
    private final UserRepository userRepository;

    public AuditServiceImpl(
            AuditRepository auditRepository,
            UserRepository userRepository) {

        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Audit createAudit(Audit audit) {
        return auditRepository.save(audit);
    }

    @Override
    public Audit getAuditById(Long id) {
        return auditRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Audit not found with id: " + id));
    }

    @Override
    public List<Audit> getAllAudits() {
        return auditRepository.findAll();
    }

    @Override
    public Audit updateAudit(Long id, Audit audit) {

        Audit existingAudit = getAuditById(id);

        existingAudit.setTitle(audit.getTitle());
        existingAudit.setDescription(audit.getDescription());
        existingAudit.setStartDate(audit.getStartDate());
        existingAudit.setEndDate(audit.getEndDate());
        existingAudit.setStatus(audit.getStatus());
        existingAudit.setAuditor(audit.getAuditor());

        return auditRepository.save(existingAudit);
    }

    @Override
    public void deleteAudit(Long id) {

        if (!auditRepository.existsById(id)) {
            throw new ResourceNotFoundException("Audit not found with id: " + id);
        }

        auditRepository.deleteById(id);
    }

    @Override
    public List<Audit> getAuditsByStatus(String status) {
        return auditRepository.findByStatus(status);
    }

    @Override
    public Audit assignAuditor(
            Long auditId,
            Long auditorId) {

        Audit audit = auditRepository.findById(auditId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Audit not found with id: " + auditId));

        User auditor = userRepository.findById(auditorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Auditor not found with id: " + auditorId));

        if (auditor.getRole() == null ||
                !auditor.getRole().getName().equals("AUDITOR")) {

            throw new UnauthorizedActionException(
                    "Selected user is not an auditor");
        }

        audit.setAuditor(auditor);

        return auditRepository.save(audit);
    }

    @Override
    public List<Audit> getAuditsByAuditor(Long auditorId) {

        User auditor = userRepository.findById(auditorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Auditor not found with id: " + auditorId));

        return auditRepository.findByAuditor(auditor);
    }
}