package com.FashionStore.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.FashionStore.backend.Model.OrderModel;



public interface OrderRepository  extends MongoRepository<OrderModel, String> {

	    List<OrderModel> findByUserIdOrderByCreatedAtDesc(String userId);
	}


