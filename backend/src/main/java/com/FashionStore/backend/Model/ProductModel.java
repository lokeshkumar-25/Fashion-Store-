package com.FashionStore.backend.Model;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="products")
public class ProductModel {
	
	private String id;
	private String name;
	private String description;
	private BigDecimal price;
	private BigDecimal discountprice;
	private String brand;
	private String category;
	private List<String> size;
	private List<String> colors;
	private Integer stock;
	private List <String> images;
	private Boolean available;
	
	public ProductModel() {
	}

	public ProductModel(String name, String description, BigDecimal price, BigDecimal discountprice, String brand,
			String category, List<String> size, List<String> colors, Integer stock, List<String> images, Boolean available) {
		super();
		this.name = name;
		this.description = description;
		this.price = price;
		this.discountprice = discountprice;
		this.brand = brand;
		this.category = category;
		this.size = size;
		this.colors = colors;
		this.stock = stock;
		this.images = images;
		this.available = available;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getDiscountprice() {
		return discountprice;
	}

	public void setDiscountprice(BigDecimal discountprice) {
		this.discountprice = discountprice;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public List<String> getSize() {
		return size;
	}

	public void setSize(List<String> size) {
		this.size = size;
	}

	public List<String> getColors() {
		return colors;
	}

	public void setColors(List<String> colors) {
		this.colors = colors;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		stock = stock;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public Boolean isAvailable() {
		return available;
	}

	public void setAvailabe(Boolean availabe) {
		this.available = available;
	}
	
}
