/* =========================================================
   product-card.js
   Renders a consistent product card + handles quick add-to-cart
   and wishlist toggling from any page.
   ========================================================= */

function productImgSrc(p){ return imgPath(p.image); }

function renderProductCard(p){
  const wishlist = getWishlist();
  const isWished = wishlist.includes(p.id);
  const stock = stockStatus(p.quantity);
  const detailHref = resolveHref('pages/product-details.html') + '?id=' + p.id;

  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-media">
      <a href="${detailHref}"><img src="${productImgSrc(p)}" alt="${p.name}" loading="lazy"></a>
      <div class="product-badges">
        ${p.organic? `<span class="tag tag-organic">Organic</span>`:''}
        ${stock? `<span class="tag ${stock.cls}">${stock.label}</span>`:''}
      </div>
      <button class="wish-btn ${isWished?'active':''}" data-wish="${p.id}" aria-label="Toggle wishlist">${isWished?ICONS.heartFill:ICONS.heart}</button>
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <a href="${detailHref}"><h3 class="product-title">${p.name}</h3></a>
      <div class="product-meta">${ICONS.mapPin}<span>${p.location}</span></div>
      <div class="rating"><span class="stars">${starString(p.rating)}</span> ${p.rating} <span class="text-muted">(${p.reviewCount})</span></div>
      <div class="product-price-row">
        <div class="product-price">${formatINR(p.price)} <span>/ ${p.unit}</span></div>
        <button class="btn btn-primary btn-sm" data-addcart="${p.id}" ${p.quantity<=0?'disabled':''}>${ICONS.cart}</button>
      </div>
    </div>
  </div>`;
}

function renderProductGrid(container, products){
  if(!products.length){
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon" style="color:var(--leaf-600);">${ICONS.leaf}</div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms to find what you're looking for.</p>
      </div>`;
    return;
  }
  container.innerHTML = products.map(renderProductCard).join('');
}

function addToCart(productId, qty=1){
  const product = getProductById(productId);
  if(!product || product.quantity <= 0){ showToast('This product is out of stock.', 'error'); return; }
  const cart = getCart();
  const existing = cart.find(i => i.productId === productId);
  const currentQty = existing ? existing.qty : 0;
  if(currentQty + qty > product.quantity){
    showToast(`Only ${product.quantity} ${product.unit} available in stock.`, 'error');
    return;
  }
  if(existing){ existing.qty += qty; } else { cart.push({ productId, qty }); }
  saveCart(cart);
  showToast(`${product.name} added to cart.`, 'success');
  refreshNavCounts();
}

function toggleWishlist(productId){
  let wishlist = getWishlist();
  const product = getProductById(productId);
  if(wishlist.includes(productId)){
    wishlist = wishlist.filter(id => id !== productId);
    showToast(`Removed ${product.name} from wishlist.`);
  } else {
    wishlist.push(productId);
    showToast(`${product.name} added to wishlist.`, 'success');
  }
  saveWishlist(wishlist);
  refreshNavCounts();
}

function refreshNavCounts(){
  buildNavbar();
  document.querySelectorAll('[data-wish]').forEach(btn=>{
    const id = btn.getAttribute('data-wish');
    const active = getWishlist().includes(id);
    btn.classList.toggle('active', active);
    btn.innerHTML = active ? ICONS.heartFill : ICONS.heart;
  });
}

document.addEventListener('click', (e)=>{
  const addBtn = e.target.closest('[data-addcart]');
  if(addBtn){ addToCart(addBtn.getAttribute('data-addcart'), 1); }
  const wishBtn = e.target.closest('[data-wish]');
  if(wishBtn){ toggleWishlist(wishBtn.getAttribute('data-wish')); }
});
