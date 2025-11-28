// =====================================================
//  CARRINHO COMPLETO – SUAVITÉ
//  Unificação do seu script + carrinho lateral
// =====================================================

const CART_STORAGE_KEY = "suavite_cart_v3";

// Estrutura correta do carrinho
let cart = {
    items: [], // lista de produtos
    total: 0,
    count: 0
};

// ------------------------------------
//  FORMATADOR DE PREÇO
// ------------------------------------
function formatPriceToNumber(text) {
    if (!text) return 0;
    let cleaned = text.replace(/[^0-9.,]/g, "").trim();
    cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
}

// ------------------------------------
//  SALVAR E CARREGAR
// ------------------------------------
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);

    if (raw) {
        const saved = JSON.parse(raw);
        cart.items = saved.items || [];
        cart.total = saved.total || 0;
        cart.count = saved.count || 0;
    }

    updateCartUI();
    renderCartSidebar();
}

// ------------------------------------
//  ATUALIZA INDICADORES DO HEADER
// ------------------------------------
function updateCartUI() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = cart.count;

    const btn = document.querySelector(".cart__button");
    if (btn) {
        btn.setAttribute("data-total", cart.total.toFixed(2));
    }
}

// ------------------------------------
//  ADICIONAR AO CARRINHO
// ------------------------------------
function addProductToCart(title, price) {
    const existing = cart.items.find(item => item.title === title);

    if (existing) {
        existing.qty++;
    } else {
        cart.items.push({ title, price, qty: 1 });
    }

    refreshTotals();
}

// ------------------------------------
//  RECONTAGEM DO CARRINHO
// ------------------------------------
function refreshTotals() {
    cart.count = cart.items.reduce((sum, item) => sum + item.qty, 0);
    cart.total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);

    saveCart();
    updateCartUI();
    renderCartSidebar();
}

// ------------------------------------
//  RENDERIZA O CARRINHO SIDEBAR
// ------------------------------------
function renderCartSidebar() {
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");

    if (!list) return;

    list.innerHTML = "";

    cart.items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "cart-item";

        li.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</span>
                <button class="cart-remove" data-index="${index}">Remover</button>
            </div>

            <div class="cart-qty">
                <button class="qty-minus" data-index="${index}">-</button>
                <span>${item.qty}</span>
                <button class="qty-plus" data-index="${index}">+</button>
            </div>
        `;

        list.appendChild(li);
    });

    if (totalEl) {
        totalEl.textContent = "R$ " + cart.total.toFixed(2).replace(".", ",");
    }

    enableItemButtons();
}

// ------------------------------------
//  BOTÕES DO CARRINHO
// ------------------------------------
function enableItemButtons() {
    document.querySelectorAll(".qty-plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = btn.dataset.index;
            cart.items[idx].qty++;
            refreshTotals();
        });
    });

    document.querySelectorAll(".qty-minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = btn.dataset.index;
            if (cart.items[idx].qty > 1) {
                cart.items[idx].qty--;
            } else {
                cart.items.splice(idx, 1);
            }
            refreshTotals();
        });
    });

    document.querySelectorAll(".cart-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = btn.dataset.index;
            cart.items.splice(idx, 1);
            refreshTotals();
        });
    });
}

// ------------------------------------
//  ABRIR / FECHAR SIDEBAR
// ------------------------------------
function openCart() {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("cartOverlay").classList.add("active");
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("active");
}
// ------------------------------------
//  LIMPAR CARRINHO
// ------------------------------------
function clearCart() {
    cart.items = [];
    cart.total = 0;
    cart.count = 0;

    saveCart();
    updateCartUI();
    renderCartSidebar();
}


// ------------------------------------
//  EVENTOS AO CARREGAR A PÁGINA
// ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    // Botão abrir carrinho
    document.getElementById("openCart").addEventListener("click", openCart);

    // Botão fechar carrinho
    document.getElementById("closeCart").addEventListener("click", closeCart);
    document.getElementById("cartOverlay").addEventListener("click", closeCart);

    // Botão LIMPAR CARRINHO
    const clearBtn = document.getElementById("clearCart");
    if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
}


    // Botões "Adicionar ao Carrinho"
    document.querySelectorAll(".btn-carrinho").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const info = btn.closest(".grid-card__info") || btn.closest(".product-info");

            const title = info.querySelector("h3").textContent.trim();
            const priceText = info.querySelector("p").textContent.trim();
            const price = formatPriceToNumber(priceText);

            addProductToCart(title, price);

            btn.classList.add("btn-carrinho--added");
            setTimeout(() => btn.classList.remove("btn-carrinho--added"), 600);
        });
    });
});
