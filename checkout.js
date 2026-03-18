// ============================================================
//  Clara's Soap — Checkout
//  Multi-step: Contact → Delivery → Payment
//
//  SETUP CHECKLIST (replace these placeholders before going live):
//  1. PayPal:   In checkout.html, replace YOUR_PAYPAL_CLIENT_ID
//               → developer.paypal.com → My Apps & Credentials
//  2. Venmo:    Change VENMO_USERNAME below to Clara's Venmo @username
//  3. Zelle:    Change ZELLE_CONTACT below to Clara's email or phone
//  4. EmailJS:  Sign up at emailjs.com, then fill in the 3 values below
// ============================================================

// ── ① Credentials to fill in ──────────────────────────────
const VENMO_USERNAME  = 'YOUR_VENMO_USERNAME';   // e.g. 'ClarasSoap'
const ZELLE_CONTACT   = 'YOUR_EMAIL_OR_PHONE';   // e.g. 'hello@clarassoap.com'

const EMAILJS_PUBLIC_KEY   = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID   = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID  = 'YOUR_EMAILJS_TEMPLATE_ID';
// ──────────────────────────────────────────────────────────

// State
let currentStep = 1;
let shippingCost = 6.00;
let addGiftWrap = false;

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Redirect to shop if cart is empty
    const items = cart.getItems();
    if (!items || items.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    // Update nav cart badge
    const navBadge = document.getElementById('navCartCount');
    if (navBadge) navBadge.textContent = cart.calculateTotals().itemCount || 0;

    // EmailJS init (safe to call even with placeholder key)
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}

    // Set initial shipping price label
    updateStandardShippingLabel();
    renderSummary();
    renderPaymentReview();

    // Set Venmo / Zelle handles
    const venmoEl = document.getElementById('venmo-handle');
    const zelleEl = document.getElementById('zelle-contact');
    if (venmoEl) venmoEl.textContent = '@' + VENMO_USERNAME;
    if (zelleEl) zelleEl.textContent = ZELLE_CONTACT;
});

// ── Step Navigation ───────────────────────────────────────
function goToStep(n) {
    if (n > currentStep && !validateStep(currentStep)) return;

    document.getElementById('step' + currentStep).style.display = 'none';
    currentStep = n;
    document.getElementById('step' + currentStep).style.display = 'block';

    updateStepIndicators();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render PayPal buttons when step 3 is first reached
    if (n === 3) {
        renderPaymentReview();
        renderPayPalButton();
        updateVenmoZelleAmounts();
    }
}

function updateStepIndicators() {
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById('step-ind-' + i);
        const bubble = ind ? ind.querySelector('.step-bubble') : null;
        if (!ind) continue;

        ind.classList.remove('active', 'done');
        if (i < currentStep) {
            ind.classList.add('done');
            if (bubble) bubble.textContent = '✓';
        } else if (i === currentStep) {
            ind.classList.add('active');
            if (bubble) bubble.textContent = i;
        } else {
            if (bubble) bubble.textContent = i;
        }
    }
    // Connectors
    for (let i = 1; i <= 2; i++) {
        const conn = document.getElementById('step-conn-' + i);
        if (conn) conn.classList.toggle('done', i < currentStep);
    }
}

// ── Validation ────────────────────────────────────────────
function validateStep(step) {
    let ok = true;

    if (step === 1) {
        ok = requireField('firstName', 'Required') && ok;
        ok = requireField('lastName', 'Required') && ok;
        ok = requireEmail('email') && ok;
        ok = requireField('phone', 'Required') && ok;
    }

    if (step === 2) {
        const method = getShippingMethod();
        if (method === 'standard' || method === 'express') {
            ok = requireField('address', 'Required') && ok;
            ok = requireField('city', 'Required') && ok;
            ok = requireField('state', 'Enter 2-letter state code') && ok;
            ok = requireField('zip', 'Required') && ok;
        }
    }

    return ok;
}

function requireField(id, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el) return true;
    const val = el.value.trim();
    if (!val) {
        el.classList.add('input-error');
        if (err) err.textContent = msg;
        el.addEventListener('input', () => clearError(id), { once: true });
        return false;
    }
    clearError(id);
    return true;
}

function requireEmail(id) {
    const el = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el) return true;
    const val = el.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!valid) {
        el.classList.add('input-error');
        if (err) err.textContent = 'Enter a valid email address';
        el.addEventListener('input', () => clearError(id), { once: true });
        return false;
    }
    clearError(id);
    return true;
}

function clearError(id) {
    const el = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (el) el.classList.remove('input-error');
    if (err) err.textContent = '';
}

// ── Shipping Logic ────────────────────────────────────────
function getShippingMethod() {
    const checked = document.querySelector('input[name="shipping"]:checked');
    return checked ? checked.value : 'standard';
}

