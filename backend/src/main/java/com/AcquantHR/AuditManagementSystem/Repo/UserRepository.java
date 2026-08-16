package com.AcquantHR.AuditManagementSystem.Repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.AcquantHR.AuditManagementSystem.Entity.User;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}