package com.AcquantHR.AuditManagementSystem.ServiceImpl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AcquantHR.AuditManagementSystem.DTO.RegisterRequest;
import com.AcquantHR.AuditManagementSystem.Entity.Role;
import com.AcquantHR.AuditManagementSystem.Entity.User;
import com.AcquantHR.AuditManagementSystem.Exception.DuplicateResourceException;
import com.AcquantHR.AuditManagementSystem.Exception.ResourceNotFoundException;
import com.AcquantHR.AuditManagementSystem.Repo.RoleRepository;
import com.AcquantHR.AuditManagementSystem.Repo.UserRepository;
import com.AcquantHR.AuditManagementSystem.Service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // =========================
    // SAVE USER
    // =========================

    @Override
    public User saveUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException(
                    "Email already registered: " + request.getEmail()
            );
        }

        Role role = roleRepository
                .findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + request.getRole()
                        )
                );

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        return userRepository.save(user);
    }


    // =========================
    // GET USER BY ID
    // =========================

    @Override
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );
    }


    // =========================
    // GET ALL USERS
    // =========================

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================
    // UPDATE USER
    // =========================

    @Override
    public User updateUser(Long id, User user) {

        User existingUser = getUserById(id);

        // Agar email change ho raha hai, naya email kisi aur user ka
        // already registered na ho ye check karo
        if (user.getEmail() != null &&
                !user.getEmail().equalsIgnoreCase(existingUser.getEmail()) &&
                userRepository.existsByEmail(user.getEmail())) {

            throw new DuplicateResourceException(
                    "Email already registered: " + user.getEmail()
            );
        }

        existingUser.setName(user.getName());

        existingUser.setEmail(user.getEmail());

        // Password sirf tab update karo jab naya diya gaya ho
        if (user.getPassword() != null && !user.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
        }

        
        if (user.getRole() != null && user.getRole().getName() != null) {

            Role resolvedRole = roleRepository
                    .findByName(user.getRole().getName())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Role not found: " + user.getRole().getName()
                            )
                    );

            existingUser.setRole(resolvedRole);
        }

        return userRepository.save(existingUser);
    }


    // =========================
    // DELETE USER
    // =========================

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "User not found with id: " + id
            );
        }

        userRepository.deleteById(id);
    }
}