package com.FashionStore.backend.Service;

import com.FashionStore.backend.Dto.AuthResponse;
import com.FashionStore.backend.Dto.LoginRequest;
import com.FashionStore.backend.Dto.RegisterRequest;

//	import com.fashionstore.dto.AuthResponse;
//	import com.fashionstore.dto.LoginRequest;
//	import com.fashionstore.dto.RegisterRequest;

	public interface AuthService {

	    AuthResponse register(RegisterRequest request);

	    AuthResponse login(LoginRequest request);
	

}
