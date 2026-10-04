/* =========================================================
   data.js
   Seed data + localStorage data-access layer for the whole app.
   Every page includes this file before its own script.
   ========================================================= */

const DB_KEYS = {
  farmers: 'fmp_farmers',
  customers: 'fmp_customers',
  products: 'fmp_products',
  orders: 'fmp_orders',
  cart: 'fmp_cart',
  wishlist: 'fmp_wishlist',
  session: 'fmp_session',
  seeded: 'fmp_seeded_v1'
};

const IMG = 'assets/images/'; // relative from project root; pages/ files prefix with ../

function imgPath(file){
  // pages live one level deep, index.html lives at root
  const inPages = location.pathname.includes('/pages/');
  return (inPages ? '../assets/images/' : 'assets/images/') + file;
}

/* ---------------- Seed data ---------------- */
const SEED_FARMERS = [
  { id:'f1', name:'Ramesh Kumar',  email:'ramesh@farm.com',  password:'farmer123', phone:'9876500001', location:'Thanjavur, Tamil Nadu', farmName:'Kaveri Organic Farms', createdAt:'2024-11-02' },
  { id:'f2', name:'Lakshmi Devi',  email:'lakshmi@farm.com', password:'farmer123', phone:'9876500002', location:'Madurai, Tamil Nadu',   farmName:'Vaigai Green Farms',   createdAt:'2024-12-10' },
  { id:'f3', name:'Suresh Pillai', email:'suresh@farm.com',  password:'farmer123', phone:'9876500003', location:'Salem, Tamil Nadu',     farmName:'Sivan Farm Produce',   createdAt:'2025-01-15' },
  { id:'f4', name:'Anitha R',      email:'anitha@farm.com',  password:'farmer123', phone:'9876500004', location:'Ooty, Tamil Nadu',      farmName:'Nilgiri Hill Farms',   createdAt:'2025-01-20' },
  { id:'f5', name:'Murugan S',     email:'murugan@farm.com', password:'farmer123', phone:'9876500005', location:'Theni, Tamil Nadu',     farmName:'Bodi Fruit Farms',     createdAt:'2025-02-04' },
  { id:'f6', name:'Vishal Patil',  email:'vishal@farm.com',  password:'farmer123', phone:'9876500006', location:'Ratnagiri, Maharashtra',farmName:'Konkan Mango Estate',  createdAt:'2025-02-18' },
  { id:'f7', name:'Karthik N',     email:'karthik@farm.com', password:'farmer123', phone:'9876500007', location:'Pollachi, Tamil Nadu',  farmName:'Anamalai Coconut Farms', createdAt:'2025-03-01' },
  { id:'f8', name:'Dinesh Babu',   email:'dinesh@farm.com',  password:'farmer123', phone:'9876500008', location:'Tirunelveli, Tamil Nadu', farmName:'Thamirabarani Farms', createdAt:'2025-03-12' },
  { id:'f9', name:'Manikandan V',  email:'mani@farm.com',    password:'farmer123', phone:'9876500009', location:'Erode, Tamil Nadu',     farmName:'Bhavani Agro Farms',   createdAt:'2025-03-20' },
  { id:'f10',name:'Kavitha M',     email:'kavitha@farm.com', password:'farmer123', phone:'9876500010', location:'Dharmapuri, Tamil Nadu',farmName:'Millet Valley Farms',  createdAt:'2025-04-02' },
  { id:'f11',name:'Priya S',       email:'priya@farm.com',   password:'farmer123', phone:'9876500011', location:'Coimbatore, Tamil Nadu',farmName:'Kovai Organic Greens', createdAt:'2025-04-15' },
  { id:'f12',name:'Ravi Shankar',  email:'ravi@farm.com',    password:'farmer123', phone:'9876500012', location:'Erode, Tamil Nadu',     farmName:'Erode Turmeric & Honey Co.', createdAt:'2025-04-28' }
];

