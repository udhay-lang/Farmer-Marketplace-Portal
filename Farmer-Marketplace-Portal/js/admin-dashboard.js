/* =========================================================
   admin-dashboard.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(session && session.role === 'admin'){
    showAdminShell();
  }

  document.getElementById('adminLoginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('aEmail').value;
    const password = document.getElementById('aPassword').value;
    if(tryAdminLogin(email, password)){
      showToast('Welcome, Admin.', 'success');
      showAdminShell();
    } else {
      showToast('Incorrect admin credentials.', 'error');
      document.getElementById('aPassword').closest('.field').classList.add('invalid');
    }
  });
});

function showAdminShell(){
  document.getElementById('adminLoginSection').classList.add('hidden');
  document.getElementById('adminShell').classList.remove('hidden');
  buildNavbar();
  initAdminDashboard();
}

function initAdminDashboard(){
  document.getElementById('dashToggle').innerHTML = ICONS.menu;
  document.getElementById('icoFarmers').innerHTML = ICONS.users;
  document.getElementById('icoCustomers').innerHTML = ICONS.user;
  document.getElementById('icoProducts').innerHTML = ICONS.box;
  document.getElementById('icoOrders').innerHTML = ICONS.chart;

  const farmers = getFarmers();
  const customers = getCustomers();
  const products = getProducts();
  const orders = getOrders();

  document.getElementById('statFarmers').textContent = farmers.length;
  document.getElementById('statCustomers').textContent = customers.length;
  document.getElementById('statProducts').textContent = products.length;
  document.getElementById('statOrders').textContent = orders.length;

  const revenue = orders.reduce((s,o)=> s+o.total, 0);
  document.getElementById('statRevenue').textContent = formatINR(revenue);
  document.getElementById('statAvgOrder').textContent = formatINR(orders.length ? Math.round(revenue/orders.length) : 0);
  document.getElementById('statOrganic').textContent = products.filter(p=>p.organic).length;
  document.getElementById('statLowStock').textContent = products.filter(p=>p.quantity<=15).length;

  document.getElementById('farmerCount').textContent = farmers.length;
  document.getElementById('farmersBody').innerHTML = farmers.map(f => `
    <tr>
      <td><b>${f.name}</b></td><td>${f.farmName}</td><td>${f.location}</td><td>${f.phone}</td><td>${formatDate(f.createdAt)}</td>
      <td>${products.filter(p=>p.farmerId===f.id).length}</td>
      <td><button class="icon-action danger" data-delfarmer="${f.id}" title="Remove">${ICONS.trash}</button></td>
    </tr>`).join('') || `<tr><td colspan="7" class="text-muted text-center">No farmers registered yet.</td></tr>`;

  document.getElementById('customerCount').textContent = customers.length;
  document.getElementById('customersBody').innerHTML = customers.map(c => `
    <tr>
      <td><b>${c.name}</b></td><td>${c.email}</td><td>${c.phone}</td><td>${formatDate(c.createdAt)}</td>
      <td>${orders.filter(o=>o.customerId===c.id).length}</td>
      <td><button class="icon-action danger" data-delcustomer="${c.id}" title="Remove">${ICONS.trash}</button></td>
    </tr>`).join('') || `<tr><td colspan="6" class="text-muted text-center">No customers registered yet.</td></tr>`;

  document.getElementById('productCount').textContent = products.length;
  document.getElementById('productsBody').innerHTML = products.map(p => {
    const stock = stockStatus(p.quantity);
    return `
    <tr>
      <td><b>${p.name}</b></td><td>${p.farmerName}</td><td>${p.category}</td><td>${formatINR(p.price)}/${p.unit}</td>
      <td>${stock? `<span class="tag ${stock.cls}">${stock.label}</span>` : `${p.quantity} ${p.unit}`}</td>
      <td><button class="icon-action danger" data-delproduct="${p.id}" title="Remove">${ICONS.trash}</button></td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" class="text-muted text-center">No products listed yet.</td></tr>`;

  document.getElementById('orderCount').textContent = orders.length;
  document.getElementById('ordersBody').innerHTML = orders.map(o => `
    <tr>
      <td><b>${o.id}</b></td><td>${o.customerName}</td><td>${formatDate(o.createdAt)}</td><td>${formatINR(o.total)}</td>
      <td>${o.payment==='cod'?'COD':'Online'}</td>
      <td><span class="status-chip ${adminStatusChipClass((o.stages||ORDER_STAGES)[o.statusIndex])}">${(o.stages||ORDER_STAGES)[o.statusIndex]}</span></td>
    </tr>`).join('') || `<tr><td colspan="6" class="text-muted text-center">No orders placed yet.</td></tr>`;

  // deletions (delegated listeners are bound once via bindAdminDeleteHandlersOnce below)
  bindAdminDeleteHandlersOnce();
  bindAdminChromeHandlersOnce();
}

function activateAdminTab(tab){
  document.querySelectorAll('.dash-nav a[data-tab]').forEach(a => a.classList.toggle('active', a.getAttribute('data-tab')===tab));
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'panel-'+tab));
  const titles = { overview:['Overview','Platform-wide statistics and management.'], farmers:['Farmers','Manage all registered farmer accounts.'], customers:['Customers','Manage all registered customer accounts.'], products:['Products','Oversee every product listed on the platform.'], orders:['Orders','View every order placed across the platform.'] };
  document.getElementById('panelTitle').textContent = titles[tab][0];
  document.getElementById('panelSub').textContent = titles[tab][1];
  document.getElementById('dashSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

let _adminChromeHandlersBound = false;
function bindAdminChromeHandlersOnce(){
  if(_adminChromeHandlersBound) return;
  _adminChromeHandlersBound = true;

  document.querySelectorAll('[data-tab]').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); activateAdminTab(el.getAttribute('data-tab')); });
  });
  document.getElementById('adminLogout').addEventListener('click', (e)=>{ e.preventDefault(); doLogout(); });
  document.getElementById('dashToggle').addEventListener('click', ()=>{
    document.getElementById('dashSidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('show');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', ()=>{
    document.getElementById('dashSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
}

let _adminDeleteHandlersBound = false;
function bindAdminDeleteHandlersOnce(){
  if(_adminDeleteHandlersBound) return;
  _adminDeleteHandlersBound = true;

  document.getElementById('farmersBody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-delfarmer]');
    if(btn && confirm('Remove this farmer and all their products?')){
      const id = btn.getAttribute('data-delfarmer');
      saveFarmers(getFarmers().filter(f=>f.id!==id));
      saveProducts(getProducts().filter(p=>p.farmerId!==id));
      showToast('Farmer removed.', 'success');
      initAdminDashboard();
    }
  });
  document.getElementById('customersBody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-delcustomer]');
    if(btn && confirm('Remove this customer account?')){
      const id = btn.getAttribute('data-delcustomer');
      saveCustomers(getCustomers().filter(c=>c.id!==id));
      showToast('Customer removed.', 'success');
      initAdminDashboard();
    }
  });
  document.getElementById('productsBody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-delproduct]');
    if(btn && confirm('Remove this product listing?')){
      const id = btn.getAttribute('data-delproduct');
      saveProducts(getProducts().filter(p=>p.id!==id));
      showToast('Product removed.', 'success');
      initAdminDashboard();
    }
  });
}

function adminStatusChipClass(stage){
  const map = { 'Order Placed':'status-pending','Confirmed':'status-confirmed','Packed':'status-packed','Shipped':'status-shipped','Out for Delivery':'status-out','Delivered':'status-delivered' };
  return map[stage] || 'status-pending';
}
