package com.AcquantHR.AuditManagementSystem.Service;

import java.util.List;

import com.AcquantHR.AuditManagementSystem.DTO.RegisterRequest;
import com.AcquantHR.AuditManagementSystem.Entity.User;

public interface UserService {

    User saveUser(RegisterRequest request);

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}