const SEED_CUSTOMERS = [
  { id:'c1', name:'Arjun Mehta', email:'arjun@mail.com', password:'customer123', phone:'9123456780', address:'12 Lake View Street, Chennai, Tamil Nadu - 600041', createdAt:'2025-01-05' },
  { id:'c2', name:'Sneha Reddy', email:'sneha@mail.com', password:'customer123', phone:'9123456781', address:'45 Banjara Hills, Hyderabad, Telangana - 500034', createdAt:'2025-02-11' }
];

const SEED_PRODUCTS = [
  { id:'p1',  name:'Basmati Rice',       category:'Grains',     price:85,  unit:'kg',    quantity:420, location:'Thanjavur, Tamil Nadu', farmerId:'f1', farmerName:'Ramesh Kumar', image:'rice.svg',       rating:4.6, reviewCount:58, organic:false, harvestDate:'2025-08-10', description:'Premium long-grain Basmati rice grown in the fertile Cauvery delta. Aromatic, non-sticky and perfect for biryanis and everyday meals.' },
  { id:'p2',  name:'Fresh Tomato',       category:'Vegetables', price:32,  unit:'kg',    quantity:180, location:'Madurai, Tamil Nadu',   farmerId:'f2', farmerName:'Lakshmi Devi', image:'tomato.svg',     rating:4.4, reviewCount:41, organic:false, harvestDate:'2025-09-06', description:'Farm-fresh, vine-ripened tomatoes picked at peak ripeness for rich flavour and colour. Ideal for curries, salads and sauces.' },
  { id:'p3',  name:'Red Onion',          category:'Vegetables', price:28,  unit:'kg',    quantity:260, location:'Salem, Tamil Nadu',     farmerId:'f3', farmerName:'Suresh Pillai',image:'onion.svg',      rating:4.3, reviewCount:37, organic:false, harvestDate:'2025-08-28', description:'Firm, medium-sized red onions with a strong flavour and long shelf life. Sourced directly from Salem\'s onion belt.' },
  { id:'p4',  name:'Potato',             category:'Vegetables', price:24,  unit:'kg',    quantity:14,  location:'Ooty, Tamil Nadu',      farmerId:'f4', farmerName:'Anitha R',     image:'potato.svg',     rating:4.2, reviewCount:29, organic:false, harvestDate:'2025-09-01', description:'Hill-grown potatoes from the Nilgiris with a creamy texture, well suited for curries, fries and mash.' },
  { id:'p5',  name:'Carrot',             category:'Vegetables', price:40,  unit:'kg',    quantity:95,  location:'Ooty, Tamil Nadu',      farmerId:'f4', farmerName:'Anitha R',     image:'carrot.svg',     rating:4.5, reviewCount:33, organic:true,  harvestDate:'2025-09-03', description:'Sweet, crunchy Ooty carrots grown in organic hill soil, rich in beta-carotene and freshly harvested.' },
  { id:'p6',  name:'Robusta Banana',     category:'Fruits',     price:45,  unit:'dozen', quantity:150, location:'Theni, Tamil Nadu',     farmerId:'f5', farmerName:'Murugan S',    image:'banana.svg',     rating:4.4, reviewCount:52, organic:false, harvestDate:'2025-09-05', description:'Naturally ripened Robusta bananas, sweet and energy-packed, harvested from the Bodi hills belt.' },
  { id:'p7',  name:'Alphonso Mango',     category:'Fruits',     price:180, unit:'kg',    quantity:0,   location:'Ratnagiri, Maharashtra',farmerId:'f6', farmerName:'Vishal Patil', image:'mango.svg',      rating:4.9, reviewCount:96, organic:false, harvestDate:'2025-05-20', description:'The king of mangoes — fragrant, fibreless and intensely sweet Alphonso mangoes from Ratnagiri\'s Konkan coast.' },
  { id:'p8',  name:'Coconut',            category:'Fruits',     price:35,  unit:'pc',    quantity:300, location:'Pollachi, Tamil Nadu',  farmerId:'f7', farmerName:'Karthik N',    image:'coconut.svg',    rating:4.5, reviewCount:44, organic:false, harvestDate:'2025-09-02', description:'Fresh, full-water tamil nadu coconuts, hand-picked from Pollachi\'s coconut groves.' },
  { id:'p9',  name:'Groundnut',          category:'Grains',     price:95,  unit:'kg',    quantity:210, location:'Tirunelveli, Tamil Nadu',farmerId:'f8',farmerName:'Dinesh Babu',  image:'groundnut.svg',  rating:4.3, reviewCount:22, organic:false, harvestDate:'2025-08-15', description:'Sun-dried groundnuts with a rich, nutty taste — great for roasting, chutneys and oil extraction.' },
  { id:'p10', name:'Sugarcane',          category:'Grains',     price:40,  unit:'bundle',quantity:80,  location:'Erode, Tamil Nadu',     farmerId:'f9', farmerName:'Manikandan V', image:'sugarcane.svg',  rating:4.1, reviewCount:15, organic:false, harvestDate:'2025-08-20', description:'Juicy, thick sugarcane stalks freshly cut from the Bhavani river basin, ideal for fresh juice.' },
  { id:'p11', name:'Finger Millet (Ragi)',category:'Millets',   price:65,  unit:'kg',    quantity:130, location:'Dharmapuri, Tamil Nadu',farmerId:'f10',farmerName:'Kavitha M',    image:'ragi.svg',       rating:4.6, reviewCount:27, organic:true,  harvestDate:'2025-08-05', description:'Nutrient-dense finger millet grown without chemical inputs — a wholesome grain for porridge, dosa and health mixes.' },
  { id:'p12', name:'Pearl Millet (Bajra)',category:'Millets',   price:55,  unit:'kg',    quantity:8,   location:'Dharmapuri, Tamil Nadu',farmerId:'f10',farmerName:'Kavitha M',    image:'bajra.svg',      rating:4.3, reviewCount:19, organic:true,  harvestDate:'2025-08-06', description:'High-fibre pearl millet, a traditional dryland grain, perfect for rotis and khichdi.' },
  { id:'p13', name:'Organic Spinach',    category:'Vegetables', price:30,  unit:'bunch', quantity:60,  location:'Coimbatore, Tamil Nadu',farmerId:'f11',farmerName:'Priya S',      image:'spinach.svg',    rating:4.7, reviewCount:34, organic:true,  harvestDate:'2025-09-08', description:'Certified organic spinach, pesticide-free and picked the same morning for maximum freshness.' },
  { id:'p14', name:'Organic Turmeric',   category:'Organic',    price:220, unit:'kg',    quantity:70,  location:'Erode, Tamil Nadu',     farmerId:'f12',farmerName:'Ravi Shankar',image:'turmeric.svg',   rating:4.8, reviewCount:63, organic:true,  harvestDate:'2025-07-25', description:'High-curcumin organic turmeric, sun-dried and stone-ground for authentic colour and aroma.' },
  { id:'p15', name:'Green Chilli',       category:'Vegetables', price:50,  unit:'kg',    quantity:0,   location:'Madurai, Tamil Nadu',   farmerId:'f2', farmerName:'Lakshmi Devi', image:'chilli.svg',     rating:4.2, reviewCount:18, organic:false, harvestDate:'2025-09-04', description:'Fresh, spicy green chillies harvested daily to bring the right heat to your cooking.' },
  { id:'p16', name:'Brinjal',            category:'Vegetables', price:35,  unit:'kg',    quantity:110, location:'Salem, Tamil Nadu',     farmerId:'f3', farmerName:'Suresh Pillai',image:'brinjal.svg',    rating:4.1, reviewCount:21, organic:false, harvestDate:'2025-09-02', description:'Glossy purple brinjals with tender flesh and few seeds, great for curries and roasting.' },
  { id:'p17', name:'Watermelon',         category:'Fruits',     price:20,  unit:'kg',    quantity:140, location:'Theni, Tamil Nadu',     farmerId:'f5', farmerName:'Murugan S',    image:'watermelon.svg', rating:4.4, reviewCount:30, organic:false, harvestDate:'2025-09-01', description:'Sweet, juicy watermelons grown in sandy river-bed soil — the perfect summer refresher.' },
  { id:'p18', name:'Organic Honey',      category:'Organic',    price:450, unit:'500ml', quantity:45,  location:'Erode, Tamil Nadu',     farmerId:'f12',farmerName:'Ravi Shankar',image:'honey.svg',      rating:4.9, reviewCount:71, organic:true,  harvestDate:'2025-06-15', description:'Raw, unprocessed forest honey harvested responsibly from wild hives around Erode.' }
];

