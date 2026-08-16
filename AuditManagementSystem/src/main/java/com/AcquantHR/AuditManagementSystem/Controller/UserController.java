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

import com.AcquantHR.AuditManagementSystem.DTO.RegisterRequest;
import com.AcquantHR.AuditManagementSystem.Entity.User;
import com.AcquantHR.AuditManagementSystem.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // =========================
    // CREATE USER
    // =========================

    @PostMapping
    public ResponseEntity<User> saveUser(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                userService.saveUser(request)
        );
    }


    // =========================
    // GET USER BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // =========================
    // UPDATE USER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(id, user)
        );
    }


    // =========================
    // DELETE USER
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}