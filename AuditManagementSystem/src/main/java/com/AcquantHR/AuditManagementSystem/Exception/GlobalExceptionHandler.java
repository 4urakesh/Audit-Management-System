package com.AcquantHR.AuditManagementSystem.Exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= HELPER =================

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> body = new HashMap<>();

        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return new ResponseEntity<>(body, status);
    }


    // ================= NOT FOUND =================

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ResourceNotFoundException ex) {

        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }


    // ================= DUPLICATE =================

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(
            DuplicateResourceException ex) {

        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }


    // ================= UNAUTHORIZED ACTION =================

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(
            UnauthorizedActionException ex) {

        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }


    // ================= BAD LOGIN CREDENTIALS =================

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex) {

        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
        );
    }


    // ================= USER NOT FOUND (Login) =================

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFound(
            UsernameNotFoundException ex) {

        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }


    // ================= DB CONSTRAINT VIOLATIONS =================
    // (e.g. duplicate email that slipped past manual check,
    //  or any other DB unique constraint violation)

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(
            DataIntegrityViolationException ex) {

        return buildResponse(
                HttpStatus.CONFLICT,
                "This record conflicts with existing data (possibly a duplicate)."
        );
    }


    // ================= FALLBACK: ANY OTHER RUNTIME EXCEPTION =================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleGenericRuntime(
            RuntimeException ex) {

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }


    // ================= FALLBACK: ANY UNEXPECTED EXCEPTION =================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex) {

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again."
        );
    }
}