const SAMPLE_REVIEWS = [
  { name:'Arjun Mehta', rating:5, text:'Excellent quality and arrived very fresh. Will order again for sure.' },
  { name:'Sneha Reddy', rating:4, text:'Good product, packaging could be a little better but overall satisfied.' },
  { name:'Karan Verma', rating:5, text:'Tastes just like farm-fresh produce back home. Highly recommend this seller.' }
];

function seedIfNeeded(){
  if(localStorage.getItem(DB_KEYS.seeded)) return;
  localStorage.setItem(DB_KEYS.farmers, JSON.stringify(SEED_FARMERS));
  localStorage.setItem(DB_KEYS.customers, JSON.stringify(SEED_CUSTOMERS));
  localStorage.setItem(DB_KEYS.products, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(DB_KEYS.orders, JSON.stringify([]));
  localStorage.setItem(DB_KEYS.cart, JSON.stringify([]));
  localStorage.setItem(DB_KEYS.wishlist, JSON.stringify([]));
  localStorage.setItem(DB_KEYS.seeded, 'true');
}
seedIfNeeded();

/* ---------------- Generic helpers ---------------- */
function readDB(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; } }
function writeDB(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function uid(prefix){ return prefix + Date.now().toString(36) + Math.floor(Math.random()*1000); }

function getFarmers(){ return readDB(DB_KEYS.farmers); }
function getCustomers(){ return readDB(DB_KEYS.customers); }
function getProducts(){ return readDB(DB_KEYS.products); }
function getOrders(){ return readDB(DB_KEYS.orders); }
function getCart(){ return readDB(DB_KEYS.cart); }
function getWishlist(){ return readDB(DB_KEYS.wishlist); }

function saveFarmers(v){ writeDB(DB_KEYS.farmers, v); }
function saveCustomers(v){ writeDB(DB_KEYS.customers, v); }
function saveProducts(v){ writeDB(DB_KEYS.products, v); }
function saveOrders(v){ writeDB(DB_KEYS.orders, v); }
function saveCart(v){ writeDB(DB_KEYS.cart, v); }
function saveWishlist(v){ writeDB(DB_KEYS.wishlist, v); }

function getProductById(id){ return getProducts().find(p => p.id === id); }

const ORDER_STAGES = ['Order Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered'];

/* ---------------- Session ---------------- */
const ADMIN_ACCOUNT = { email:'admin@farmconnect.com', password:'admin123', name:'Portal Admin' };

function getSession(){ try{ return JSON.parse(localStorage.getItem(DB_KEYS.session)); }catch(e){ return null; } }
function setSession(sess){ localStorage.setItem(DB_KEYS.session, JSON.stringify(sess)); }
function clearSession(){ localStorage.removeItem(DB_KEYS.session); }

function requireRole(role){
  const s = getSession();
  if(!s || s.role !== role){
    location.href = role === 'admin' ? (location.pathname.includes('/pages/') ? 'admin-dashboard.html' : 'pages/admin-dashboard.html') : 'login-redirect';
    return null;
  }
  return s;
}

/* ---------------- Formatting helpers ---------------- */
function formatINR(n){ return '\u20B9' + Number(n).toLocaleString('en-IN'); }
function formatDate(d){
  const dt = new Date(d);
  if(isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function addDays(date, days){ const d = new Date(date); d.setDate(d.getDate()+days); return d; }
function stockStatus(qty){
  if(qty <= 0) return { label:'Out of stock', cls:'tag-out' };
  if(qty <= 15) return { label:'Low stock', cls:'tag-low' };
  return null;
}
function starString(rating){
  const full = Math.round(rating);
  return '\u2605'.repeat(full) + '\u2606'.repeat(5-full);
}
