/* =========================================================
   farmer-dashboard.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(!session || session.role !== 'farmer'){
    showToast('Please log in as a farmer to view your dashboard.', 'error');
    setTimeout(()=> location.href = 'farmer-login.html', 800);
    return;
  }

  ['icoProducts','icoOrders'].forEach(id=> document.getElementById(id).innerHTML = ICONS.box);
  document.getElementById('icoPending').innerHTML = ICONS.clock;
  document.getElementById('icoSales').innerHTML = ICONS.wallet;
  document.getElementById('dashToggle').innerHTML = ICONS.menu;

  document.getElementById('sideInitial').textContent = session.name.charAt(0);
  document.getElementById('sideName').textContent = session.name;
  document.getElementById('sideEmail').textContent = session.email;

  function myProducts(){ return getProducts().filter(p => p.farmerId === session.id); }
  function myOrders(){
    const ids = myProducts().map(p=>p.id);
    return getOrders().filter(o => o.items.some(i => i.farmerId === session.id));
  }

  function computeStats(){
    const products = myProducts();
    const orders = myOrders();
    const pending = orders.filter(o => o.statusIndex < 5).length;
    const sales = orders.reduce((sum,o)=> sum + o.items.filter(i=>i.farmerId===session.id).reduce((s,i)=>s+i.price*i.qty,0), 0);
    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statPendingOrders').textContent = pending;
    document.getElementById('statTotalOrders').textContent = orders.length;
    document.getElementById('statSales').textContent = formatINR(sales);
  }

  function renderRecentOrders(){
    const orders = myOrders().slice(0,5);
    const tbody = document.querySelector('#recentOrdersTable tbody');
    if(!orders.length){ tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No orders yet.</td></tr>`; return; }
    tbody.innerHTML = orders.map(o=>{
      const mine = o.items.filter(i=>i.farmerId===session.id);
      const amt = mine.reduce((s,i)=>s+i.price*i.qty,0);
      return `<tr><td><b>${o.id}</b></td><td>${o.customerName}</td><td>${mine.length} item${mine.length!==1?'s':''}</td><td>${formatINR(amt)}</td><td><span class="status-chip ${statusChipClass((o.stages||ORDER_STAGES)[o.statusIndex])}">${(o.stages||ORDER_STAGES)[o.statusIndex]}</span></td></tr>`;
    }).join('');
  }

  function renderAllOrders(){
    const orders = myOrders();
    const tbody = document.querySelector('#allOrdersTable tbody');
    document.getElementById('ordersEmpty').classList.toggle('hidden', orders.length>0);
    document.getElementById('allOrdersTable').classList.toggle('hidden', orders.length===0);
    tbody.innerHTML = orders.map(o=>{
      const mine = o.items.filter(i=>i.farmerId===session.id);
      const amt = mine.reduce((s,i)=>s+i.price*i.qty,0);
      const stages = o.stages || ORDER_STAGES;
      return `
      <tr>
        <td><b>${o.id}</b></td><td>${o.customerName}</td><td>${formatDate(o.createdAt)}</td><td>${formatINR(amt)}</td>
        <td><span class="status-chip ${statusChipClass(stages[o.statusIndex])}">${stages[o.statusIndex]}</span></td>
        <td>
          <select class="sort-select" data-orderstatus="${o.id}" style="padding:.4rem .6rem;">
            ${stages.map((s,i)=> `<option value="${i}" ${i===o.statusIndex?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
      </tr>`;
    }).join('');
  }

  function renderLowStock(){
    const low = myProducts().filter(p => p.quantity <= 15);
    const list = document.getElementById('lowStockList');
    if(!low.length){ list.innerHTML = `<p class="text-muted" style="margin-bottom:0;">All products are well stocked.</p>`; return; }
    list.innerHTML = low.map(p=> `<div class="row"><span>${p.name}</span><span class="tag ${p.quantity<=0?'tag-out':'tag-low'}">${p.quantity<=0?'Out of stock':p.quantity+' '+p.unit+' left'}</span></div>`).join('');
  }

  function refreshAll(){
    computeStats(); renderRecentOrders(); renderAllOrders(); renderLowStock();
  }
  refreshAll();

  // profile
  const farmers = getFarmers();
  const farmer = farmers.find(f => f.id === session.id);
  if(farmer){
    document.getElementById('pName').value = farmer.name;
    document.getElementById('pEmail').value = farmer.email;
    document.getElementById('pPhone').value = farmer.phone;
    document.getElementById('pFarmName').value = farmer.farmName;
    document.getElementById('pLocation').value = farmer.location;
  }
  document.getElementById('profileForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const list = getFarmers();
    const f = list.find(x=>x.id===session.id);
    if(f){
      f.name = document.getElementById('pName').value.trim();
      f.phone = document.getElementById('pPhone').value.trim();
      f.farmName = document.getElementById('pFarmName').value.trim();
      f.location = document.getElementById('pLocation').value.trim();
      saveFarmers(list);
      setSession({...session, name:f.name});
      showToast('Profile updated successfully.', 'success');
      document.getElementById('sideName').textContent = f.name;
    }
  });

  document.querySelector('#allOrdersTable tbody').addEventListener('change', (e)=>{
    const sel = e.target.closest('[data-orderstatus]');
    if(!sel) return;
    const orders = getOrders();
    const order = orders.find(o => o.id === sel.getAttribute('data-orderstatus'));
    if(order){
      order.statusIndex = Number(sel.value);
      saveOrders(orders);
      showToast(`Order ${order.id} marked as ${ (order.stages||ORDER_STAGES)[order.statusIndex] }.`, 'success');
      refreshAll();
    }
  });

  // tabs
  function activateTab(tab){
    document.querySelectorAll('.dash-nav a[data-tab]').forEach(a => a.classList.toggle('active', a.getAttribute('data-tab')===tab));
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'panel-'+tab));
    const titles = { overview:['Overview',"A quick look at your farm's performance on FarmConnect."], products:['Manage Products','Add, edit or remove your product listings.'], orders:['Orders','Track and update the status of incoming orders.'], profile:['Profile Settings','Manage your farm and account details.'] };
    document.getElementById('panelTitle').textContent = titles[tab][0];
    document.getElementById('panelSub').textContent = titles[tab][1];
    document.getElementById('dashSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  }
  document.querySelectorAll('[data-tab]').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); activateTab(el.getAttribute('data-tab')); });
  });
  const hash = location.hash.replace('#','');
  if(hash) activateTab(hash);

  document.getElementById('logoutLink').addEventListener('click', (e)=>{ e.preventDefault(); doLogout(); });
  document.getElementById('dashToggle').addEventListener('click', ()=>{
    document.getElementById('dashSidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('show');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', ()=>{
    document.getElementById('dashSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
});

function statusChipClass(stage){
  const map = { 'Order Placed':'status-pending','Confirmed':'status-confirmed','Packed':'status-packed','Shipped':'status-shipped','Out for Delivery':'status-out','Delivered':'status-delivered' };
  return map[stage] || 'status-pending';
}
