(function () {
  "use strict";
  var catalog = window.AQSE_SHOP.products;
  var key = "aqse-shop-cart-v1";
  var dialog = document.querySelector("[data-cart]");
  var toastTimer;
  var storageAvailable = true;
  var cart = [];
  function validLine(line) {
    var p = catalog.find(function (p) { return p.id === line.id; });
    return p && Number.isInteger(line.qty) && line.qty >= 1 && line.qty <= 20 && typeof line.note === "string" && line.note.length <= 500 && p.options.includes(line.option);
  }
  try { var saved = JSON.parse(localStorage.getItem(key) || "[]"); cart = Array.isArray(saved) ? saved.filter(validLine).slice(0, 50) : []; } catch (_) { storageAvailable = false; }
  function escape(value) { return String(value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(value) { return value === null ? "Preço a definir" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100); }
  function product(id) { return catalog.find(function (p) { return p.id === id; }); }
  function label(p) { return p.name + " · " + p.variant; }
  function notify(message) { var el = document.querySelector("[data-toast]"); el.textContent = message; el.classList.add("is-visible"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 3200); }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(cart)); } catch (_) { storageAvailable = false; }
    updateCounts();
  }
  function updateCounts() { document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = cart.reduce(function (sum, line) { return sum + line.qty; }, 0); }); }
  function card(p) {
    return '<article class="product-card"><a class="product-card__image" href="produto.html?id=' + p.id + '"><img src="' + p.image + '" alt="' + p.alt + '" width="1254" height="1254" loading="lazy"><span class="product-size">' + (p.family === "caixas" ? "Caixa " : "Estojo ") + p.variant + '</span><span class="product-card__arrow" aria-hidden="true">↗</span></a><div class="product-card__info"><div><h3><a href="produto.html?id=' + p.id + '">' + p.name + '</a></h3><p>' + p.feeling + '</p></div><strong>' + money(p.price) + '</strong></div><a class="product-card__link" href="produto.html?id=' + p.id + '">Escolher os detalhes <span aria-hidden="true">→</span></a></article>';
  }
  var grid = document.querySelector("[data-products]");
  if (grid) {
    var category = new URLSearchParams(location.search).get("categoria") || "todos";
    if (!["todos", "caixas", "estojos"].includes(category)) category = "todos";
    var search = document.querySelector("[data-search]");
    function normalize(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
    function renderCatalog() {
      var query = normalize(search.value.trim());
      var filtered = catalog.filter(function (p) { return (category === "todos" || p.family === category) && normalize(label(p) + " " + p.feeling).includes(query); });
      grid.innerHTML = filtered.length ? filtered.map(card).join("") : '<div class="catalog-empty"><h3>Nenhum presente por aqui.</h3><p>Tente outra palavra ou veja todos os formatos.</p><button class="button button--outline" data-reset-search>Ver todos os presentes</button></div>';
      document.querySelector("[data-results]").textContent = filtered.length + (filtered.length === 1 ? " formato para escolher" : " formatos para escolher");
      document.querySelectorAll("[data-category]").forEach(function (button) { var selected = button.dataset.category === category; button.classList.toggle("is-selected", selected); button.setAttribute("aria-pressed", selected); });
      var reset = document.querySelector("[data-reset-search]"); if (reset) reset.onclick = function () { category = "todos"; search.value = ""; renderCatalog(); search.focus(); };
    }
    document.querySelectorAll("[data-category]").forEach(function (button) { button.addEventListener("click", function () { category = button.dataset.category; renderCatalog(); }); });
    search.addEventListener("input", renderCatalog); renderCatalog();
  }
  var detail = document.querySelector("[data-product-detail]");
  if (detail) {
    var selected = product(new URLSearchParams(location.search).get("id"));
    if (!selected) {
      detail.innerHTML = '<section class="not-found"><h1>Esse presente não foi encontrado.</h1><p>Explore os formatos disponíveis para escolher o seu.</p><a class="button" href="loja.html#presentes">Ver presentes</a></section>';
    } else {
      document.title = label(selected) + " · Antes que se esqueça";
      var siblings = catalog.filter(function (p) { return p.family === selected.family; });
      detail.innerHTML = '<nav class="breadcrumb" aria-label="Caminho"><a href="loja.html">Início</a><span aria-hidden="true">/</span><a href="loja.html?categoria=' + selected.family + '#presentes">' + (selected.family === "caixas" ? "Caixas" : "Estojos") + '</a><span aria-hidden="true">/</span><span aria-current="page">' + selected.variant + '</span></nav><section class="product-detail"><div class="product-detail__visual"><img src="' + selected.image + '" width="1254" height="1254" alt="' + selected.alt + '"><p class="image-note">Imagem ilustrativa de composição. Conteúdo e medidas a definir.</p></div><div class="product-detail__copy"><p class="small-label">' + selected.feeling + '</p><h1>' + selected.name + '</h1><p class="product-price">' + money(selected.price) + '</p><p class="product-description">' + selected.description + '</p><div class="variant-group"><span class="field-label">Formato</span><div class="variant-options">' + siblings.map(function (p) { return '<a href="produto.html?id=' + p.id + '" ' + (p.id === selected.id ? 'aria-current="page" class="is-selected"' : '') + '>' + p.variant + '</a>'; }).join("") + '</div></div><form data-add-form><label class="field-label" for="composition">O que você gostaria de guardar?</label><select id="composition" name="composition">' + selected.options.map(function (o) { return '<option>' + o + '</option>'; }).join("") + '</select><label class="field-label" for="personal-note">Conte um pouco dessa história <span>(opcional)</span></label><textarea id="personal-note" name="note" maxlength="500" rows="3" placeholder="Para quem é o presente? Qual lembrança você quer guardar?"></textarea><p class="field-hint">As escolhas indicam sua ideia; a composição final ainda será definida.</p><div class="add-row"><label class="quantity-field"><span class="sr-only">Quantidade</span><input type="number" name="qty" value="1" min="1" max="20" required aria-label="Quantidade"></label><button type="submit" class="button">Adicionar à sacola <span aria-hidden="true">+</span></button></div></form><p class="product-availability">Preço, frete e prazo a definir. O pagamento ainda não está disponível.</p><details class="product-faq"><summary>Como funciona a personalização?</summary><p>Escolha uma composição e escreva o que gostaria de incluir. Essas informações acompanham o item na sacola. Não envie dados sensíveis: basta descrever a ideia do presente.</p></details><details class="product-faq"><summary>Medidas, envio e pagamento</summary><p>As medidas e condições comerciais serão publicadas antes da liberação da compra. A seleção na sacola não confirma uma encomenda.</p></details></div></section>';
      document.querySelector("[data-add-form]").addEventListener("submit", function (event) {
        event.preventDefault(); var form = new FormData(event.currentTarget); var qty = Number(form.get("qty"));
        if (!Number.isInteger(qty) || qty < 1 || qty > 20) return;
        var option = form.get("composition"); var note = String(form.get("note") || "").trim().slice(0, 500);
        var existing = cart.find(function (line) { return line.id === selected.id && line.option === option && line.note === note; });
        if (existing) { if (existing.qty + qty > 20) { notify("O limite por item é de 20 unidades."); return; } existing.qty += qty; }
        else { if (cart.length >= 50) { notify("Sua sacola chegou ao limite de itens."); return; } cart.push({ id: selected.id, option: option, note: note, qty: qty }); }
        persist(); notify("Presente adicionado à sua sacola."); renderCart(); dialog.showModal();
      });
      document.querySelector("[data-related]").innerHTML = catalog.filter(function (p) { return p.id !== selected.id; }).slice(0, 3).map(card).join("");
    }
  }
  function linesHTML() {
    return cart.map(function (line, i) { var p = product(line.id); return '<article class="cart-line"><a href="produto.html?id=' + p.id + '"><img src="' + p.image + '" width="100" height="100" alt="' + p.alt + '"></a><div><a class="cart-line__name" href="produto.html?id=' + p.id + '">' + label(p) + '</a><p>' + escape(line.option) + '</p>' + (line.note ? '<p class="cart-note">' + escape(line.note) + '</p>' : '') + '<strong>' + money(p.price) + '</strong><div class="cart-line__actions"><div class="stepper"><button data-quantity="-1" data-line="' + i + '" aria-label="Diminuir quantidade de ' + label(p) + '" ' + (line.qty === 1 ? 'disabled' : '') + '>−</button><span aria-label="Quantidade">' + line.qty + '</span><button data-quantity="1" data-line="' + i + '" aria-label="Aumentar quantidade de ' + label(p) + '" ' + (line.qty === 20 ? 'disabled' : '') + '>+</button></div><button class="remove-item" data-remove="' + i + '">Remover<span class="sr-only"> ' + label(p) + '</span></button></div></div></article>'; }).join("");
  }
  function summary() {
    var pending = cart.some(function (line) { return product(line.id).price === null; });
    var total = cart.reduce(function (sum, line) { return sum + (product(line.id).price || 0) * line.qty; }, 0);
    return '<div class="order-summary"><div><span>Subtotal</span><strong>' + (pending ? 'A definir' : money(total)) + '</strong></div><div><span>Entrega</span><span>A definir</span></div><p>Os valores serão informados antes da confirmação da compra.</p></div>';
  }
  function renderCart() {
    document.querySelector("[data-cart-body]").innerHTML = cart.length ? '<div class="cart-lines">' + linesHTML() + '</div>' + summary() + '<a class="button cart-review" href="checkout.html">Revisar minha seleção <span aria-hidden="true">→</span></a><button class="continue-shopping" data-close-cart>Continuar escolhendo</button>' + (!storageAvailable ? '<p>Seu navegador não permite salvar a sacola. Ela será mantida somente nesta página.</p>' : '') : '<div class="empty-cart"><span aria-hidden="true">♡</span><h3>Uma história começa<br>com uma escolha.</h3><p>Sua sacola está vazia. Que tal encontrar um presente para alguém especial?</p><a class="button" href="loja.html#presentes">Explorar presentes</a></div>';
    var checkout = document.querySelector("[data-checkout]");
    if (checkout) checkout.innerHTML = cart.length ? '<div class="checkout-grid"><div><h2>Os seus presentes</h2>' + linesHTML() + '</div><aside class="checkout-summary"><h2>Resumo da seleção</h2>' + summary() + '<div class="payment-pending"><h3>Pagamento em preparação</h3><p>Os preços estão a definir e o provedor de pagamento ainda não foi escolhido. Você pode montar sua seleção; nenhuma compra ou cobrança será feita agora.</p></div><button class="button" disabled>Pagamento ainda indisponível</button><a class="text-link" href="loja.html#presentes">Continuar escolhendo</a></aside></div>' : '<div class="empty-cart"><h2>A sua sacola está vazia.</h2><p>Escolha um presente antes de revisar sua seleção.</p><a class="button" href="loja.html#presentes">Explorar presentes</a></div>';
  }
  document.addEventListener("click", function (event) {
    var open = event.target.closest("[data-open-cart]"); if (open) { renderCart(); dialog.showModal(); }
    if (event.target.closest("[data-close-cart]")) dialog.close();
    var qty = event.target.closest("[data-quantity]"); var remove = event.target.closest("[data-remove]");
    if (qty) { var index = Number(qty.dataset.line); if (cart[index]) cart[index].qty = Math.max(1, Math.min(20, cart[index].qty + Number(qty.dataset.quantity))); persist(); renderCart(); var controls = document.querySelectorAll('[data-line="' + index + '"]'); var enabled = Array.from(controls).find(function (button) { return !button.disabled; }); if (enabled) enabled.focus(); }
    if (remove) { cart.splice(Number(remove.dataset.remove), 1); persist(); renderCart(); notify("Item removido da sacola."); }
  });
  dialog.addEventListener("click", function (event) { if (event.target === dialog) { var rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  window.addEventListener("storage", function (event) { if (event.key === key) { try { var next = JSON.parse(event.newValue || "[]"); cart = Array.isArray(next) ? next.filter(validLine).slice(0, 50) : []; updateCounts(); renderCart(); } catch (_) {} } });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  updateCounts(); renderCart();
})();
