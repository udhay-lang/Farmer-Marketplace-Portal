/* =========================================================
   manage-products.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(!session || session.role !== 'farmer'){
    showToast('Please log in as a farmer to manage products.', 'error');
    setTimeout(()=> location.href = 'farmer-login.html', 800);
    return;
  }
  document.getElementById('dashToggle').innerHTML = ICONS.menu;
  document.getElementById('sideInitial').textContent = session.name.charAt(0);
  document.getElementById('sideName').textContent = session.name;
  document.getElementById('sideEmail').textContent = session.email;
  document.querySelector('.search-box span').innerHTML = ICONS.search;

  function myProducts(){ return getProducts().filter(p => p.farmerId === session.id); }

  function renderTable(filter=''){
    let products = myProducts();
    if(filter) products = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    document.getElementById('prodCount').textContent = myProducts().length;
    const tbody = document.querySelector('#productsTable tbody');
    document.getElementById('productsEmpty').classList.toggle('hidden', myProducts().length>0);
    document.getElementById('productsTable').classList.toggle('hidden', myProducts().length===0);

    if(!products.length && myProducts().length>0){
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">No products match your search.</td></tr>`;
      return;
    }
    tbody.innerHTML = products.map(p=>{
      const stock = stockStatus(p.quantity);
      return `
      <tr>
        <td class="flex items-center gap-3"><img src="${productImgSrc(p)}" alt="${p.name}"><span>${p.name}</span></td>
        <td>${p.category}</td>
        <td>${formatINR(p.price)}/${p.unit}</td>
        <td>${p.quantity} ${p.unit}</td>
        <td>${stock? `<span class="tag ${stock.cls}">${stock.label}</span>` : `<span class="tag tag-organic">In stock</span>`}</td>
        <td class="row-actions">
          <button class="icon-action" data-editproduct="${p.id}" title="Edit">${ICONS.edit}</button>
          <button class="icon-action danger" data-deleteproduct="${p.id}" title="Delete">${ICONS.trash}</button>
        </td>
      </tr>`;
    }).join('');
  }
  renderTable();

  document.getElementById('searchProducts').addEventListener('input', (e)=> renderTable(e.target.value.trim()));

  document.querySelector('#productsTable tbody').addEventListener('click', (e)=>{
    const editBtn = e.target.closest('[data-editproduct]');
    const delBtn = e.target.closest('[data-deleteproduct]');
    if(editBtn) openEditModal(editBtn.getAttribute('data-editproduct'));
    if(delBtn) deleteProduct(delBtn.getAttribute('data-deleteproduct'));
  });

  function deleteProduct(id){
    if(!confirm('Delete this product? This cannot be undone.')) return;
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    showToast('Product deleted.', 'success');
    renderTable(document.getElementById('searchProducts').value.trim());
  }

  function openEditModal(id){
    const p = getProductById(id);
    if(!p) return;
    document.getElementById('editId').value = p.id;
    document.getElementById('editName').value = p.name;
    document.getElementById('editPrice').value = p.price;
    document.getElementById('editQuantity').value = p.quantity;
    document.getElementById('editDescription').value = p.description;
    document.getElementById('editModal').classList.remove('hidden');
  }
  document.getElementById('closeEditModal').addEventListener('click', ()=> document.getElementById('editModal').classList.add('hidden'));
  document.getElementById('editProductForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const products = getProducts();
    const p = products.find(x=>x.id===id);
    if(p){
      p.name = document.getElementById('editName').value.trim();
      p.price = Number(document.getElementById('editPrice').value);
      p.quantity = Number(document.getElementById('editQuantity').value);
      p.description = document.getElementById('editDescription').value.trim();
      saveProducts(products);
      showToast('Product updated successfully.', 'success');
      document.getElementById('editModal').classList.add('hidden');
      renderTable(document.getElementById('searchProducts').value.trim());
    }
  });

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
