package com.FashionStore.backend.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.FashionStore.backend.Model.CategoryModel;

public interface CategoryRepository extends MongoRepository<CategoryModel,String>{
	Optional<CategoryModel>findByName(String name);

}
