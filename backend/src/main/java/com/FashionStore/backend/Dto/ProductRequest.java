package com.FashionStore.backend.Dto;

	import java.math.BigDecimal;
	import java.util.List;

	import jakarta.validation.constraints.DecimalMin;
	import jakarta.validation.constraints.Min;
	import jakarta.validation.constraints.NotBlank;
	import jakarta.validation.constraints.NotEmpty;
	import jakarta.validation.constraints.NotNull;

	public class ProductRequest {


	    @NotBlank(message = "Product name is required")
	    private String name;

	    @NotBlank(message = "Description is required")
	    private String description;

	    @NotNull(message = "Price is required")
	    @DecimalMin(
	        value = "0.01",
	        message = "Price must be greater than 0"
	    )
	    private BigDecimal price;

	    @DecimalMin(
	        value = "0.00",
	        message = "Discount price cannot be negative"
	    )
	    private BigDecimal discountPrice;

	    @NotBlank(message = "Brand is required")
	    private String brand;

	    @NotBlank(message = "Category is required")
	    private String category;

	    @NotEmpty(message = "At least one size is required")
	    private List<String> sizes;

	    @NotEmpty(message = "At least one color is required")
	    private List<String> colors;

	    private List<String> images;

	    @Min(value = 0, message = "Stock cannot be negative")
	    private int stock;

	    private boolean available;

	    public ProductRequest() {
	    }
	    

	    // Generate getters and setters

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
