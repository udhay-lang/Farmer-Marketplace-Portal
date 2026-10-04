/* =========================================================
   checkout.js
   Validates checkout form, places the order, updates stock,
   clears the cart and redirects to order-success.html
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(!session || session.role !== 'customer'){
    showToast('Please log in as a customer to checkout.', 'error');
    setTimeout(()=> location.href = 'customer-login.html?redirect=checkout.html', 900);
    return;
  }
  const cartItems = getCart();
  if(!cartItems.length){
    showToast('Your cart is empty.', 'error');
    setTimeout(()=> location.href = 'cart.html', 900);
    return;
  }

  // prefill from customer record
  const customer = getCustomers().find(c => c.id === session.id);
  const form = document.getElementById('checkoutForm');
  if(customer){
    form.fullName.value = customer.name;
    form.phone.value = customer.phone;
    form.address.value = customer.address;
  }

  renderMiniSummary();

  // payment option toggling
  document.querySelectorAll('.pay-option').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      document.querySelectorAll('.pay-option').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input[type=radio]').checked = true;
      document.getElementById('onlineFields').classList.toggle('hidden', opt.getAttribute('data-pay') !== 'online');
    });
  });

  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
});

function renderMiniSummary(){
  const items = getCart().map(i => ({...i, product: getProductById(i.productId)})).filter(i=>i.product);
  document.getElementById('miniItems').innerHTML = items.map(i => `
    <div class="mini-item"><span>${i.product.name} &times; ${i.qty}</span><span>${formatINR(i.product.price * i.qty)}</span></div>
  `).join('');

  const subtotal = items.reduce((s,i)=> s + i.product.price*i.qty, 0);
  const stored = JSON.parse(sessionStorage.getItem('fmp_checkout_summary') || 'null');
  const delivery = stored ? stored.delivery : (subtotal >= 500 ? 0 : 40);
  const discount = stored ? stored.discount : 0;
  const total = Math.max(0, subtotal + delivery - discount);

  document.getElementById('coSubtotal').textContent = formatINR(subtotal);
  document.getElementById('coDelivery').textContent = delivery === 0 ? 'FREE' : formatINR(delivery);
  document.getElementById('coTotal').textContent = formatINR(total);
}

function placeOrder(){
  const form = document.getElementById('checkoutForm');
  let valid = true;
  const fullName = form.fullName.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const city = form.city.value.trim();
  const pincode = form.pincode.value.trim();

  if(fullName.length < 3){ setFieldError(form.fullName.closest('.field'), 'Enter your full name.'); valid=false; } else setFieldError(form.fullName.closest('.field'),'');
  if(!isPhone(phone)){ setFieldError(form.phone.closest('.field'), 'Enter a valid 10-digit mobile number.'); valid=false; } else setFieldError(form.phone.closest('.field'),'');
  if(address.length < 8){ setFieldError(form.address.closest('.field'), 'Enter your full delivery address.'); valid=false; } else setFieldError(form.address.closest('.field'),'');
  if(city.length < 2){ setFieldError(form.city.closest('.field'), 'Enter your city.'); valid=false; } else setFieldError(form.city.closest('.field'),'');
  if(!/^\d{6}$/.test(pincode)){ setFieldError(form.pincode.closest('.field'), 'Enter a valid 6-digit PIN code.'); valid=false; } else setFieldError(form.pincode.closest('.field'),'');

  if(!valid){ showToast('Please fix the highlighted fields.', 'error'); return; }

  const payment = document.querySelector('input[name="payment"]:checked').value;
  const session = getSession();
  const cartItems = getCart();
  const products = getProducts();

  // verify stock still available
  for(const item of cartItems){
    const product = products.find(p => p.id === item.productId);
    if(!product || product.quantity < item.qty){
      showToast(`Not enough stock for ${product ? product.name : 'an item'}. Please update your cart.`, 'error');
      return;
    }
  }

  // deduct stock
  cartItems.forEach(item=>{
    const product = products.find(p => p.id === item.productId);
    product.quantity -= item.qty;
  });
  saveProducts(products);

  const orderItems = cartItems.map(item=>{
    const product = getProductById(item.productId);
    return { productId:item.productId, name:product.name, image:product.image, qty:item.qty, price:product.price, farmerId:product.farmerId, farmerName:product.farmerName };
  });

  const subtotal = orderItems.reduce((s,i)=> s+i.price*i.qty, 0);
  const stored = JSON.parse(sessionStorage.getItem('fmp_checkout_summary') || 'null');
  const delivery = stored ? stored.delivery : (subtotal >= 500 ? 0 : 40);
  const discount = stored ? stored.discount : 0;
  const total = Math.max(0, subtotal + delivery - discount);

  const now = new Date();
  const order = {
    id: 'FC' + now.getTime().toString().slice(-8),
    customerId: session.id,
    customerName: fullName,
    phone, address, city, pincode,
    payment,
    items: orderItems,
    subtotal, delivery, discount, total,
    statusIndex: 0,
    stages: ORDER_STAGES,
    createdAt: now.toISOString(),
    estDelivery: addDays(now, 4).toISOString()
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  saveCart([]);
  sessionStorage.removeItem('fmp_checkout_summary');
  sessionStorage.setItem('fmp_last_order', order.id);

  showToast('Order placed successfully!', 'success');
  setTimeout(()=> location.href = `order-success.html?id=${order.id}`, 600);
}
