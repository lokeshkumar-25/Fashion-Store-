package com.FashionStore.backend.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.FashionStore.backend.Model.UserModel;

public interface UserRepository extends MongoRepository<UserModel,String>{
	Optional<UserModel>findByEmail(String email);
	
	boolean existsByEmail(String email);
	
	

}
