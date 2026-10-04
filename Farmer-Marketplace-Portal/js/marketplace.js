/* =========================================================
   marketplace.js
   Search + filter + sort logic for the marketplace page.
   ========================================================= */

let mkState = { search:'', categories:[], locations:[], maxPrice:500, organicOnly:false, inStockOnly:false, sort:'relevance' };

function buildFilterOptions(){
  const products = getProducts();
  const categories = [...new Set(products.map(p=>p.category))].sort();
  const locations = [...new Set(products.map(p=>p.location.split(',')[1]?.trim() || p.location))].sort();

  document.getElementById('categoryFilters').innerHTML = categories.map(c=>`
    <label class="filter-option"><input type="checkbox" value="${c}" class="cat-check"> ${c}</label>
  `).join('');

  document.getElementById('locationFilters').innerHTML = locations.map(l=>`
    <label class="filter-option"><input type="checkbox" value="${l}" class="loc-check"> ${l}</label>
  `).join('');
}

function applyFilters(){
  let products = getProducts();

  if(mkState.search){
    const q = mkState.search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q));
  }
  if(mkState.categories.length){
    products = products.filter(p => mkState.categories.includes(p.category));
  }
  if(mkState.locations.length){
    products = products.filter(p => mkState.locations.some(loc => p.location.includes(loc)));
  }
  products = products.filter(p => p.price <= mkState.maxPrice);
  if(mkState.organicOnly) products = products.filter(p => p.organic);
  if(mkState.inStockOnly) products = products.filter(p => p.quantity > 0);

  switch(mkState.sort){
    case 'price-low': products.sort((a,b)=>a.price-b.price); break;
    case 'price-high': products.sort((a,b)=>b.price-a.price); break;
    case 'rating': products.sort((a,b)=>b.rating-a.rating); break;
    case 'newest': products.sort((a,b)=> new Date(b.harvestDate) - new Date(a.harvestDate)); break;
    default: break;
  }

  const grid = document.getElementById('productGrid');
  renderProductGrid(grid, products);
  document.getElementById('resultCount').textContent = `${products.length} product${products.length!==1?'s':''} found`;
}

function readFiltersFromUI(){
  mkState.categories = [...document.querySelectorAll('.cat-check:checked')].map(i=>i.value);
  mkState.locations = [...document.querySelectorAll('.loc-check:checked')].map(i=>i.value);
  mkState.maxPrice = Number(document.getElementById('priceRange').value);
  mkState.organicOnly = document.getElementById('organicOnly').checked;
  mkState.inStockOnly = document.getElementById('inStockOnly').checked;
  mkState.sort = document.getElementById('sortSelect').value;
  applyFilters();
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildFilterOptions();

  // preselect category via query string
  const params = new URLSearchParams(location.search);
  const catParam = params.get('category');
  const searchParam = params.get('search');

  document.getElementById('searchInput').insertAdjacentHTML('afterbegin', '');
  const searchIconHost = document.querySelector('.search-box span');
  if(searchIconHost) searchIconHost.innerHTML = ICONS.search;

  if(catParam){
    const cb = document.querySelector(`.cat-check[value="${catParam}"]`);
    if(cb) cb.checked = true;
  }
  if(searchParam){ document.getElementById('searchInput').value = searchParam; mkState.search = searchParam; }

  document.getElementById('priceRange').addEventListener('input', (e)=>{
    document.getElementById('priceRangeLabel').textContent = Number(e.target.value) >= 500 ? 'Up to \u20B9500+' : `Up to \u20B9${e.target.value}`;
  });

  document.getElementById('searchInput').addEventListener('input', (e)=>{
    mkState.search = e.target.value.trim();
    applyFilters();
  });

  document.querySelectorAll('.cat-check, .loc-check, #organicOnly, #inStockOnly').forEach(el=>{});
  document.getElementById('filterPanel').addEventListener('change', readFiltersFromUI);
  document.getElementById('priceRange').addEventListener('change', readFiltersFromUI);
  document.getElementById('sortSelect').addEventListener('change', readFiltersFromUI);

  document.getElementById('clearFilters').addEventListener('click', ()=>{
    document.querySelectorAll('.cat-check, .loc-check').forEach(cb=>cb.checked=false);
    document.getElementById('organicOnly').checked = false;
    document.getElementById('inStockOnly').checked = false;
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceRangeLabel').textContent = 'Up to \u20B9500+';
    document.getElementById('searchInput').value = '';
    mkState = { search:'', categories:[], locations:[], maxPrice:500, organicOnly:false, inStockOnly:false, sort:'relevance' };
    document.getElementById('sortSelect').value = 'relevance';
    applyFilters();
    showToast('Filters cleared.');
  });

  // mobile filter drawer
  const openBtn = document.getElementById('openFilter');
  const closeBtn = document.getElementById('closeFilter');
  const panel = document.getElementById('filterPanel');
  if(openBtn){
    openBtn.addEventListener('click', ()=> panel.classList.add('open'));
    closeBtn.addEventListener('click', ()=> panel.classList.remove('open'));
  }

  readFiltersFromUI();
});
