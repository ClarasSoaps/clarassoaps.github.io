// Product Detail Page

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

// Load product details from URL parameter
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    const product = getProductById(productId);
    
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Update page title
    document.title = `${product.name} - Clara's Soap`;
    
    // Update product information
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productIngredients').textContent = product.ingredients;
    
    // Update product image
    const productImage = document.getElementById('productImage');
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.onerror = function() {
        this.src = 'images/placeholder.jpg';
    };
    
    // Update benefits list
    const benefitsList = document.getElementById('productBenefits');
    benefitsList.innerHTML = product.benefits.map(benefit => 
        `<li>${benefit}</li>`
    ).join('');
    
    // Show seasonal badge if applicable
    if (product.seasonal) {
        const productDetails = document.querySelector('.product-details');
        const seasonalBadge = document.createElement('div');
        seasonalBadge.className = 'seasonal-badge';
        seasonalBadge.textContent = 'Seasonal';
        seasonalBadge.style.position = 'relative';
        seasonalBadge.style.display = 'inline-block';
        seasonalBadge.style.marginBottom = '1rem';
        productDetails.insertBefore(seasonalBadge, productDetails.firstChild);
    }
}

// Quantity controls
function incrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add product to cart
function addProductToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (productId && quantity > 0) {
        cart.addItem(productId, quantity);
        
        // Optional: Show cart sidebar
        setTimeout(() => {
            toggleCart();
        }, 500);
    }
}
