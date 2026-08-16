package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.AcquantHR.AuditManagementSystem.Entity.Compliance;
import com.AcquantHR.AuditManagementSystem.Exception.ResourceNotFoundException;
import com.AcquantHR.AuditManagementSystem.Repo.ComplianceRepository;
import com.AcquantHR.AuditManagementSystem.Service.ComplianceService;

@Service
public class ComplianceServiceImpl implements ComplianceService {

    private final ComplianceRepository complianceRepository;

    public ComplianceServiceImpl(ComplianceRepository complianceRepository) {
        this.complianceRepository = complianceRepository;
    }

    @Override
    public Compliance createCompliance(Compliance compliance) {
        return complianceRepository.save(compliance);
    }

    @Override
    public Compliance getComplianceById(Long id) {
        return complianceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Compliance record not found with id: " + id));
    }

    @Override
    public List<Compliance> getAllCompliance() {
        return complianceRepository.findAll();
    }

    @Override
    public Compliance updateCompliance(Long id, Compliance compliance) {

        Compliance existingCompliance = getComplianceById(id);

        existingCompliance.setRequirement(compliance.getRequirement());
        existingCompliance.setDescription(compliance.getDescription());
        existingCompliance.setStatus(compliance.getStatus());
        existingCompliance.setAudit(compliance.getAudit());

        return complianceRepository.save(existingCompliance);
    }

    @Override
    public void deleteCompliance(Long id) {

        if (!complianceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Compliance record not found with id: " + id);
        }

        complianceRepository.deleteById(id);
    }

    @Override
    public List<Compliance> getComplianceByStatus(String status) {
        return complianceRepository.findByStatus(status);
    }
}