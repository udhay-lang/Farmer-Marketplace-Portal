/* =========================================================
   order-tracking.js
   Renders the order-placed -> delivered timeline for a given order.
   ========================================================= */

function ORDER_STAGES_LOCAL(order){ return order.stages || ['Order Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered']; }

function renderTracking(order){
  document.getElementById('trackResult').classList.remove('hidden');
  document.getElementById('trackEmpty').classList.add('hidden');

  document.getElementById('resOrderId').textContent = 'Order #' + order.id;
  document.getElementById('resMeta').textContent = `Placed on ${formatDate(order.createdAt)} \u2022 Estimated delivery ${formatDate(order.estDelivery)}`;

  const stages = ORDER_STAGES_LOCAL(order);
  const currentStage = stages[order.statusIndex];
  const chip = document.getElementById('resStatusChip');
  chip.textContent = currentStage;
  chip.className = 'status-chip ' + statusChipClass(currentStage);

  const tracker = document.getElementById('tracker');
  const fillPercent = order.statusIndex === 0 ? 0 : (order.statusIndex / (stages.length-1)) * 90;
  tracker.innerHTML = `<div class="tracker-fill" style="width:${fillPercent}%;"></div>` + stages.map((s,i)=>{
    let cls = '';
    if(i < order.statusIndex) cls = 'done';
    else if(i === order.statusIndex) cls = 'current';
    return `
      <div class="tstep ${cls}">
        <div class="dot">${i < order.statusIndex ? ICONS.checkSm : (i+1)}</div>
        <b>${s}</b>
        <span>${i <= order.statusIndex ? formatDate(order.createdAt) : 'Pending'}</span>
      </div>`;
  }).join('');

  document.getElementById('resItemsBody').innerHTML = order.items.map(i => `
    <tr><td>${i.name}</td><td>${i.qty}</td><td>${formatINR(i.price)}</td><td>${formatINR(i.price*i.qty)}</td></tr>
  `).join('');

  document.getElementById('resAddress').textContent = `${order.address}, ${order.city} - ${order.pincode}`;
  document.getElementById('resPayment').textContent = order.payment === 'cod' ? 'Cash on Delivery' : 'Online Payment';
}

function statusChipClass(stage){
  const map = { 'Order Placed':'status-pending','Confirmed':'status-confirmed','Packed':'status-packed','Shipped':'status-shipped','Out for Delivery':'status-out','Delivered':'status-delivered' };
  return map[stage] || 'status-pending';
}

function loadOrder(id){
  const order = getOrders().find(o => o.id.toLowerCase() === id.trim().toLowerCase());
  if(!order){
    document.getElementById('trackResult').classList.add('hidden');
    document.getElementById('trackEmpty').classList.remove('hidden');
    return;
  }
  renderTracking(order);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');
  if(idParam){
    document.getElementById('orderIdInput').value = idParam;
    loadOrder(idParam);
  }
  document.getElementById('trackBtn').addEventListener('click', ()=>{
    const val = document.getElementById('orderIdInput').value.trim();
    if(!val){ showToast('Enter an order ID to track.', 'error'); return; }
    loadOrder(val);
  });
  document.getElementById('orderIdInput').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') document.getElementById('trackBtn').click();
  });
});
