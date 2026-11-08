(() => {
  'use strict';
  // Configure the WhatsApp destination here using country code + area code + number, digits only.
  // Example format: 5511999999999. Leave empty until a store number is available.
  const WHATSAPP_NUMBER = '';
  const UNIT_PRICE = 69.99;
  const STORAGE_KEY = 'natal-encantado-cart-v1';
  const formatBRL = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const $ = selector => document.querySelector(selector);
  const cartCount = $('#cartCount');
  const cartItems = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFooter = $('#cartFooter');
  const drawer = $('#cartDrawer');
  const backdrop = $('#drawerBackdrop');
  const toast = $('#toast');
  let cart = readCart();
  let toastTimer;

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter(item => item && item.id === 'tree' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) : [];
    } catch { return []; }
  }
  function persistCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* Cart remains available in memory if storage is disabled. */ }
  }
  function quantity() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
  function total() { return quantity() * UNIT_PRICE; }
  function renderCart() {
    const count = quantity();
    cartCount.textContent = count;
    cartCount.setAttribute('aria-label', `${count} itens na sacola`);
    cartEmpty.hidden = count > 0;
    cartFooter.hidden = count === 0;
    cartItems.innerHTML = count ? `<div class="cart-line"><img src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=180&q=75" alt=""><div><h3>Árvore de Natal Especial</h3><p>Pisca-pisca grátis em cada árvore ✧</p><div class="quantity-control"><button type="button" data-qty="-1" aria-label="Diminuir quantidade">−</button><span>${count}</span><button type="button" data-qty="1" aria-label="Aumentar quantidade" ${count >= 99 ? 'disabled' : ''}>+</button></div></div><span class="cart-line-price">${formatBRL(total())}</span></div>` : '';
    $('#cartSubtotal').textContent = formatBRL(total());
    updateSummary();
  }
  function updateSummary() {
    const qty = Math.max(1, Number($('#checkoutQuantity').value) || 1);
    $('#summaryQty').textContent = qty;
    $('#summaryProduct').textContent = formatBRL(qty * UNIT_PRICE);
    $('#summaryTotal').textContent = formatBRL(qty * UNIT_PRICE);
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function openDrawer() {
    drawer.classList.add('open'); backdrop.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    $('#closeCart').focus(); document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open'); backdrop.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  }
  function addTree(amount = 1) {
    const existing = cart.find(item => item.id === 'tree');
    if (existing) existing.quantity = Math.min(99, existing.quantity + amount);
    else cart.push({ id: 'tree', quantity: amount });
    persistCart(); renderCart(); showToast('Árvore adicionada à sua sacola ✧');
  }
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => { addTree(); openDrawer(); }));
  $('#openCart').addEventListener('click', openDrawer);
  $('#closeCart').addEventListener('click', closeDrawer);
  $('[data-close-drawer]').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  cartItems.addEventListener('click', event => {
    const button = event.target.closest('[data-qty]');
    if (!button) return;
    const item = cart.find(entry => entry.id === 'tree');
    if (!item) return;
    item.quantity += Number(button.dataset.qty);
    if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== 'tree');
    if (item.quantity > 99) item.quantity = 99;
    persistCart(); renderCart();
  });

  const checkoutBackdrop = $('#checkoutBackdrop');
  function openCheckout() {
    if (quantity() < 1) return;
    $('#checkoutQuantity').value = quantity(); updateSummary(); closeDrawer();
    checkoutBackdrop.classList.add('open'); checkoutBackdrop.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    $('#checkoutForm').hidden = false; $('#checkoutMessage').hidden = true; $('#checkoutForm').querySelector('[name="name"]').focus();
  }
  function closeCheckout() {
    checkoutBackdrop.classList.remove('open'); checkoutBackdrop.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  }
  $('#goCheckout').addEventListener('click', openCheckout);
  $('#closeCheckout').addEventListener('click', closeCheckout);
  $('#successClose').addEventListener('click', closeCheckout);
  checkoutBackdrop.addEventListener('click', event => { if (event.target === checkoutBackdrop) closeCheckout(); });
  $('#checkoutQuantity').addEventListener('input', event => {
    const input = event.target;
    if (Number(input.value) > 99) input.value = 99;
    updateSummary();
  });
  $('#checkoutForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = $('#formError');
    error.textContent = '';
    form.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
    const fields = [...form.querySelectorAll('input[required]')];
    const invalid = fields.find(field => !field.checkValidity() || !field.value.trim());
    const cep = form.elements.cep;
    const qty = Number(form.elements.quantity.value);
    if (invalid) {
      invalid.classList.add('invalid');
      error.textContent = invalid.name === 'cep' && invalid.value.trim().length < 8 ? 'Informe um CEP válido com pelo menos 8 caracteres.' : 'Confira os campos obrigatórios e tente novamente.';
      invalid.focus(); return;
    }
    if (cep.value.replace(/\D/g, '').length !== 8) {
      cep.classList.add('invalid'); error.textContent = 'Informe um CEP válido com 8 números.'; cep.focus(); return;
    }
    if (!/^[0-9]{11}$/.test(form.elements.cpf.value.replace(/\D/g, ''))) {
      form.elements.cpf.classList.add('invalid'); error.textContent = 'Informe um CPF com 11 números.'; form.elements.cpf.focus(); return;
    }
    if (!form.elements.email.checkValidity()) {
      form.elements.email.classList.add('invalid'); error.textContent = 'Informe um e-mail válido.'; form.elements.email.focus(); return;
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      form.elements.quantity.classList.add('invalid'); error.textContent = 'Escolha uma quantidade entre 1 e 99 árvores.'; form.elements.quantity.focus(); return;
    }
    updateSummary();
    // Deliberately do not submit customer details or claim an order/payment was created.
    form.hidden = true;
    $('#checkoutMessage').hidden = false;
  });

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded)); mainNav.classList.toggle('open', !expanded);
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
  document.querySelectorAll('[data-whatsapp]').forEach(link => link.addEventListener('click', event => {
    if (!WHATSAPP_NUMBER) { event.preventDefault(); showToast('WhatsApp ainda não configurado. Atualize o número em app.js.'); return; }
    event.preventDefault(); window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeDrawer(); closeCheckout(); }
  });
  $('#year').textContent = new Date().getFullYear();
  renderCart();
})();
