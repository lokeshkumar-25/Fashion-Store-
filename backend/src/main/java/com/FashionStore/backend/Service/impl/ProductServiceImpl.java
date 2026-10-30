package com.FashionStore.backend.Service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.FashionStore.backend.Dto.ProductRequest;
import com.FashionStore.backend.Model.ProductModel;
import com.FashionStore.backend.Repository.ProductRepository;
import com.FashionStore.backend.Service.ProductService;

@Service
public class ProductServiceImpl implements ProductService{
	
	private final ProductRepository productRepository;
	
	public ProductServiceImpl(ProductRepository productRepository) {
		this.productRepository=productRepository;
	}
	
	@Override
	public ProductModel createProduct(ProductRequest request) {

	    ProductModel product = new ProductModel();

	    product.setName(request.getName());
	    product.setDescription(request.getDescription());
	    product.setPrice(request.getPrice());
	    product.setDiscountprice(request.getDiscountPrice());
	    product.setBrand(request.getBrand());
	    product.setCategory(request.getCategory());
	    product.setSize(request.getSizes());
	    product.setColors(request.getColors());
	    product.setImages(request.getImages());
	    product.setStock(request.getStock());

	    product.setAvailabe(
	            request.getStock() > 0
	    );
		return productRepository.save(product);
	}
	
	@Override
	public List<ProductModel>getAllProduct(){
		return productRepository.findAll();
	}
	
	@Override
	public ProductModel getById(String id) {
		return productRepository.findById(id).orElseThrow(()->new RuntimeException("Product not found"));
	}

	@Override
	public ProductModel updateById(String id,ProductModel product) {
		ProductModel existingproduct =productRepository.findById(id).orElseThrow(()->new RuntimeException("Product not found"));
		
		existingproduct.setName(product.getName());
		
		existingproduct.setDescription(product.getDescription());
		existingproduct.setPrice(product.getPrice());
		
existingproduct.setDiscountprice(product.getDiscountprice());
		
existingproduct.setBrand(product.getBrand());
existingproduct.setCategory(product.getCategory());
existingproduct.setSize(product.getSize());
existingproduct.setColors(product.getColors());
existingproduct.setImages(product.getImages());
existingproduct.setStock(product.getStock());
existingproduct.setAvailabe(product.isAvailable());

return productRepository.save(existingproduct);	
	}
	
	@Override
	public void deleteProduct(String id) {
		if(!productRepository.existsById(id)) {
			throw new RuntimeException("product not found");
		}
		productRepository.deleteById(id);
	}
	@Override
	public List<ProductModel> getProductByCategory(String category){
		return productRepository.findByCategory(category);
		
	}
	
	@Override
	public List<ProductModel> searchProducts(String name)	{
		return productRepository.findByNameContainingIgnoreCase(name);	
		}
	
	@Override
	public List<ProductModel> findByBrand(String brand){
		return productRepository.findByBrand(brand);
	}
	
	@Override
	public List<ProductModel>findByPrice(BigDecimal min,BigDecimal max){
		return productRepository.findByPrice(min, max);
	}
	
	@Override
	public Page<ProductModel> getProducts(
	        int page,
	        int size,
	        String sortBy,
	        String direction) {

	    Sort.Direction sortDirection =
	            direction.equalsIgnoreCase("desc")
	                    ? Sort.Direction.DESC
	                    : Sort.Direction.ASC;

	    Pageable pageable =
	            PageRequest.of(
	                    page,
	                    size,
	                    Sort.by(sortDirection, sortBy)
	            );

	    return productRepository.findAll(pageable);
	}
	
}
