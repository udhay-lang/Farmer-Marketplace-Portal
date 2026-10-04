/* =========================================================
   customer-dashboard.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(!session || session.role !== 'customer'){
    showToast('Please log in to view your dashboard.', 'error');
    setTimeout(()=> location.href = 'customer-login.html?redirect=customer-dashboard.html', 800);
    return;
  }

  document.getElementById('dashToggle').innerHTML = ICONS.menu;
  document.getElementById('icoOrders').innerHTML = ICONS.box;
  document.getElementById('icoPending').innerHTML = ICONS.clock;
  document.getElementById('icoDelivered').innerHTML = ICONS.truck;
  document.getElementById('icoWishlist').innerHTML = ICONS.heart;

  document.getElementById('sideInitial').textContent = session.name.charAt(0);
  document.getElementById('sideName').textContent = session.name;
  document.getElementById('sideEmail').textContent = session.email;

  const myOrders = getOrders().filter(o => o.customerId === session.id);
  const pending = myOrders.filter(o => o.statusIndex < 5).length;
  const delivered = myOrders.filter(o => o.statusIndex === 5).length;

  document.getElementById('statTotalOrders').textContent = myOrders.length;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statDelivered').textContent = delivered;
  document.getElementById('statWishlist').textContent = getWishlist().length;

  renderOrdersTable(document.querySelector('#recentOrdersTable tbody'), myOrders.slice(0,5));
  const allBody = document.querySelector('#allOrdersTable tbody');
  renderOrdersTable(allBody, myOrders);
  document.getElementById('ordersEmpty').classList.toggle('hidden', myOrders.length>0);
  document.getElementById('allOrdersTable').classList.toggle('hidden', myOrders.length===0);

  renderWishlistGrid();

  // profile form
  const customer = getCustomers().find(c => c.id === session.id);
  if(customer){
    document.getElementById('pName').value = customer.name;
    document.getElementById('pEmail').value = customer.email;
    document.getElementById('pPhone').value = customer.phone;
    document.getElementById('pAddress').value = customer.address;
  }
  document.getElementById('profileForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const customers = getCustomers();
    const c = customers.find(x => x.id === session.id);
    if(c){
      c.name = document.getElementById('pName').value.trim();
      c.phone = document.getElementById('pPhone').value.trim();
      c.address = document.getElementById('pAddress').value.trim();
      saveCustomers(customers);
      setSession({ ...session, name:c.name });
      showToast('Profile updated successfully.', 'success');
      document.getElementById('sideName').textContent = c.name;
    }
  });

  // tabs
  function activateTab(tab){
    document.querySelectorAll('.dash-nav a[data-tab]').forEach(a => a.classList.toggle('active', a.getAttribute('data-tab')===tab));
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'panel-'+tab));
    const titles = { overview:['Overview','Welcome back to your FarmConnect dashboard.'], orders:['My Orders','Track and review all your past orders.'], wishlist:['Wishlist','Products you have saved for later.'], profile:['Profile Settings','Manage your personal and delivery details.'] };
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

function renderOrdersTable(tbody, orders){
  if(!orders.length){ tbody.innerHTML = ''; return; }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><b>${o.id}</b></td>
      <td>${formatDate(o.createdAt)}</td>
      <td>${o.items.length} item${o.items.length!==1?'s':''}</td>
      <td>${formatINR(o.total)}</td>
      ${tbody.closest('table').id === 'allOrdersTable' ? `<td>${o.payment==='cod'?'COD':'Online'}</td>` : ''}
      <td><span class="status-chip ${statusChipClass((o.stages||ORDER_STAGES)[o.statusIndex])}">${(o.stages||ORDER_STAGES)[o.statusIndex]}</span></td>
      <td><a href="order-tracking.html?id=${o.id}" class="icon-action" title="Track order">${ICONS.eye}</a></td>
    </tr>
  `).join('');
}

function statusChipClass(stage){
  const map = { 'Order Placed':'status-pending','Confirmed':'status-confirmed','Packed':'status-packed','Shipped':'status-shipped','Out for Delivery':'status-out','Delivered':'status-delivered' };
  return map[stage] || 'status-pending';
}

function renderWishlistGrid(){
  const ids = getWishlist();
  const products = ids.map(id => getProductById(id)).filter(Boolean);
  const grid = document.getElementById('wishlistGrid');
  if(!products.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><h3>Your wishlist is empty</h3><p>Save products you love while browsing the marketplace.</p><a href="marketplace.html" class="btn btn-primary">Browse Marketplace</a></div>`;
    return;
  }
  renderProductGrid(grid, products);
}
