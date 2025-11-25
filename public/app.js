let products = [
    { id: 101, name: "Kit com 3 camisetas", price: 149.90, img: "img/blusas.jfif", category: "masculino", promo: false, description: "Kit essencial com 3 camisetas em algodão puro, ideal para o dia a dia. Disponível em cores neutras.", hasSize: true },
    { id: 104, name: "Calça Jeans Slim", price: 129.99, img: "img/calcaJeans.jfif", category: "masculino", promo: false, description: "Calça jeans com corte slim, moderno e confortável. Perfeita para qualquer ocasião.", hasSize: true },
    { id: 105, name: "Calça Sarja", price: 189.99, img: "img/calcaSarja.jfif", category: "masculino", promo: true, description: "Calça de Sarja, moderno e confortável. Perfeita para qualquer ocasião.", hasSize: true },
    { id: 106, name: "Camisa Oversized", price: 89.99, img: "img/camisaOver.jfif", category: "masculino", promo: false, description: "Camisa Overzided preta, moderno e confortável. Perfeita para qualquer ocasião.", hasSize: true },
    { id: 108, name: "Jaqueta Bomber", price: 289.90, img: "img/jaqueta.jfif", category: "masculino", promo: true, description: "Jaqueta bomber estilosa e versátil. Fechamento em zíper e acabamento premium.", hasSize: true },
    
    { id: 103, name: "Bermuda Infantil", price: 189.90, img: "img/bermudaInfantil.jfif", category: "infantil", promo: false, description: "Bermuda resistente para aventuras. Cós elástico e tecido respirável para as crianças.", hasSize: true },
    { id: 109, name: "Camisa Polo Infantil", price: 99.90, img: "img/poloInfantil.jpg", category: "infantil", promo: true, description: "Camisa polo Infantil. azul voltadas para as pequenas grandes aventuras", hasSize: true },
    { id: 110, name: "Regata Basica Infatil", price: 115.00, img: "img/regata.jfif", category: "infantil", promo: false, description: "Regata basica amarela. Conforto e muita diversão garantida para os pequenos.", hasSize: true },
    { id: 111, name: "Bermuda Basica", price: 89.90, img: "img/bermuda.jfif", category: "infantil", promo: true, description: "Bermuda basica Estampada. Conforto e muita diversão garantida para os pequenos.", hasSize: true },

    { id: 102, name: "Cinto Casual", price: 89.90, img: "img/cinto.jfif", category: "acessorios", promo: false, description: "Cinto de couro legítimo com fivela moderna. Ajuste perfeito e durabilidade.", hasSize: false }, 
    { id: 107, name: "Óculos de Sol", price: 189.90, img: "img/oculosSol.jfif", category: "acessorios", promo: true, description: "Óculos de sol polarizados com proteção UV400. Design aviador clássico e elegante.", hasSize: false },
    { id: 112, name: "Chapéu Bucket", price: 99.90, img: "img/chapeu.jfif", category: "acessorios", promo: false, description: "Bucket preto para o dia a dia", hasSize: false },
    { id: 90, name: "Carteira", price: 119.90, img: "img/carteira.jfif", category:"acessorios", promo: false, description: "Carteira Marrom Classica ideal para o dia a dia", hasSize: false },
];

let cart = [];
let slideIndex = 0;
let currentFilter = 'all';

function showSlides() {
    const slides = document.querySelectorAll('.slider-image');
    if (slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].style.display = 'none'; 
    }
    
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    
    slides[slideIndex - 1].classList.add('active');
    slides[slideIndex - 1].style.display = 'block'; 
    setTimeout(showSlides, 3000); 
}

window.navigateTo = function(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    
    const target = document.getElementById(screenId + '-screen');
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    if (screenId === 'cart') updateCartPage();
    if (screenId === 'profile') loadProfile();
    if (screenId === 'admin') loadAdminData();
    window.scrollTo(0,0);
};

