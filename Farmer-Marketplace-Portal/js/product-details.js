/* =========================================================
   product-details.js
   Loads a single product by ?id= param and renders full details.
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const product = id ? getProductById(id) : null;

  document.getElementById('loadingState').classList.remove('hidden');

  setTimeout(()=>{
    document.getElementById('loadingState').classList.add('hidden');
    if(!product){
      document.getElementById('notFoundState').classList.remove('hidden');
      return;
    }
    document.getElementById('pdContent').classList.remove('hidden');
    renderProduct(product);
  }, 350); // small simulated load for a polished loading state
});

function renderProduct(p){
  document.title = p.name + ' \u2014 FarmConnect';
  document.getElementById('crumbName').textContent = p.name;
  document.getElementById('pdImage').src = productImgSrc(p);
  document.getElementById('pdImage').alt = p.name;
  document.getElementById('pdCategory').textContent = p.category;
  document.getElementById('pdCategory2').textContent = p.category;
  document.getElementById('pdName').textContent = p.name;
  document.getElementById('pdRating').innerHTML = `<span class="stars">${starString(p.rating)}</span> ${p.rating} <span class="text-muted">(${p.reviewCount} reviews)</span>`;
  document.getElementById('pdPrice').textContent = formatINR(p.price);
  document.getElementById('pdUnit').textContent = '/ ' + p.unit;
  document.getElementById('pdDescription').textContent = p.description;
  document.getElementById('pdFarmerInitial').textContent = p.farmerName.charAt(0);
  document.getElementById('pdFarmerName').textContent = p.farmerName;
  document.getElementById('pdFarmerLocation').textContent = p.location;
  document.getElementById('pdHarvest').textContent = formatDate(p.harvestDate);
  document.getElementById('pdStock').textContent = p.quantity > 0 ? `${p.quantity} ${p.unit} available` : 'Out of stock';
  document.getElementById('pdOrganic').textContent = p.organic ? 'Yes' : 'No';

  const stock = stockStatus(p.quantity);
  const stockNote = document.getElementById('pdStockNote');
  if(stock){
    stockNote.innerHTML = `<span class="tag ${stock.cls}" style="margin-bottom:1rem;display:inline-block;">${stock.label}</span>`;
  } else { stockNote.innerHTML = ''; }

  const qtyInput = document.getElementById('qtyInput');
  qtyInput.max = p.quantity;
  document.getElementById('qtyMinus').addEventListener('click', ()=>{
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById('qtyPlus').addEventListener('click', ()=>{
    qtyInput.value = Math.min(p.quantity || 1, Number(qtyInput.value) + 1);
  });
  qtyInput.addEventListener('change', ()=>{
    let v = Number(qtyInput.value) || 1;
    v = Math.max(1, Math.min(p.quantity || 1, v));
    qtyInput.value = v;
  });

  const addBtn = document.getElementById('addCartBtn');
  const buyBtn = document.getElementById('buyNowBtn');
  if(p.quantity <= 0){ addBtn.disabled = true; buyBtn.disabled = true; }
  addBtn.addEventListener('click', ()=> addToCart(p.id, Number(qtyInput.value)));
  buyBtn.addEventListener('click', ()=>{
    addToCart(p.id, Number(qtyInput.value));
    setTimeout(()=> location.href = 'cart.html', 400);
  });

  const wishBtn = document.getElementById('wishToggleBtn');
  function paintWish(){
    const active = getWishlist().includes(p.id);
    wishBtn.innerHTML = (active ? ICONS.heartFill : ICONS.heart) + ' ' + (active ? 'Wishlisted' : 'Wishlist');
  }
  paintWish();
  wishBtn.addEventListener('click', ()=>{ toggleWishlist(p.id); paintWish(); });

  // tabs
  document.querySelectorAll('.pd-tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pd-tabs button').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.pd-tab-panel').forEach(pnl=>pnl.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.getAttribute('data-pdtab')).classList.add('active');
    });
  });

  document.getElementById('tab-reviews').innerHTML = SAMPLE_REVIEWS.map(r=>`
    <div class="review-item">
      <div class="testi-avatar" style="flex-shrink:0;">${r.name.charAt(0)}</div>
      <div>
        <div class="flex items-center gap-2 mb-2"><b>${r.name}</b><span class="stars">${starString(r.rating)}</span></div>
        <p style="margin-bottom:0;">${r.text}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-farmer').innerHTML = `
    <div class="flex items-center gap-4 mb-4">
      <div class="testi-avatar" style="width:56px;height:56px;font-size:1.2rem;">${p.farmerName.charAt(0)}</div>
      <div>
        <b style="display:block;font-size:1.05rem;">${p.farmerName}</b>
        <span class="text-muted">${p.location}</span>
      </div>
    </div>
    <p>${p.farmerName} has been growing and supplying quality produce through FarmConnect, focused on sustainable farming practices and consistent freshness for every order.</p>
  `;

  // related products: same category, excluding this one
  const related = getProducts().filter(x => x.category === p.category && x.id !== p.id).slice(0,4);
  renderProductGrid(document.getElementById('relatedGrid'), related);
}
