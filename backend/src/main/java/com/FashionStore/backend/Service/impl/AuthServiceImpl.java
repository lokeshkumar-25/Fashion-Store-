package com.FashionStore.backend.Service.impl;

	import org.springframework.security.authentication.AuthenticationManager;
	import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
	import org.springframework.security.crypto.password.PasswordEncoder;
	import org.springframework.stereotype.Service;

import com.FashionStore.backend.Dto.AuthResponse;
import com.FashionStore.backend.Dto.LoginRequest;
import com.FashionStore.backend.Dto.RegisterRequest;
import com.FashionStore.backend.Model.UserModel;
import com.FashionStore.backend.Repository.UserRepository;
import com.FashionStore.backend.Security.JwtService;
import com.FashionStore.backend.Service.AuthService;

@Service
	public class AuthServiceImpl implements AuthService {

	    private final UserRepository  userRepository;
	    private final PasswordEncoder passwordEncoder;
	    private final JwtService jwtService;
	    private final AuthenticationManager authenticationManager;

	    public AuthServiceImpl(
	            UserRepository userRepository,
	            PasswordEncoder passwordEncoder,
	            JwtService jwtService,
	            AuthenticationManager authenticationManager) {

	        this.userRepository = userRepository;
	        this.passwordEncoder = passwordEncoder;
	        this.jwtService = jwtService;
	        this.authenticationManager =
	                authenticationManager;
	    }

	    @Override
	    public AuthResponse register(
	            RegisterRequest request) {

	        if (userRepository.existsByEmail(
	                request.getEmail())) {

	            throw new RuntimeException(
	                    "Email already registered"
	            );
	        }

	        UserModel user = new UserModel();

	        user.setName(request.getName());
	        user.setEmail(request.getEmail());

	        user.setPassword(
	                passwordEncoder.encode(
	                        request.getPassword()
	                )
	        );

	        user.setRole("USER");

	        UserModel savedUser =
	                userRepository.save(user);

	        String token =
	                jwtService.generateToken(
	                        savedUser.getEmail(),
	                        savedUser.getRole()
	                );

	        return new AuthResponse(
	                token,
	                savedUser.getId(),
	                savedUser.getName(),
	                savedUser.getEmail(),
	                savedUser.getRole()
	        );
	    }

	    @Override
	    public AuthResponse login(
	            LoginRequest request) {

	        authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                        request.getEmail(),
	                        request.getPassword()
	                )
	        );

	        UserModel user =
	                userRepository.findByEmail(
	                        request.getEmail()
	                ).orElseThrow(() ->
	                        new RuntimeException(
	                                "User not found"
	                        ));

	        String token =
	                jwtService.generateToken(
	                        user.getEmail(),
	                        user.getRole()
	                );

	        return new AuthResponse(
	                token,
	                user.getId(),
	                user.getName(),
	                user.getEmail(),
	                user.getRole()
	        );
	    }
	

}