window.filterProducts = function(category) {
    currentFilter = category;
    renderProducts();
    
    const links = document.querySelectorAll('.main-nav a');
    links.forEach(link => link.classList.remove('active-filter'));
    
    const targetLink = document.querySelector(`.main-nav a[onclick*="${category}"]`);
    if(targetLink) targetLink.classList.add('active-filter');
    
    const title = document.getElementById('current-category-title');
    if(title) {
        if (category === 'all') title.innerText = 'Coleção Destaque';
        else if (category === 'promo') title.innerText = 'Ofertas Imperdíveis';
        else title.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    }
    navigateTo('home');
};

function renderProducts() {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = '';
    
    let filteredProducts = products.filter(p => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'promo') return p.promo;
        return p.category === currentFilter;
    });

    filteredProducts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        
        let priceHTML = `<p class="product-price">R$ ${p.price.toFixed(2)}</p>`;
        let promoBadge = '';
        
        if (p.promo) {
            promoBadge = '<div class="promo-badge">[PROMOÇÃO]</div>';
            
            const originalPrice = p.price / 0.8; 
            priceHTML = `
                <p class="product-price promo-price">
                    <span class="original-price">R$ ${originalPrice.toFixed(2)}</span>
                    R$ ${p.price.toFixed(2)}
                </p>
            `;
        }
        
        div.innerHTML = `
            ${promoBadge}
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            ${priceHTML}
            <button onclick="window.openProductDetail(${p.id})">Ver Detalhes</button>
        `;
        list.appendChild(div);
    });
}

window.openProductDetail = function(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;

    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');
    const modal = document.getElementById('product-modal');
    const sizeContainer = document.getElementById('size-selection-container');
    const sizeSelect = document.getElementById('modal-size');
    const qtyContainer = document.getElementById('qty-selection-container');
    const qtyInput = document.getElementById('modal-qty');

    if (!modal || !modalImg) return;

    modalImg.src = p.img;
    modalTitle.innerText = p.name;
    modalDesc.innerText = p.description;
    
    let priceHTML = `R$ ${p.price.toFixed(2)}`;
    if (p.promo) {
        const originalPrice = p.price / 0.8;
        priceHTML = `<span class="original-price" style="text-decoration: line-through; color: #999;">R$ ${originalPrice.toFixed(2)}</span> R$ ${p.price.toFixed(2)}`;
    }
    modalPrice.innerHTML = priceHTML;
    
    if (p.hasSize) {
        sizeContainer.classList.remove('hidden');
        sizeSelect.innerHTML = p.category === 'infantil' 
            ? '<option value="P_INF">P</option><option value="M_INF">M</option><option value="G_INF">G</option><option value="GG_INF">GG</option>'
            : '<option value="P">P</option><option value="M">M</option><option value="G">G</option><option value="GG">GG</option>';
    } else {
        sizeContainer.classList.add('hidden');
    }
    qtyInput.value = 1;
    qtyContainer.classList.remove('hidden');
    
    const btn = document.getElementById('modal-add-btn');
    if(btn) {
        btn.onclick = function() {
            const quantity = parseInt(qtyInput.value) || 1;
            const size = p.hasSize ? sizeSelect.value : 'N/A';
            window.addToCart(p.id, quantity, size);
            window.closeProductModal();
        };
    }
    
    modal.classList.remove('hidden');
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-modal');
    if(modal) modal.classList.add('hidden');
};

window.addToCart = function(id, quantity = 1, size = 'N/A') {
    const p = products.find(x => x.id === id);
    const item = cart.find(i => i.product.id === id && i.size === size);
    
    if(item) {
        item.quantity += quantity;
    } else {
        cart.push({ product: p, quantity: quantity, size: size });
    }
    updateHeaderCart();
    alert(`${quantity}x ${p.name} (Tam: ${size}) adicionado ao carrinho!`);
};

function updateHeaderCart() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if(el) el.innerText = count;
}

