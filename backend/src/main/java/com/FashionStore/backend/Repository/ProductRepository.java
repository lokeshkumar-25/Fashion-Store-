package com.FashionStore.backend.Repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.FashionStore.backend.Model.ProductModel;

public interface ProductRepository  extends MongoRepository<ProductModel,String>{
	List<ProductModel> findByCategory(String category);
	List<ProductModel> findByBrand(String brand);
	List<ProductModel> findByNameContainingIgnoreCase(String name);
	List<ProductModel> findByPrice(BigDecimal min,BigDecimal max);
}
