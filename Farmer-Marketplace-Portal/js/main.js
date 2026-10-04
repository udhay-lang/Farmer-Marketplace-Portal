/* =========================================================
   main.js
   Shared chrome: navbar, footer, toasts, icon set, mobile nav.
   Runs on every page after data.js.
   ========================================================= */

const ICONS = {
  leaf:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 9-11 6 3 9 7 9 11a7 7 0 0 1-7 7c-1.5 0-3-.5-4-1.5"/><path d="M4 13c4 0 7-2 9-5"/></svg>`,
  search:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  cart:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>`,
  heart:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  heartFill:`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  user:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  menu:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:`<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  checkSm:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  truck:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  box:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>`,
  chart:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  edit:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  eye:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  mapPin:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  users:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  shield:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  clock:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  wallet:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-5a2 2 0 0 1 0-4h5z"/></svg>`,
  star:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.63 22 9.24 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.24 8.91 8.63 12 2"/></svg>`,
  plane:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12l10-4 10 4-10 4-10-4z"/></svg>`,
  phone:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6.2 6.2l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>`,
  mail:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  facebook:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>`,
  instagram:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`,
  twitter:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.6-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.7 11.7 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.3 4a4.1 4.1 0 0 1-1.9.1c.5 1.7 2.1 2.9 4 3A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg>`,
};

/* ---------------- Toast ---------------- */
function ensureToastWrap(){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  return wrap;
}
function showToast(message, type='default'){
  const wrap = ensureToastWrap();
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="dot-icon"></span><span>${message}</span>`;
  wrap.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 350);
  }, 3200);
}

/* ---------------- Path helpers ---------------- */
function inPagesDir(){ return location.pathname.includes('/pages/'); }
function rootPath(){ return inPagesDir() ? '' : 'pages/'; }
function homePath(){ return inPagesDir() ? '../index.html' : 'index.html'; }

/* ---------------- Navbar ---------------- */
const NAV_LINKS = [
  { href:'index.html', label:'Home', key:'home' },
  { href:'marketplace.html', label:'Marketplace', key:'marketplace' },
  { href:'about.html', label:'About Us', key:'about' },
  { href:'contact.html', label:'Contact', key:'contact' },
];

function resolveHref(target){
  // target given relative to project root (e.g. 'index.html' or 'pages/cart.html')
  if(!inPagesDir()) return target;
  if(target === 'index.html') return '../index.html';
  return target.replace('pages/', '');
}

function buildNavbar(){
  const mount = document.getElementById('navbar-mount');
  if(!mount) return;
  const session = getSession();
  const activeKey = document.body.getAttribute('data-page') || '';

  const linksHtml = NAV_LINKS.map(l =>
    `<a href="${resolveHref(l.href)}" class="${activeKey===l.key?'active':''}">${l.label}</a>`
  ).join('');

  const cartCount = getCart().reduce((s,i)=> s+i.qty, 0);
  const wishCount = getWishlist().length;

  let actionsHtml = '';
  if(session && session.role === 'customer'){
    actionsHtml += `
      <a href="${resolveHref('pages/wishlist-redirect')}" class="icon-btn" id="navWishBtn" title="Wishlist" onclick="location.href='${resolveHref('pages/customer-dashboard.html')}#wishlist';return false;">${ICONS.heart}${wishCount? `<span class="badge-count">${wishCount}</span>`:''}</a>
      <a href="${resolveHref('pages/cart.html')}" class="icon-btn" title="Cart">${ICONS.cart}${cartCount? `<span class="badge-count">${cartCount}</span>`:''}</a>
      <a href="${resolveHref('pages/customer-dashboard.html')}" class="user-chip hide-mobile"><span class="dot">${session.name.charAt(0)}</span> ${session.name.split(' ')[0]}</a>
    `;
  } else if(session && session.role === 'farmer'){
    actionsHtml += `<a href="${resolveHref('pages/farmer-dashboard.html')}" class="user-chip hide-mobile"><span class="dot">${session.name.charAt(0)}</span> ${session.name.split(' ')[0]}</a>`;
  } else if(session && session.role === 'admin'){
    actionsHtml += `<a href="${resolveHref('pages/admin-dashboard.html')}" class="user-chip hide-mobile"><span class="dot">A</span> Admin</a>`;
  } else {
    actionsHtml += `
      <a href="${resolveHref('pages/cart.html')}" class="icon-btn" title="Cart">${ICONS.cart}${cartCount? `<span class="badge-count">${cartCount}</span>`:''}</a>
      <a href="${resolveHref('pages/customer-login.html')}" class="btn btn-outline btn-sm hide-mobile">Log In</a>
      <a href="${resolveHref('pages/customer-register.html')}" class="btn btn-primary btn-sm hide-mobile">Sign Up</a>
    `;
  }

  mount.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="${homePath()}" class="brand"><img src="${imgPath('logo.svg')}" alt="FarmConnect logo">FarmConnect</a>
        <div class="nav-links" id="navLinks">
          ${linksHtml}
          <div class="show-mobile-only" id="navMobileExtra" style="display:none;"></div>
        </div>
        <div class="nav-actions">
          ${actionsHtml}
          <button class="nav-toggle icon-btn" id="navToggle" aria-label="Toggle menu">${ICONS.menu}</button>
        </div>
      </div>
    </nav>
  `;

  // mobile-only auth/dashboard links appended inside nav-links for small screens
  const navLinksEl = document.getElementById('navLinks');
  const mobileExtra = document.createElement('div');
  mobileExtra.style.cssText = 'display:flex;flex-direction:column;gap:1rem;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line-200);width:100%;';
  if(session && session.role==='customer'){
    mobileExtra.innerHTML = `<a href="${resolveHref('pages/customer-dashboard.html')}">My Dashboard</a><a href="${resolveHref('pages/cart.html')}">Cart (${cartCount})</a><a href="#" id="mobLogout">Log Out</a>`;
  } else if(session && session.role === 'farmer'){
    mobileExtra.innerHTML = `<a href="${resolveHref('pages/farmer-dashboard.html')}">Farmer Dashboard</a><a href="#" id="mobLogout">Log Out</a>`;
  } else if(session && session.role === 'admin'){
    mobileExtra.innerHTML = `<a href="${resolveHref('pages/admin-dashboard.html')}">Admin Dashboard</a><a href="#" id="mobLogout">Log Out</a>`;
  } else {
    mobileExtra.innerHTML = `<a href="${resolveHref('pages/customer-login.html')}">Customer Log In</a><a href="${resolveHref('pages/customer-register.html')}">Customer Sign Up</a><a href="${resolveHref('pages/farmer-login.html')}">Farmer Log In</a>`;
  }
  navLinksEl.appendChild(mobileExtra);

  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', ()=>{
    navLinksEl.classList.toggle('open');
    toggle.innerHTML = navLinksEl.classList.contains('open') ? ICONS.close : ICONS.menu;
  });
  const mobLogout = document.getElementById('mobLogout');
  if(mobLogout) mobLogout.addEventListener('click', (e)=>{ e.preventDefault(); doLogout(); });
}