function updateCartPage() {
    const list = document.getElementById('cart-items-page');
    const totalEl = document.getElementById('cart-total-page');
    if (!list || !totalEl) return;

    list.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.product.price * item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.product.name} (x${item.quantity}) ${item.size !== 'N/A' ? `[${item.size}]` : ''}</span>
            <span>R$ ${(item.product.price * item.quantity).toFixed(2)} 
            <button onclick="window.removeFromCart(${index})" style="background: none; border: none; color: #e74c3c; margin-left: 10px; font-size: 1rem;">&times;</button></span>
        `;
        list.appendChild(li);
    });
    
    if(totalEl) totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
    
    if (cart.length === 0) {
        list.innerHTML = '<li style="justify-content: center; color: #666; padding: 30px;">Seu carrinho está vazio.</li>';
    }
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateHeaderCart();
    updateCartPage();
    alert('Item removido do carrinho.');
};

window.openLoginModal = function() { 
    const m = document.getElementById('auth-modal');
    if(m) m.classList.remove('hidden'); 
};
window.closeAuthModal = function() { 
    const m = document.getElementById('auth-modal');
    if(m) m.classList.add('hidden'); 
};

window.openFooterModal = function(type) {
    const modal = document.getElementById('info-modal');
    const titleEl = document.getElementById('info-modal-title');
    const contentEl = document.getElementById('info-modal-content');

    if (!modal || !titleEl || !contentEl) return;

    let title, contentHTML;

    if (type === 'faq') {
        title = 'Perguntas Frequentes (FAQ)';
        contentHTML = '<p><strong>Posso trocar meu produto?</strong> Sim, você tem 30 dias para troca fácil, conforme política.</p><p><strong>Qual o prazo de entrega?</strong> O prazo varia conforme sua região e o tipo de frete escolhido.</p>';
    } else if (type === 'privacy') {
        title = 'Política de Privacidade';
        contentHTML = '<p>Seus dados estão seguros conosco. Não compartilhamos suas informações pessoais com terceiros.</p><p>Utilizamos cookies apenas para melhorar sua experiência na loja.</p>';
    } else if (type === 'contact') {
        title = 'Contate-nos';
        contentHTML = `
            <p>Entre em contato conosco!</p>
            <form>
                <input type="text" placeholder="Seu Nome" required>
                <input type="email" placeholder="Seu Email" required>
                <textarea rows="4" placeholder="Sua Mensagem" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;"></textarea>
                <button type="submit" style="background-color: var(--accent-color);">Enviar Mensagem</button>
            </form>
        `;
    } else if (type === 'subscribe') {
        title = 'Inscrições (Newsletter)';
        contentHTML = `
            <p>Inscreva-se para receber novidades e ofertas exclusivas!</p>
            <form>
                <input type="email" placeholder="Seu Email" required>
                <button type="submit" style="background-color: #28a745;">Inscrever</button>
            </form>
        `;
    }

    titleEl.innerText = title;
    contentEl.innerHTML = contentHTML;
    modal.classList.remove('hidden');
};

window.closeInfoModal = function() {
    const modal = document.getElementById('info-modal');
    if(modal) modal.classList.add('hidden');
};

window.checkAuth = function() {
    const userStr = localStorage.getItem('user');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileBtn = document.getElementById('profile-btn');
    const navAdmin = document.getElementById('nav-admin');

    if (!loginBtn || !logoutBtn || !profileBtn) return;

    if(userStr) {
        const user = JSON.parse(userStr);
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        profileBtn.classList.remove('hidden');
        
        if(user.email.includes('admin') || user.isAdmin) { 
            if(navAdmin) navAdmin.classList.remove('hidden');
        } else {
             if(navAdmin) navAdmin.classList.add('hidden');
        }
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        profileBtn.classList.add('hidden');
        if(navAdmin) navAdmin.classList.add('hidden');
    }
};

window.showAdminTab = function(tab) {
    const t1 = document.getElementById('admin-sales-tab');
    const t2 = document.getElementById('admin-products-tab');
    if(t1) t1.classList.add('hidden');
    if(t2) t2.classList.add('hidden');
    
    const target = document.getElementById('admin-' + tab + '-tab');
    if(target) target.classList.remove('hidden');
};

async function loadProfile() {
    const userStr = localStorage.getItem('user');
    if(!userStr) return;
    const user = JSON.parse(userStr);
    
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    if(nameEl) nameEl.innerText = user.name;
    if(emailEl) emailEl.innerText = user.email;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();
        const container = document.getElementById('my-orders-list');
        if(container) {
            container.innerHTML = '';
            if(orders.length === 0) container.innerHTML = '<p>Nenhum pedido encontrado.</p>';
            orders.forEach(o => {
                const div = document.createElement('div');
                div.className = 'order-card';
                div.style.borderBottom = '1px solid #ccc';
                div.style.padding = '10px';
                div.innerHTML = `Data: ${new Date(o.createdAt).toLocaleDateString()} | Total: R$ ${o.total.toFixed(2)} | Status: <strong>${o.status}</strong>`;
                container.appendChild(div);
            });
        }
    } catch(e) { console.log(e); }
}

async function loadAdminData() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
            const orders = await res.json();
            const tbody = document.querySelector('#sales-table tbody');
            if(tbody) {
                tbody.innerHTML = '';
                orders.forEach(o => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${new Date(o.createdAt).toLocaleDateString()}</td><td>${o.user?.name || 'User'}</td><td>R$ ${o.total.toFixed(2)}</td><td>${o.status}</td>`;
                    tbody.appendChild(tr);
                });
            }
        }
        const prodBody = document.querySelector('#products-table tbody');
        if(prodBody) {
            prodBody.innerHTML = '';
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>R$ ${p.price.toFixed(2)}</td>`;
                prodBody.appendChild(tr);
            });
        }
    } catch(e) { console.log(e); }
}

document.addEventListener('DOMContentLoaded', () => {
    filterProducts(currentFilter);
    window.checkAuth();
    updateHeaderCart();
    
    showSlides(); 

    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const orderId = urlParams.get('orderId');

    if (success && orderId) {
        const token = localStorage.getItem('token');
        fetch('/api/orders/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ orderId })
        }).then(() => {
            alert('Pagamento Aprovado! Seu pedido foi confirmado.');
            cart = []; 
            updateHeaderCart();
            window.history.replaceState({}, document.title, "/"); 
            window.navigateTo('profile'); 
        });
    }

    const checkoutBtn = document.getElementById('checkout-page-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if(!token) return window.openLoginModal();
            if(cart.length === 0) return alert('Carrinho vazio');
            
            const total = cart.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
            const items = cart.map(i => ({ 
                productId: i.product.id, 
                name: i.product.name, 
                price: i.product.price, 
                quantity: i.quantity,
                size: i.size
            }));
            
            try {
                checkoutBtn.innerText = "Processando...";
                checkoutBtn.disabled = true;

                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ items, total })
                });
                const data = await res.json();
                
                if(data.ok && data.url) {
                    window.location.href = data.url; 
                } else { 
                    alert('Erro ao criar pagamento: ' + (data.error || 'Erro desconhecido')); 
                    checkoutBtn.innerText = "Finalizar Compra Segura";
                    checkoutBtn.disabled = false;
                }
            } catch(e) { 
                console.error(e);
                alert('Erro de conexão com o pagamento.');
                checkoutBtn.innerText = "Finalizar Compra Segura";
                checkoutBtn.disabled = false;
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if(data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.closeAuthModal();
                    window.checkAuth();
                    alert('Logado!');
                } else { alert(data.error || 'Erro'); }
            } catch(err) { alert('Erro conexão'); }
        });
    }

    const regForm = document.getElementById('register-form');
    if(regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if(data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.closeAuthModal();
                    window.checkAuth();
                    alert('Cadastrado!');
                } else { alert(data.error || 'Erro'); }
            } catch(err) { alert('Erro conexão'); }
        });
    }

    const showReg = document.getElementById('show-register');
    const showLog = document.getElementById('show-login');
    const logCont = document.getElementById('login-form-container');
    const regCont = document.getElementById('register-form-container');

    if(showReg && logCont && regCont) {
        showReg.onclick = (e) => { 
            e.preventDefault(); 
            logCont.classList.add('hidden'); 
            regCont.classList.remove('hidden'); 
        };
    }
    if(showLog && logCont && regCont) {
        showLog.onclick = (e) => { 
            e.preventDefault(); 
            regCont.classList.add('hidden'); 
            logCont.classList.remove('hidden'); 
        };
    }

    const logout = document.getElementById('logout-btn');
    if(logout) logout.onclick = () => { localStorage.clear(); window.location.reload(); };
});