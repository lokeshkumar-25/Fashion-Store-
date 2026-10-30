package com.FashionStore.backend.Security;

	import org.springframework.security.core.userdetails.UserDetails;
	import org.springframework.security.core.userdetails.UserDetailsService;
	import org.springframework.security.core.userdetails.UsernameNotFoundException;
	import org.springframework.stereotype.Service;

import com.FashionStore.backend.Model.UserModel;
import com.FashionStore.backend.Repository.UserRepository;



	@Service
	public class CustomUserDetailsService
	        implements UserDetailsService {

	    private final UserRepository userRepository;

	    public CustomUserDetailsService(
	            UserRepository userRepository) {

	        this.userRepository = userRepository;
	    }

	    @Override
	    public UserDetails loadUserByUsername(
	            String email)
	            throws UsernameNotFoundException {

	        UserModel user =
	                userRepository.findByEmail(email)
	                        .orElseThrow(() ->
	                                new UsernameNotFoundException(
	                                        "User not found"
	                                ));

	        return org.springframework.security.core.userdetails.User
	                .withUsername(user.getEmail())
	                .password(user.getPassword())
	                .roles(user.getRole())
	                .build();
	    }
	
    
}
