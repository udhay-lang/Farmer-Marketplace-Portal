/* =========================================================
   cart.js
   Cart rendering, quantity controls, totals, promo code.
   ========================================================= */

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;
const VALID_PROMOS = { 'FARM10': 0.10, 'WELCOME50': 50 };

function getCartDetailed(){
  return getCart().map(item=>{
    const product = getProductById(item.productId);
    return product ? { ...item, product } : null;
  }).filter(Boolean);
}

function renderCart(){
  const items = getCartDetailed();
  const emptyState = document.getElementById('cartEmptyState');
  const layout = document.getElementById('cartLayout');

  if(!items.length){
    emptyState.classList.remove('hidden');
    layout.classList.add('hidden');
    const icon = document.getElementById('cartEmptyIcon');
    if(icon) icon.innerHTML = ICONS.cart;
    return;
  }
  emptyState.classList.add('hidden');
  layout.classList.remove('hidden');

  document.getElementById('itemCount').textContent = items.length;
  document.getElementById('cartItemsList').innerHTML = items.map(i => `
    <div class="cart-item" data-id="${i.productId}">
      <img src="${productImgSrc(i.product)}" alt="${i.product.name}">
      <div>
        <h4>${i.product.name}</h4>
        <span class="unit">${formatINR(i.product.price)} / ${i.product.unit} &middot; ${i.product.location}</span>
        <button class="cart-remove" data-remove="${i.productId}">Remove</button>
      </div>
      <div class="qty-selector">
        <button type="button" data-decr="${i.productId}">&minus;</button>
        <input type="number" value="${i.qty}" min="1" max="${i.product.quantity}" data-qtyinput="${i.productId}">
        <button type="button" data-incr="${i.productId}">+</button>
      </div>
      <div style="font-weight:800;color:var(--forest-900);">${formatINR(i.product.price * i.qty)}</div>
    </div>
  `).join('');

  updateSummary();
}

let appliedPromo = null;

function updateSummary(){
  const items = getCartDetailed();
  const subtotal = items.reduce((s,i)=> s + i.product.price * i.qty, 0);
  let delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE;
  let discount = 0;
  if(appliedPromo){
    discount = appliedPromo < 1 ? subtotal * appliedPromo : appliedPromo;
  }
  const total = Math.max(0, subtotal + delivery - discount);

  document.getElementById('sumSubtotal').textContent = formatINR(subtotal);
  document.getElementById('sumDelivery').textContent = delivery === 0 ? 'FREE' : formatINR(delivery);
  document.getElementById('sumTotal').textContent = formatINR(total);

  sessionStorage.setItem('fmp_checkout_summary', JSON.stringify({ subtotal, delivery, discount, total }));
}

function changeQty(productId, delta){
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if(!item) return;
  const product = getProductById(productId);
  const newQty = item.qty + delta;
  if(newQty < 1) return;
  if(newQty > product.quantity){ showToast(`Only ${product.quantity} ${product.unit} available.`, 'error'); return; }
  item.qty = newQty;
  saveCart(cart);
  renderCart();
  refreshNavCounts();
}
function setQty(productId, qty){
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if(!item) return;
  const product = getProductById(productId);
  qty = Math.max(1, Math.min(product.quantity, Number(qty) || 1));
  item.qty = qty;
  saveCart(cart);
  renderCart();
  refreshNavCounts();
}
function removeFromCart(productId){
  const cart = getCart().filter(i => i.productId !== productId);
  saveCart(cart);
  showToast('Item removed from cart.');
  renderCart();
  refreshNavCounts();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCart();

  document.getElementById('cartItemsList').addEventListener('click', (e)=>{
    const incr = e.target.closest('[data-incr]');
    const decr = e.target.closest('[data-decr]');
    const rem = e.target.closest('[data-remove]');
    if(incr) changeQty(incr.getAttribute('data-incr'), 1);
    if(decr) changeQty(decr.getAttribute('data-decr'), -1);
    if(rem) removeFromCart(rem.getAttribute('data-remove'));
  });
  document.getElementById('cartItemsList').addEventListener('change', (e)=>{
    const input = e.target.closest('[data-qtyinput]');
    if(input) setQty(input.getAttribute('data-qtyinput'), input.value);
  });

  document.getElementById('applyPromo').addEventListener('click', ()=>{
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    if(VALID_PROMOS[code]){
      appliedPromo = VALID_PROMOS[code];
      showToast(`Promo code ${code} applied!`, 'success');
    } else {
      showToast('Invalid promo code.', 'error');
    }
    updateSummary();
  });

  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
    const session = getSession();
    if(!session || session.role !== 'customer'){
      showToast('Please log in as a customer to checkout.', 'error');
      setTimeout(()=> location.href = 'customer-login.html?redirect=cart.html', 900);
      return;
    }
    location.href = 'checkout.html';
  });
});
