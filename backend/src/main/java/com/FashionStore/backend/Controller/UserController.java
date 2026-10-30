package com.FashionStore.backend.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	    @GetMapping("/me")
	    public String getCurrentUser(
	            Authentication authentication) {

	        return "Logged in as: "
	                + authentication.getName();
	    }
	}


