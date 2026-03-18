// ================================================================
//  Clara's Soap — Checkout Controller
//  Multi-step: 1. Contact  →  2. Delivery  →  3. Payment
//
//  ── SETUP: Fill in these 7 values before going live ──────────
//
//  checkout.html line ~11:
//    Replace YOUR_PAYPAL_CLIENT_ID with your real PayPal Client ID
//    from: developer.paypal.com → My Apps & Credentials
//
//  Below this comment block:
//    VENMO_USERNAME      Your Venmo @username (without the @)
//    ZELLE_CONTACT       Your email or phone registered with Zelle
//    CLARA_EMAIL         The Gmail address you want order alerts sent to
//    EMAILJS_PUBLIC_KEY  From emailjs.com → Account → Public Key
//    EMAILJS_SERVICE_ID  From emailjs.com → Email Services (Gmail service)
//    EMAILJS_CUSTOMER_TEMPLATE_ID  Template 1 (customer confirmation)
//    EMAILJS_CLARA_TEMPLATE_ID     Template 2 (Clara's order alert)
// ================================================================

const VENMO_USERNAME  = 'YOUR_VENMO_USERNAME';
const ZELLE_CONTACT   = 'YOUR_EMAIL_OR_PHONE';
const CLARA_EMAIL     = 'YOUR_GMAIL_ADDRESS';   // Where order alerts go

const EMAILJS_PUBLIC_KEY          = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID          = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'YOUR_CUSTOMER_TEMPLATE_ID';
const EMAILJS_CLARA_TEMPLATE_ID    = 'YOUR_CLARA_TEMPLATE_ID';

// ── State ─────────────────────────────────────────────────────
let currentStep    = 1;
let shippingCost   = 6.00;
let addGiftWrap    = false;
let paypalRendered = false;
let sessionOrderId = null;   // Unique ID for this checkout session

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const items = cart.getItems();
    if (!items || items.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    // Generate (or restore) a unique session order ID and put it in the URL
    sessionOrderId = getOrCreateSessionId();

    // EmailJS init
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}

    // Nav badge
    const badge = document.getElementById('navCartCount');
    if (badge) badge.textContent = cart.calculateTotals().itemCount || 0;

    // Venmo/Zelle handles
    setText('venmo-handle', '@' + VENMO_USERNAME);
    setText('zelle-contact', ZELLE_CONTACT);

    updateStandardShippingLabel();
    renderSummary();
    renderPaymentReview();
});

// ── Unique Session URL ─────────────────────────────────────────
// Each checkout visit gets its own URL:  checkout.html?order=CS-XXXXXX
// This makes every session traceable and feels personalised.
function getOrCreateSessionId() {
    // Check if URL already has one (e.g. browser back)
    const params = new URLSearchParams(window.location.search);
    if (params.get('order')) return params.get('order');

    // Generate a new one: CS- + 6 random alphanumeric characters
    const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'CS-';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];

    // Push into the URL bar without reloading the page
    const newUrl = window.location.pathname + '?order=' + id;
    window.history.replaceState({ orderId: id }, '', newUrl);

    return id;
}

// ── Step Navigation ────────────────────────────────────────────
function goToStep(n) {
    if (n > currentStep && !validateStep(currentStep)) return;

    document.getElementById('step' + currentStep).style.display = 'none';
    currentStep = n;
    document.getElementById('step' + currentStep).style.display = 'block';

    updateStepIndicators();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (n === 3) {
        renderPaymentReview();
        renderPayPalButton();
        updateVenmoZelleAmounts();
    }
}

function updateStepIndicators() {
    for (let i = 1; i <= 3; i++) {
        const ind    = document.getElementById('step-ind-' + i);
        const bubble = ind ? ind.querySelector('.step-bubble') : null;
        if (!ind) continue;

        ind.classList.remove('active', 'done');
        if (i < currentStep)       { ind.classList.add('done');   if (bubble) bubble.textContent = '✓'; }
        else if (i === currentStep) { ind.classList.add('active'); if (bubble) bubble.textContent = i;  }
        else                        {                               if (bubble) bubble.textContent = i;  }
    }
    for (let i = 1; i <= 2; i++) {
        const conn = document.getElementById('step-conn-' + i);
        if (conn) conn.classList.toggle('done', i < currentStep);
    }
}

