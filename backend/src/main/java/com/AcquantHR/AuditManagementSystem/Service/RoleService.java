package com.AcquantHR.AuditManagementSystem.Service;

import java.util.List;

import com.AcquantHR.AuditManagementSystem.Entity.Role;

public interface RoleService {

    Role saveRole(Role role);

    Role getRoleById(Long id);

    List<Role> getAllRoles();

    void deleteRole(Long id);
}