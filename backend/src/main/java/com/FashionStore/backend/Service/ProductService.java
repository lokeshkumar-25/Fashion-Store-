package com.FashionStore.backend.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;

import com.FashionStore.backend.Dto.ProductRequest;
import com.FashionStore.backend.Model.ProductModel;

public interface ProductService {
	
	ProductModel createProduct(ProductRequest request);
	
	List<ProductModel> getAllProduct();
	
	ProductModel getById(String id);
	
	ProductModel updateById(String id,ProductModel product);
	
	void deleteProduct(String id);
	
	List<ProductModel>getProductByCategory(String category);

	List<ProductModel> searchProducts(String name);
	
	List<ProductModel>findByBrand(String brand);
	
	List<ProductModel> findByPrice(BigDecimal min,BigDecimal max);
	
	Page<ProductModel> getProducts(int page,int size,String sortBy,String direction
	);

}