// ── Validation ─────────────────────────────────────────────────
function validateStep(step) {
    let ok = true;
    if (step === 1) {
        ok = requireField('firstName', 'Required')   && ok;
        ok = requireField('lastName',  'Required')   && ok;
        ok = requireEmail('email')                   && ok;
        ok = requireField('phone',     'Required')   && ok;
    }
    if (step === 2) {
        const m = getShippingMethod();
        if (m === 'standard' || m === 'express') {
            ok = requireField('address', 'Required')              && ok;
            ok = requireField('city',    'Required')              && ok;
            ok = requireField('state',   '2-letter state code')   && ok;
            ok = requireField('zip',     'Required')              && ok;
        }
    }
    return ok;
}

function requireField(id, msg) {
    const el  = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el) return true;
    if (!el.value.trim()) {
        el.classList.add('input-error');
        if (err) err.textContent = msg;
        el.addEventListener('input', () => clearError(id), { once: true });
        return false;
    }
    clearError(id);
    return true;
}

function requireEmail(id) {
    const el  = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el) return true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) {
        el.classList.add('input-error');
        if (err) err.textContent = 'Enter a valid email address';
        el.addEventListener('input', () => clearError(id), { once: true });
        return false;
    }
    clearError(id);
    return true;
}

function clearError(id) {
    const el  = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (el)  el.classList.remove('input-error');
    if (err) err.textContent = '';
}

// ── Shipping ───────────────────────────────────────────────────
function getShippingMethod() {
    const el = document.querySelector('input[name="shipping"]:checked');
    return el ? el.value : 'standard';
}

function getShippingLabel() {
    return { standard: 'Standard Shipping', express: 'Express Shipping', pickup: 'Farm Pickup', church: 'Church Delivery' }[getShippingMethod()] || 'Shipping';
}

function onShippingChange() {
    const m = getShippingMethod();
    const addr = document.getElementById('addressFields');
    if (m === 'standard' || m === 'express') {
        if (addr) addr.style.display = 'block';
        shippingCost = m === 'express' ? 12.00 : getStandardShippingCost();
    } else {
        if (addr) addr.style.display = 'none';
        shippingCost = 0;
    }
    renderSummary();
}

function getStandardShippingCost() {
    return 5.00 + (cart.calculateTotals().itemCount * 1.00);
}

function updateStandardShippingLabel() {
    const cost = getStandardShippingCost();
    setText('standardPriceLabel', '$' + cost.toFixed(2));
    if (getShippingMethod() === 'standard') shippingCost = cost;
}

function onGiftChange() {
    addGiftWrap = document.getElementById('giftWrapping').checked;
    renderSummary();
}

// ── Summary Rendering ──────────────────────────────────────────
function getOrderTotal() {
    const totals  = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    return totals.total + shippingCost + giftCost;
}

