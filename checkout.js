// Checkout Page Functionality

let currentShipping = 5.00; // Standard shipping default
let giftWrapping = false;

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutSummary();
    setupCheckoutHandlers();
});

// Load cart items and summary
function loadCheckoutSummary() {
    const cartItems = cart.getItems();
    
    if (cartItems.length === 0) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Display cart items in summary
    const summaryItems = document.getElementById('summaryItems');
    if (summaryItems) {
        summaryItems.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    updateCheckoutTotals();
}

// Update checkout totals
function updateCheckoutTotals() {
    const cartTotals = cart.calculateTotals();
    
    // Update summary display
    document.getElementById('summarySubtotal').textContent = `$${cartTotals.subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = currentShipping > 0 ? `$${currentShipping.toFixed(2)}` : 'Free';
    
    // Show/hide discount
    const discountLine = document.getElementById('summaryDiscountLine');
    if (cartTotals.discount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-$${cartTotals.discount.toFixed(2)}`;
    } else {
        discountLine.style.display = 'none';
    }
    
    // Show/hide gift wrapping
    const giftLine = document.getElementById('summaryGiftLine');
    if (giftWrapping) {
        giftLine.style.display = 'flex';
    } else {
        giftLine.style.display = 'none';
    }
    
    // Calculate final total
    const giftCost = giftWrapping ? 3.00 : 0;
    const finalTotal = cartTotals.total + currentShipping + giftCost;
    document.getElementById('summaryTotal').textContent = `$${finalTotal.toFixed(2)}`;
    
    // Update standard shipping price based on number of items
    updateStandardShippingPrice(cartTotals.itemCount);
}

// Update standard shipping price
function updateStandardShippingPrice(itemCount) {
    // Base $5 + $1 per soap
    const standardPrice = 5.00 + (itemCount * 1.00);
    const standardPriceElement = document.getElementById('standardPrice');
    if (standardPriceElement) {
        standardPriceElement.textContent = `$${standardPrice.toFixed(2)}`;
    }
    
    // Update current shipping if standard is selected
    const standardRadio = document.querySelector('input[name="shipping"][value="standard"]');
    if (standardRadio && standardRadio.checked) {
        currentShipping = standardPrice;
        updateCheckoutTotals();
    }
}

// Update shipping based on selection
function updateShipping() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked').value;
    const cartTotals = cart.calculateTotals();
    const itemCount = cartTotals.itemCount;
    
    const shippingPanel = document.getElementById('shippingAddressPanel');
    
    switch(selectedShipping) {
        case 'standard':
            currentShipping = 5.00 + (itemCount * 1.00);
            shippingPanel.style.display = 'block';
            break;
        case 'express':
            currentShipping = 12.00;
            shippingPanel.style.display = 'block';
            break;
        case 'pickup':
        case 'church':
            currentShipping = 0;
            shippingPanel.style.display = 'none';
            break;
    }
    
    updateCheckoutTotals();
}

// Update gift wrapping
function updateGiftWrapping() {
    giftWrapping = document.getElementById('giftWrapping').checked;
    updateCheckoutTotals();
}

// Setup event handlers
function setupCheckoutHandlers() {
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }
}

// Handle checkout submission
function handleCheckout(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        shipping: document.querySelector('input[name="shipping"]:checked').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        giftWrapping: giftWrapping
    };
    
    // Add address if needed
    if (formData.shipping === 'standard' || formData.shipping === 'express') {
        formData.address = {
            street: document.getElementById('address').value,
            street2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value
        };
    }
    
    // Get cart and totals
    const cartItems = cart.getItems();
    const cartTotals = cart.calculateTotals();
    const giftCost = giftWrapping ? 3.00 : 0;
    const finalTotal = cartTotals.total + currentShipping + giftCost;
    
    // Create order object
    const order = {
        customer: formData,
        items: cartItems,
        totals: {
            subtotal: cartTotals.subtotal,
            discount: cartTotals.discount,
            shipping: currentShipping,
            giftWrapping: giftCost,
            total: finalTotal
        }
    };
    
    // In production, this would send to a backend payment processor
    console.log('Order:', order);
    
    // Simulate order processing
    alert(`Thank you for your order, ${formData.firstName}! Your total is $${finalTotal.toFixed(2)}.\n\nIn production, you would be redirected to complete payment via ${formData.payment}.`);
    
    // Clear cart and redirect
    // cart.clearCart();
    // window.location.href = 'index.html';
}