function onShippingChange() {
    const method = getShippingMethod();
    const addressPanel = document.getElementById('addressFields');

    if (method === 'standard' || method === 'express') {
        if (addressPanel) addressPanel.style.display = 'block';
        shippingCost = method === 'express' ? 12.00 : getStandardShippingCost();
    } else {
        if (addressPanel) addressPanel.style.display = 'none';
        shippingCost = 0;
    }

    renderSummary();
}

function getStandardShippingCost() {
    const totals = cart.calculateTotals();
    return 5.00 + (totals.itemCount * 1.00);
}

function updateStandardShippingLabel() {
    const label = document.getElementById('standardPriceLabel');
    const cost = getStandardShippingCost();
    if (label) label.textContent = '$' + cost.toFixed(2);
    // Update shippingCost if standard is currently selected
    if (getShippingMethod() === 'standard') {
        shippingCost = cost;
    }
}

function onGiftChange() {
    addGiftWrap = document.getElementById('giftWrapping').checked;
    renderSummary();
}

// ── Summary Rendering ─────────────────────────────────────
function renderSummary() {
    const items = cart.getItems();
    const totals = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const finalTotal = totals.total + shippingCost + giftCost;

    // Items list
    const itemsEl = document.getElementById('summaryItems');
    if (itemsEl) {
        if (items.length === 0) {
            itemsEl.innerHTML = '<p class="summary-empty">Your cart is empty.</p>';
        } else {
            itemsEl.innerHTML = items.map(item => `
                <div class="summary-item">
                    <span class="summary-item-name">${item.name} × ${item.quantity}</span>
                    <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }
    }

    // Totals
    setText('sumSubtotal', '$' + totals.subtotal.toFixed(2));

    const discountLine = document.getElementById('sumDiscountLine');
    if (discountLine) {
        if (totals.discount > 0) {
            discountLine.style.display = 'flex';
            setText('sumDiscount', '−$' + totals.discount.toFixed(2));
        } else {
            discountLine.style.display = 'none';
        }
    }

    setText('sumShipping', shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free');

    const giftLine = document.getElementById('sumGiftLine');
    if (giftLine) giftLine.style.display = addGiftWrap ? 'flex' : 'none';

    setText('sumTotal', '$' + finalTotal.toFixed(2));
}

function renderPaymentReview() {
    const el = document.getElementById('paymentReview');
    if (!el) return;

    const customer = getCustomerData();
    const method = getShippingMethod();
    const methodLabel = { standard: 'Standard Shipping', express: 'Express Shipping', pickup: 'Farm Pickup', church: 'Church Delivery' }[method] || method;
    const totals = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const finalTotal = totals.total + shippingCost + giftCost;

    el.innerHTML = `
        <div class="review-row"><span>Customer</span><span>${customer.firstName} ${customer.lastName}</span></div>
        <div class="review-row"><span>Email</span><span>${customer.email}</span></div>
        <div class="review-row"><span>Delivery</span><span>${methodLabel}</span></div>
        <div class="review-row review-row-total"><span>Order Total</span><span>$${finalTotal.toFixed(2)}</span></div>
    `;
}

// ── PayPal Integration ────────────────────────────────────
let paypalRendered = false;

function renderPayPalButton() {
    if (paypalRendered) return;
    if (typeof paypal === 'undefined') {
        document.getElementById('paypal-button-container').innerHTML =
            '<p class="payment-note" style="color:var(--primary-pink);">⚠️ PayPal is not configured yet. Add your Client ID to checkout.html to enable card payments.</p>';
        return;
    }
    paypalRendered = true;

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay',
            height: 48
        },

        // Called when PayPal opens — passes the order total
        createOrder: function(data, actions) {
            const totals = cart.calculateTotals();
            const giftCost = addGiftWrap ? 3.00 : 0;
            const finalTotal = (totals.total + shippingCost + giftCost).toFixed(2);
            const items = cart.getItems();

            return actions.order.create({
                purchase_units: [{
                    description: "Clara's Soap Order",
                    amount: {
                        currency_code: 'USD',
                        value: finalTotal,
                        breakdown: {
                            item_total: { currency_code: 'USD', value: totals.subtotal.toFixed(2) },
                            discount: { currency_code: 'USD', value: totals.discount.toFixed(2) },
                            shipping: { currency_code: 'USD', value: shippingCost.toFixed(2) },
                            handling: { currency_code: 'USD', value: giftCost.toFixed(2) }
                        }
                    },
                    items: items.map(item => ({
                        name: item.name,
                        unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
                        quantity: String(item.quantity),
                        category: 'PHYSICAL_GOODS'
                    }))
                }]
            });
        },

        // Called when the customer approves payment
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderDetails) {
                const payerName = orderDetails.payer.name.given_name;
                sendOrderEmail('PayPal', orderDetails.id);
                cart.clearCart();
                showSuccessScreen(payerName, 'PayPal', orderDetails.id);
            });
        },

        onError: function(err) {
            console.error('PayPal error:', err);
            alert('There was an issue processing your payment. Please try again or use Venmo/Zelle.');
        },

        onCancel: function() {
            // No action needed — user simply closed the PayPal window
        }

    }).render('#paypal-button-container');
}

// ── Manual Payment (Venmo / Zelle) ───────────────────────
function switchPayTab(tab) {
    ['paypal', 'venmo', 'zelle'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('active', t === tab);
        const panel = document.getElementById('panel-' + t);
        if (panel) panel.style.display = t === tab ? 'block' : 'none';
    });

    if (tab === 'paypal') renderPayPalButton();
    if (tab === 'venmo' || tab === 'zelle') updateVenmoZelleAmounts();
}

function updateVenmoZelleAmounts() {
    const totals = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const finalTotal = (totals.total + shippingCost + giftCost).toFixed(2);

    setText('venmo-amount', '$' + finalTotal);
    setText('zelle-amount', '$' + finalTotal);

    // Build Venmo deep link
    const noteItems = cart.getItems().map(i => `${i.name} x${i.quantity}`).join(', ');
    const note = encodeURIComponent("Clara's Soap: " + noteItems);
    const venmoLink = `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(VENMO_USERNAME)}&amount=${finalTotal}&note=${note}`;
    const venmoEl = document.getElementById('venmo-link');
    if (venmoEl) venmoEl.href = venmoLink;
}

function confirmManualPayment(method) {
    const customer = getCustomerData();
    if (!customer.firstName) {
        alert('Please complete steps 1 and 2 first.');
        goToStep(1);
        return;
    }
    sendOrderEmail(method, 'MANUAL-' + Date.now());
    cart.clearCart();
    showSuccessScreen(customer.firstName, method, null);
}

// ── Success Screen ────────────────────────────────────────
function showSuccessScreen(firstName, paymentMethod, transactionId) {
    document.getElementById('checkoutMain').style.display = 'none';
    const screen = document.getElementById('successScreen');
    screen.style.display = 'flex';

    setText('successMessage',
        `Thank you, ${firstName}! Your order has been received and Clara will be in touch soon.`);

    const details = document.getElementById('successDetails');
    if (details) {
        const isManual = paymentMethod === 'Venmo' || paymentMethod === 'Zelle';
        details.innerHTML = isManual
            ? `<p>Payment method: <strong>${paymentMethod}</strong></p>
               <p>Once Clara confirms your payment, she'll get your order ready! 🌸</p>`
            : `<p>Payment confirmed via <strong>${paymentMethod}</strong>.</p>
               ${transactionId ? `<p style="font-size:0.8rem;color:var(--gray);">Transaction ID: ${transactionId}</p>` : ''}`;
    }
}

// ── EmailJS Notification ──────────────────────────────────
function sendOrderEmail(paymentMethod, transactionId) {
    if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID') return; // Not configured yet

    const customer = getCustomerData();
    const items = cart.getItems();
    const totals = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const finalTotal = (totals.total + shippingCost + giftCost).toFixed(2);
    const method = getShippingMethod();
    const address = getAddressData();

    const itemsList = items.map(i => `${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n');

    const templateParams = {
        customer_name:   `${customer.firstName} ${customer.lastName}`,
        customer_email:  customer.email,
        customer_phone:  customer.phone,
        payment_method:  paymentMethod,
        transaction_id:  transactionId || 'N/A',
        items_list:      itemsList,
        subtotal:        '$' + totals.subtotal.toFixed(2),
        discount:        totals.discount > 0 ? '−$' + totals.discount.toFixed(2) : '$0.00',
        shipping_method: method,
        shipping_cost:   shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free',
        gift_wrap:       addGiftWrap ? 'Yes (+$3.00)' : 'No',
        order_total:     '$' + finalTotal,
        ship_address:    address || 'N/A (Pickup/Church)',
        to_email:        customer.email
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => console.log('Order email sent.'))
        .catch(err => console.warn('EmailJS error:', err));
}

// ── Helpers ───────────────────────────────────────────────
function getCustomerData() {
    return {
        firstName: val('firstName'),
        lastName:  val('lastName'),
        email:     val('email'),
        phone:     val('phone')
    };
}

function getAddressData() {
    const method = getShippingMethod();
    if (method !== 'standard' && method !== 'express') return null;
    const parts = [val('address'), val('address2'), val('city'), val('state'), val('zip')].filter(Boolean);
    return parts.join(', ');
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function copyText(id) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
        const original = el.nextElementSibling;
        if (original && original.classList.contains('copy-btn')) {
            original.textContent = 'Copied!';
            setTimeout(() => original.textContent = 'Copy', 1800);
        }
    });
}
