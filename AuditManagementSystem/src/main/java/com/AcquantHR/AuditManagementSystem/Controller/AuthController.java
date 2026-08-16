package com.AcquantHR.AuditManagementSystem.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AcquantHR.AuditManagementSystem.DTO.LoginRequest;
import com.AcquantHR.AuditManagementSystem.DTO.LoginResponse;
import com.AcquantHR.AuditManagementSystem.DTO.RegisterRequest;
import com.AcquantHR.AuditManagementSystem.Entity.User;
import com.AcquantHR.AuditManagementSystem.Repo.UserRepository;
import com.AcquantHR.AuditManagementSystem.Security.JwtService;
import com.AcquantHR.AuditManagementSystem.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody RegisterRequest request) {

        User savedUser = userService.saveUser(request);

        return new ResponseEntity<>(
                savedUser,
                HttpStatus.CREATED
        );
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token =
                jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        LoginResponse response =
                new LoginResponse(
                        token,
                        user.getName(),
                        user.getEmail(),
                        user.getRole().getName()
                );

        return ResponseEntity.ok(response);
    }
}