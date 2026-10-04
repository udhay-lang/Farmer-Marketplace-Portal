/* =========================================================
   add-product.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{
  const session = getSession();
  if(!session || session.role !== 'farmer'){
    showToast('Please log in as a farmer to add products.', 'error');
    setTimeout(()=> location.href = 'farmer-login.html', 800);
    return;
  }

  const farmer = getFarmers().find(f => f.id === session.id);
  if(farmer) document.getElementById('location').value = farmer.location;

  const maxDate = new Date().toISOString().slice(0,10);
  document.getElementById('harvestDate').max = maxDate;

  const form = document.getElementById('addProductForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    function markInvalid(el, invalid){ el.closest('.field').classList.toggle('invalid', invalid); if(invalid) valid = false; }

    markInvalid(form.pname, form.pname.value.trim().length < 2);
    markInvalid(form.category, !form.category.value);
    markInvalid(form.unit, !form.unit.value);
    markInvalid(form.price, !(Number(form.price.value) > 0));
    markInvalid(form.quantity, form.quantity.value === '' || Number(form.quantity.value) < 0);
    markInvalid(form.harvestDate, !form.harvestDate.value);
    markInvalid(form.location, form.location.value.trim().length < 2);
    markInvalid(document.getElementById('imageChoice'), !document.getElementById('imageChoice').value);
    markInvalid(form.description, form.description.value.trim().length < 10);

    if(!valid){ showToast('Please fill in all required fields correctly.', 'error'); return; }

    const products = getProducts();
    const newProduct = {
      id: uid('p'),
      name: form.pname.value.trim(),
      category: form.category.value,
      price: Number(form.price.value),
      unit: form.unit.value,
      quantity: Number(form.quantity.value),
      location: form.location.value.trim(),
      farmerId: session.id,
      farmerName: session.name,
      image: document.getElementById('imageChoice').value,
      rating: 4.5,
      reviewCount: 0,
      organic: document.getElementById('organic').checked,
      harvestDate: form.harvestDate.value,
      description: form.description.value.trim()
    };
    products.push(newProduct);
    saveProducts(products);
    showToast('Product published successfully!', 'success');
    setTimeout(()=> location.href = 'farmer-dashboard.html#products', 800);
  });
});
