package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.AcquantHR.AuditManagementSystem.Entity.Role;
import com.AcquantHR.AuditManagementSystem.Repo.RoleRepository;
import com.AcquantHR.AuditManagementSystem.Service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}