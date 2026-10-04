/* =========================================================
   auth.js
   Validation + register/login logic for farmers and customers.
   ========================================================= */

function setFieldError(fieldEl, message){
  fieldEl.classList.toggle('invalid', !!message);
  const err = fieldEl.querySelector('.error-text');
  if(err) err.textContent = message || '';
}
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone(v){ return /^[6-9]\d{9}$/.test(v.replace(/\D/g,'')); }

/* ---------- Farmer Registration ---------- */
function initFarmerRegisterForm(){
  const form = document.getElementById('farmerRegisterForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const location = form.location.value.trim();
    const farmName = form.farmName.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if(name.length < 3){ setFieldError(form.name.closest('.field'), 'Enter your full name.'); valid=false; } else setFieldError(form.name.closest('.field'), '');
    if(!isEmail(email)){ setFieldError(form.email.closest('.field'), 'Enter a valid email address.'); valid=false; } else setFieldError(form.email.closest('.field'), '');
    if(!isPhone(phone)){ setFieldError(form.phone.closest('.field'), 'Enter a valid 10-digit mobile number.'); valid=false; } else setFieldError(form.phone.closest('.field'), '');
    if(location.length < 2){ setFieldError(form.location.closest('.field'), 'Enter your farm location.'); valid=false; } else setFieldError(form.location.closest('.field'), '');
    if(farmName.length < 2){ setFieldError(form.farmName.closest('.field'), 'Enter your farm / business name.'); valid=false; } else setFieldError(form.farmName.closest('.field'), '');
    if(password.length < 6){ setFieldError(form.password.closest('.field'), 'Password must be at least 6 characters.'); valid=false; } else setFieldError(form.password.closest('.field'), '');
    if(confirm !== password || !confirm){ setFieldError(form.confirmPassword.closest('.field'), 'Passwords do not match.'); valid=false; } else setFieldError(form.confirmPassword.closest('.field'), '');

    const farmers = getFarmers();
    if(valid && farmers.some(f=>f.email === email)){
      setFieldError(form.email.closest('.field'), 'An account with this email already exists.');
      valid = false;
    }
    if(!valid) return;

    const newFarmer = { id: uid('f'), name, email, password, phone, location, farmName, createdAt: new Date().toISOString().slice(0,10) };
    farmers.push(newFarmer);
    saveFarmers(farmers);
    setSession({ role:'farmer', id:newFarmer.id, name:newFarmer.name, email:newFarmer.email });
    showToast('Registration successful! Welcome to FarmConnect.', 'success');
    setTimeout(()=> location.href = 'farmer-dashboard.html', 800);
  });
}

/* ---------- Farmer Login ---------- */
function initFarmerLoginForm(){
  const form = document.getElementById('farmerLoginForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const farmer = getFarmers().find(f=> f.email === email && f.password === password);
    if(!farmer){
      setFieldError(form.password.closest('.field'), 'Incorrect email or password.');
      showToast('Login failed. Please check your credentials.', 'error');
      return;
    }
    setFieldError(form.password.closest('.field'), '');
    setSession({ role:'farmer', id:farmer.id, name:farmer.name, email:farmer.email });
    showToast(`Welcome back, ${farmer.name.split(' ')[0]}!`, 'success');
    setTimeout(()=> location.href = 'farmer-dashboard.html', 700);
  });
}

/* ---------- Customer Registration ---------- */
function initCustomerRegisterForm(){
  const form = document.getElementById('customerRegisterForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if(name.length < 3){ setFieldError(form.name.closest('.field'), 'Enter your full name.'); valid=false; } else setFieldError(form.name.closest('.field'), '');
    if(!isEmail(email)){ setFieldError(form.email.closest('.field'), 'Enter a valid email address.'); valid=false; } else setFieldError(form.email.closest('.field'), '');
    if(!isPhone(phone)){ setFieldError(form.phone.closest('.field'), 'Enter a valid 10-digit mobile number.'); valid=false; } else setFieldError(form.phone.closest('.field'), '');
    if(address.length < 8){ setFieldError(form.address.closest('.field'), 'Enter your full delivery address.'); valid=false; } else setFieldError(form.address.closest('.field'), '');
    if(password.length < 6){ setFieldError(form.password.closest('.field'), 'Password must be at least 6 characters.'); valid=false; } else setFieldError(form.password.closest('.field'), '');
    if(confirm !== password || !confirm){ setFieldError(form.confirmPassword.closest('.field'), 'Passwords do not match.'); valid=false; } else setFieldError(form.confirmPassword.closest('.field'), '');

    const customers = getCustomers();
    if(valid && customers.some(c=>c.email === email)){
      setFieldError(form.email.closest('.field'), 'An account with this email already exists.');
      valid = false;
    }
    if(!valid) return;

    const newCustomer = { id: uid('c'), name, email, password, phone, address, createdAt: new Date().toISOString().slice(0,10) };
    customers.push(newCustomer);
    saveCustomers(customers);
    setSession({ role:'customer', id:newCustomer.id, name:newCustomer.name, email:newCustomer.email });
    showToast('Registration successful! Welcome to FarmConnect.', 'success');
    setTimeout(()=> location.href = 'marketplace.html', 800);
  });
}

/* ---------- Customer Login ---------- */
function initCustomerLoginForm(){
  const form = document.getElementById('customerLoginForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const customer = getCustomers().find(c=> c.email === email && c.password === password);
    if(!customer){
      setFieldError(form.password.closest('.field'), 'Incorrect email or password.');
      showToast('Login failed. Please check your credentials.', 'error');
      return;
    }
    setFieldError(form.password.closest('.field'), '');
    setSession({ role:'customer', id:customer.id, name:customer.name, email:customer.email });
    showToast(`Welcome back, ${customer.name.split(' ')[0]}!`, 'success');
    const redirect = new URLSearchParams(location.search).get('redirect');
    setTimeout(()=> location.href = redirect || 'customer-dashboard.html', 700);
  });
}

/* ---------- Admin Login (used inline on admin-dashboard.html) ---------- */
function tryAdminLogin(email, password){
  if(email.trim().toLowerCase() === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password){
    setSession({ role:'admin', id:'admin', name:ADMIN_ACCOUNT.name, email:ADMIN_ACCOUNT.email });
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', ()=>{
  initFarmerRegisterForm();
  initFarmerLoginForm();
  initCustomerRegisterForm();
  initCustomerLoginForm();

  // toggle password visibility
  document.querySelectorAll('.toggle-pass').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const input = document.getElementById(btn.getAttribute('data-target'));
      if(!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
    });
  });
});
