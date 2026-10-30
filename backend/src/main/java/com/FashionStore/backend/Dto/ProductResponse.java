package com.FashionStore.backend.Dto;

	import java.math.BigDecimal;
	import java.util.List;

	
	public class ProductResponse {
	

	    private String id;
	    private String name;
	    private String description;
	    private BigDecimal price;
	    private BigDecimal discountPrice;
	    private String brand;
	    private String category;
	    private List<String> sizes;
	    private List<String> colors;
	    private List<String> images;
	    private int stock;
	    private boolean available;

	    public ProductResponse() {
	    }

	    public ProductResponse(
	            String id,
	            String name,
	            String description,
	            BigDecimal price,
	            BigDecimal discountPrice,
	            String brand,
	            String category,
	            List<String> sizes,
	            List<String> colors,
	            List<String> images,
	            int stock,
	            boolean available) {

	        this.id = id;
	        this.name = name;
	        this.description = description;
	        this.price = price;
	        this.discountPrice = discountPrice;
	        this.brand = brand;
	        this.category = category;
	        this.sizes = sizes;
	        this.colors = colors;
	        this.images = images;
	        this.stock = stock;
	        this.available = available;
	    }
	    
	    // getters and setters

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

		public BigDecimal getDiscountPrice() {
			return discountPrice;
		}

		public void setDiscountPrice(BigDecimal discountPrice) {
			this.discountPrice = discountPrice;
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

		public List<String> getSizes() {
			return sizes;
		}

		public void setSizes(List<String> sizes) {
			this.sizes = sizes;
		}

		public List<String> getColors() {
			return colors;
		}

		public void setColors(List<String> colors) {
			this.colors = colors;
		}

		public List<String> getImages() {
			return images;
		}

		public void setImages(List<String> images) {
			this.images = images;
		}

		public int getStock() {
			return stock;
		}

		public void setStock(int stock) {
			this.stock = stock;
		}

		public boolean isAvailable() {
			return available;
		}

		public void setAvailable(boolean available) {
			this.available = available;
		}
}