function renderSummary() {
    const items   = cart.getItems();
    const totals  = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const final   = getOrderTotal();

    const itemsEl = document.getElementById('summaryItems');
    if (itemsEl) {
        itemsEl.innerHTML = items.length === 0
            ? '<p class="summary-empty">Your cart is empty.</p>'
            : items.map(i => `
                <div class="summary-item">
                    <span class="summary-item-name">${i.name} × ${i.quantity}</span>
                    <span class="summary-item-price">$${(i.price * i.quantity).toFixed(2)}</span>
                </div>`).join('');
    }

    setText('sumSubtotal', '$' + totals.subtotal.toFixed(2));

    const dLine = document.getElementById('sumDiscountLine');
    if (dLine) {
        dLine.style.display = totals.discount > 0 ? 'flex' : 'none';
        setText('sumDiscount', '−$' + totals.discount.toFixed(2));
    }

    setText('sumShipping', shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free');

    const gLine = document.getElementById('sumGiftLine');
    if (gLine) gLine.style.display = addGiftWrap ? 'flex' : 'none';

    setText('sumTotal', '$' + final.toFixed(2));
}

function renderPaymentReview() {
    const el = document.getElementById('paymentReview');
    if (!el) return;
    const c      = getCustomerData();
    const final  = getOrderTotal();
    el.innerHTML = `
        <div class="review-row"><span>Customer</span><span>${c.firstName} ${c.lastName}</span></div>
        <div class="review-row"><span>Email</span><span>${c.email}</span></div>
        <div class="review-row"><span>Delivery</span><span>${getShippingLabel()}</span></div>
        <div class="review-row review-row-total"><span>Total</span><span>$${final.toFixed(2)}</span></div>`;
}

// ── PayPal ─────────────────────────────────────────────────────
function renderPayPalButton() {
    if (paypalRendered) return;
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    if (typeof paypal === 'undefined') {
        container.innerHTML = '<p class="payment-note" style="color:var(--primary-pink); text-align:center; padding:1rem;">⚠️ PayPal not yet configured. Add your Client ID to checkout.html to enable card &amp; PayPal payments.</p>';
        return;
    }
    paypalRendered = true;

    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },

        createOrder: (data, actions) => {
            const totals  = cart.calculateTotals();
            const giftCost = addGiftWrap ? 3.00 : 0;
            const total   = (totals.total + shippingCost + giftCost).toFixed(2);

            return actions.order.create({
                purchase_units: [{
                    description: "Clara's Soap — Order " + sessionOrderId,
                    custom_id:   sessionOrderId,
                    amount: {
                        currency_code: 'USD',
                        value: total,
                        breakdown: {
                            item_total:  { currency_code: 'USD', value: totals.subtotal.toFixed(2) },
                            discount:    { currency_code: 'USD', value: totals.discount.toFixed(2) },
                            shipping:    { currency_code: 'USD', value: shippingCost.toFixed(2) },
                            handling:    { currency_code: 'USD', value: giftCost.toFixed(2) }
                        }
                    },
                    items: cart.getItems().map(i => ({
                        name:        i.name,
                        unit_amount: { currency_code: 'USD', value: i.price.toFixed(2) },
                        quantity:    String(i.quantity),
                        category:    'PHYSICAL_GOODS'
                    }))
                }]
            });
        },

        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                const name = details.payer.name.given_name;
                sendBothEmails('PayPal', details.id);
                cart.clearCart();
                showSuccessScreen(name, 'PayPal', details.id);
            });
        },

        onError:  err  => { console.error(err); alert('Payment error — please try again or use Venmo/Zelle.'); },
        onCancel: ()   => {}
    }).render('#paypal-button-container');
}

// ── Manual Payments (Venmo / Zelle) ────────────────────────────
function switchPayTab(tab) {
    ['paypal', 'venmo', 'zelle'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('active', t === tab);
        const panel = document.getElementById('panel-' + t);
        if (panel) panel.style.display = t === tab ? 'block' : 'none';
    });
    if (tab === 'paypal')                    renderPayPalButton();
    if (tab === 'venmo' || tab === 'zelle')  updateVenmoZelleAmounts();
}

function updateVenmoZelleAmounts() {
    const total  = getOrderTotal().toFixed(2);
    const note   = encodeURIComponent("Clara's Soap: " + cart.getItems().map(i => `${i.name} x${i.quantity}`).join(', ') + ' | Order ' + sessionOrderId);

    setText('venmo-amount', '$' + total);
    setText('zelle-amount',  '$' + total);

    const vLink = document.getElementById('venmo-link');
    if (vLink) vLink.href = `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(VENMO_USERNAME)}&amount=${total}&note=${note}`;
}

function confirmManualPayment(method) {
    const c = getCustomerData();
    if (!c.firstName || !c.email) { goToStep(1); return; }
    sendBothEmails(method, 'MANUAL-' + sessionOrderId);
    cart.clearCart();
    showSuccessScreen(c.firstName, method, null);
}

// ── Success Screen ─────────────────────────────────────────────
function showSuccessScreen(firstName, payMethod, txnId) {
    document.getElementById('checkoutMain').style.display = 'none';
    const screen = document.getElementById('successScreen');
    screen.style.display = 'flex';

    setText('successMessage', `Thank you, ${firstName}! Your order #${sessionOrderId} has been received and Clara will be in touch soon. 🌸`);

    const details = document.getElementById('successDetails');
    if (details) {
        const isManual = payMethod === 'Venmo' || payMethod === 'Zelle';
        details.innerHTML = isManual
            ? `<p>Payment method: <strong>${payMethod}</strong></p>
               <p>Once Clara confirms your payment, she'll get your order packed up!</p>`
            : `<p>Payment confirmed via <strong>${payMethod}</strong>.</p>
               ${txnId ? `<p style="font-size:0.78rem;color:var(--gray);">Transaction: ${txnId}</p>` : ''}
               <p>Check your email for a confirmation from Clara's Soap.</p>`;
    }

    // Clean up the URL — remove the session param so it's tidy
    window.history.replaceState({}, '', window.location.pathname + '?confirmed=' + sessionOrderId);
}

