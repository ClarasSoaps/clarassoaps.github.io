// Shop Page Functionality

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Load and display all products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const allProducts = getAllProducts();
    displayProducts(allProducts);
}

// Display products in grid
function displayProducts(productsArray) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (productsArray.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products match your filters.</p>';
        return;
    }
    
    productsGrid.innerHTML = productsArray.map(product => `
        <div class="product-card ${product.seasonal ? 'seasonal' : ''}" data-product-id="${product.id}">
            ${product.seasonal ? '<div class="seasonal-badge">Seasonal</div>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <button class="quick-add" onclick="quickAddToCart('${product.id}')">Quick Add</button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
            </div>
        </div>
    `).join('');
}

// Filter products based on selected filters
function filterProducts() {
    const categoryFilters = Array.from(document.querySelectorAll('input[name="filter"]:checked'))
        .map(input => input.value);
    
    const scentFilters = Array.from(document.querySelectorAll('input[name="scent-filter"]:checked'))
        .map(input => input.value);
    
    let filtered = getAllProducts();
    
    // Apply category filters
    if (categoryFilters.length > 0 && !categoryFilters.includes('all')) {
        if (categoryFilters.includes('seasonal')) {
            filtered = filtered.filter(p => p.seasonal);
        }
        if (categoryFilters.includes('bestseller')) {
            filtered = filtered.filter(p => p.bestseller);
        }
    }
    
    // Apply scent family filters
    if (scentFilters.length > 0) {
        filtered = filtered.filter(product => 
            product.scentFamily.some(family => scentFilters.includes(family))
        );
    }
    
    displayProducts(filtered);
}

// Clear all filters
function clearFilters() {
    // Uncheck all filters except "All Soaps"
    document.querySelectorAll('input[name="filter"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    
    document.querySelectorAll('input[name="scent-filter"]').forEach(input => {
        input.checked = false;
    });
    
    loadProducts();
}