function doLogout(){
  clearSession();
  showToast('You have been logged out.', 'success');
  setTimeout(()=> location.href = homePath(), 700);
}

/* ---------------- Footer ---------------- */
function buildFooter(){
  const mount = document.getElementById('footer-mount');
  if(!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><img src="${imgPath('logo.svg')}" alt="logo">FarmConnect</div>
            <p>A direct farmer-to-customer marketplace bringing fresh, honestly-priced harvests from Indian farms to your kitchen.</p>
            <div class="social-row">
              <a href="#" aria-label="Facebook">${ICONS.facebook}</a>
              <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="#" aria-label="Twitter">${ICONS.twitter}</a>
            </div>
          </div>
          <div>
            <h4>Marketplace</h4>
            <ul>
              <li><a href="${resolveHref('pages/marketplace.html')}">All Products</a></li>
              <li><a href="${resolveHref('pages/marketplace.html')}?category=Vegetables">Vegetables</a></li>
              <li><a href="${resolveHref('pages/marketplace.html')}?category=Fruits">Fruits</a></li>
              <li><a href="${resolveHref('pages/marketplace.html')}?category=Organic">Organic</a></li>
            </ul>
          </div>
          <div>
            <h4>For Farmers</h4>
            <ul>
              <li><a href="${resolveHref('pages/farmer-register.html')}">Sell on FarmConnect</a></li>
              <li><a href="${resolveHref('pages/farmer-login.html')}">Farmer Login</a></li>
              <li><a href="${resolveHref('pages/farmer-dashboard.html')}">Farmer Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="${resolveHref('pages/about.html')}">About Us</a></li>
              <li><a href="${resolveHref('pages/contact.html')}">Contact / Support</a></li>
              <li><a href="${resolveHref('pages/admin-dashboard.html')}">Admin Login</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 FarmConnect. Final-year academic project &mdash; not a real commercial platform.</span>
          <span>Made for Farmers. Built with care.</span>
        </div>
      </div>
    </footer>
  `;
}

/* ---------------- Init on every page ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  buildNavbar();
  buildFooter();
});