// ── Dual Email Send ────────────────────────────────────────────
function sendBothEmails(paymentMethod, transactionId) {
    if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID') {
        console.warn('EmailJS not configured — skipping email sends.');
        return;
    }

    const c       = getCustomerData();
    const items   = cart.getItems();
    const totals  = cart.calculateTotals();
    const giftCost = addGiftWrap ? 3.00 : 0;
    const final   = (totals.total + shippingCost + giftCost).toFixed(2);
    const address = getAddressData() || 'N/A (Pickup / Church)';
    const label   = getShippingLabel();

    // Build items HTML rows (renders inside both email templates)
    const itemsHtml = items.map(i => `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #F0E8E0;">
            <tr style="vertical-align:top;">
                <td style="padding:14px 8px 14px 0; width:100%;">
                    <div style="font-weight:600; color:#333;">${i.name}</div>
                    <div style="font-size:12px; color:#888; margin-top:3px;">Qty: ${i.quantity} &nbsp;×&nbsp; $${i.price.toFixed(2)} each</div>
                </td>
                <td style="padding:14px 0 14px 8px; white-space:nowrap; font-weight:700; color:#6B5638; vertical-align:top;">
                    $${(i.price * i.quantity).toFixed(2)}
                </td>
            </tr>
        </table>`).join('');

    // Optional discount row
    const discountLine = totals.discount > 0
        ? `<tr><td style="color:#888; padding:4px 0;">Bundle Discount 🎉</td><td style="text-align:right; color:#C9A961; padding:4px 0;">−$${totals.discount.toFixed(2)}</td></tr>`
        : '';

    // Optional gift wrap row
    const giftWrapLine = addGiftWrap
        ? `<tr><td style="color:#888; padding:4px 0;">Gift Wrapping 🎁</td><td style="text-align:right; color:#333; padding:4px 0;">$3.00</td></tr>`
        : '';

    const sharedParams = {
        order_id:         sessionOrderId,
        items_html:       itemsHtml,
        subtotal:         '$' + totals.subtotal.toFixed(2),
        discount_line:    discountLine,
        shipping_label:   label,
        shipping_cost:    shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free',
        gift_wrap_line:   giftWrapLine,
        order_total:      '$' + final,
        ship_address:     address,
        payment_method:   paymentMethod,
        transaction_id:   transactionId || 'N/A'
    };

    // ── Template 1: Customer confirmation ──────────────────
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, {
        ...sharedParams,
        customer_name: c.firstName + ' ' + c.lastName,
        to_email:      c.email
    })
    .then(() => console.log('✅ Customer email sent to', c.email))
    .catch(err => console.warn('Customer email error:', err));

    // ── Template 2: Clara's order notification ─────────────
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CLARA_TEMPLATE_ID, {
        ...sharedParams,
        customer_name:  c.firstName + ' ' + c.lastName,
        customer_email: c.email,
        customer_phone: c.phone,
        to_email:       CLARA_EMAIL
    })
    .then(() => console.log('✅ Order alert sent to Clara at', CLARA_EMAIL))
    .catch(err => console.warn('Clara email error:', err));
}

// ── Helpers ────────────────────────────────────────────────────
function getCustomerData() {
    return {
        firstName: val('firstName'),
        lastName:  val('lastName'),
        email:     val('email'),
        phone:     val('phone')
    };
}

function getAddressData() {
    const m = getShippingMethod();
    if (m !== 'standard' && m !== 'express') return null;
    return [val('address'), val('address2'), val('city'), val('state'), val('zip')].filter(Boolean).join(', ');
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
        const btn = el.nextElementSibling;
        if (btn && btn.classList.contains('copy-btn')) {
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = orig, 1800);
        }
    });
}
