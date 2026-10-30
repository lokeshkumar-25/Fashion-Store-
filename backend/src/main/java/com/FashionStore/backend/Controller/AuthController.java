package com.FashionStore.backend.Controller;

	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.*;

import com.FashionStore.backend.Dto.AuthResponse;
import com.FashionStore.backend.Dto.LoginRequest;
import com.FashionStore.backend.Dto.RegisterRequest;
import com.FashionStore.backend.Service.AuthService;


	@RestController
	@RequestMapping("/api/auth")
	@CrossOrigin(origins = "http://localhost:5173")
	public class AuthController {

	    private final AuthService authService;

	    public AuthController(AuthService authService) {
	        this.authService = authService;
	    }

	    @PostMapping("/register")
	    public ResponseEntity<AuthResponse> register(
	            @RequestBody RegisterRequest request) {

	        return ResponseEntity.ok(
	                authService.register(request)
	        );
	    }

	    @PostMapping("/login")
	    public ResponseEntity<AuthResponse> login(
	            @RequestBody LoginRequest request) {

	        return ResponseEntity.ok(
	                authService.login(request)
	        );
	    }
	

}
