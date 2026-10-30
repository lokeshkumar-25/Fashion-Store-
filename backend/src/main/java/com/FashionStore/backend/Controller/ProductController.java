package com.FashionStore.backend.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FashionStore.backend.Dto.ProductRequest;
import com.FashionStore.backend.Model.ProductModel;
import com.FashionStore.backend.Service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
	
	public final ProductService productService;
	
	public ProductController(ProductService productService) {
		this.productService=productService;  
	}
	
	@PostMapping
	public ResponseEntity<ProductModel>createProduct(@Valid @RequestBody ProductRequest request ){
		return ResponseEntity.status(HttpStatus.CREATED)
	            .body(productService.createProduct(request));
	}
	@GetMapping
	public ResponseEntity <List<ProductModel>>getAllProduct(){
		return ResponseEntity.ok(productService.getAllProduct());
	}
	@GetMapping("/{id}")
	public ResponseEntity <ProductModel>getById(@PathVariable String id){
		return ResponseEntity.ok(productService.getById(id));
	}
	@PutMapping("/{id}")
	public ResponseEntity <ProductModel>updateById(@PathVariable String id,@RequestBody ProductModel product){
		return ResponseEntity.ok(productService.updateById(id, product));
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<String>deleteProduct(@PathVariable String id){
		productService.deleteProduct(id);
		return ResponseEntity.ok("Product Deleteed Successfully");
	}
	@GetMapping("/category/{category}")
	public ResponseEntity<List<ProductModel>>getProductByCategory(@PathVariable String category){
		return ResponseEntity.ok(productService.getProductByCategory(category));
	}
	@GetMapping("/brand/{brand}")
	public ResponseEntity<List<ProductModel>>findByBrand(@PathVariable("brand") String brand){
		return ResponseEntity.ok(productService.findByBrand(brand));
	}
	@GetMapping("/price")
	public ResponseEntity<List<ProductModel>>findByPrice(@RequestParam BigDecimal min, 
			                                              @RequestParam BigDecimal max){
		return ResponseEntity.ok(productService.findByPrice(min, max));
		
	}
	@GetMapping("/search")
	public ResponseEntity<List<ProductModel>>searchProducts(@RequestParam("name") String name){
		return ResponseEntity.ok(productService.searchProducts(name));
	}
	@GetMapping("/page")
	public ResponseEntity<Page<ProductModel>>getProducts(
			@RequestParam(defaultValue = "0")
			int page,
			
			@RequestParam(defaultValue = "10")
	        int size,

	        @RequestParam(defaultValue = "name")
	        String sortBy,

	        @RequestParam(defaultValue = "asc")
	        String direction) {

	    return ResponseEntity.ok(
	            productService.getProducts(
	                    page,
	                    size,
	                    sortBy,
	                    direction
	            )
	    );
	}
}
