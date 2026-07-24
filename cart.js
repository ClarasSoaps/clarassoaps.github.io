// Shopping Cart Management

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }
    
    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('clarasSoapCart');
        return saved ? JSON.parse(saved) : [];
    }
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('clarasSoapCart', JSON.stringify(this.items));
    }
    
    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }
    
    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    // Get cart totals
    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Calculate bundle discount: 4 for $20 (saves $4)
        const bundles = Math.floor(totalItems / 4);
        const discount = bundles * 4; // $6 * 4 = $24, but bundle is $20, so save $4 per bundle
        
        const total = subtotal - discount;
        
        return {
            subtotal: subtotal,
            discount: discount,
            total: total,
            itemCount: totalItems
        };
    }
    
    // Update cart display
    updateCartDisplay() {
        const totals = this.calculateTotals();
        
        // Update cart count badge
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totals.itemCount;
            el.style.display = totals.itemCount > 0 ? 'flex' : 'none';
        });
        
        // Update cart items display
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='images/placeholder.jpg'">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem('${item.id}')">&times;</button>
                    </div>
                `).join('');
            }
        }
        
        // Update totals
        const subtotalElement = document.getElementById('cartSubtotal');
        const discountElement = document.getElementById('cartDiscount');
        const discountAmountElement = document.getElementById('cartDiscountAmount');
        const totalElement = document.getElementById('cartTotal');
        
        if (subtotalElement) subtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${totals.total.toFixed(2)}`;
        
        if (discountElement && discountAmountElement) {
            if (totals.discount > 0) {
                discountElement.style.display = 'flex';
                discountAmountElement.textContent = `-$${totals.discount.toFixed(2)}`;
            } else {
                discountElement.style.display = 'none';
            }
        }
    }
    
    // Show notification (type: 'success' | 'error')
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'error' ? 'var(--brown-dark)' : 'var(--primary-pink)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-sm);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        document.body.appendChild(notification);

        const holdTime = type === 'error' ? 4000 : 2000;
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => notification.remove(), 300);
        }, holdTime);
    }
    
    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Get cart items for checkout
    getItems() {
        return this.items;
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Quick add to cart function
function quickAddToCart(productId) {
    cart.addItem(productId, 1);
}

// Newsletter signup
function handleNewsletterSignup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    // In production, this would send to a backend service
    cart.showNotification(`Thanks for subscribing, ${email}!`);
    event.target.reset();
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
