// Товары
const products = [
    { id: 1, name: 'Товар 1', price: 1000, image: 'https://via.placeholder.com/150?text=Товар+1' },
    { id: 2, name: 'Товар 2', price: 1500, image: 'https://via.placeholder.com/150?text=Товар+2' },
    { id: 3, name: 'Товар 3', price: 2000, image: 'https://via.placeholder.com/150?text=Товар+3' },
    { id: 4, name: 'Товар 4', price: 800, image: 'https://via.placeholder.com/150?text=Товар+4' }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Получение текущей корзины
function getCart() {
    return cart;
}

// Расчет общей суммы
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Отображение товаров
function displayProducts() {
    const productContainer = document.getElementById('products').querySelector('.product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} руб</p>
            <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
                <a href="product.html?id=${product.id}" class="btn btn-view">Подробнее</a>
        `;
        productContainer.appendChild(productCard);
    });
}

// Добавление в корзину
function addToCart(productId) {
    console.log('Добавление товара в корзину, ID:', productId);
    const product = products.find(p => p.id === productId);
    if (product) {
        console.log('Найден товар:', product);
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            console.log('Товар уже в корзине, увеличиваем количество');
            existingItem.quantity += 1;
        } else {
            console.log('Товара нет в корзине, добавляем');
            cart.push({ ...product, quantity: 1 });
        }
        console.log('Корзина после добавления:', cart);
        updateCart();
        updateCartCount();
        // Принудительное обновление localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        console.log('Товар не найден');
    }
}

// Обновление корзины
function updateCart() {
    console.log('Обновление корзины, текущая корзина:', cart);
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем только если мы на странице корзины
    const cartSection = document.getElementById('cart');
    if (!cartSection) {
        console.log('Элемент корзины не найден, работаем только с данными');
        return;
    }
    
    const itemsContainer = cartSection.querySelector('.cart-items');
    if (!itemsContainer) {
        console.log('Контейнер товаров не найден');
        return;
    }
    
    const totalPriceElement = cartSection.querySelector('#total-price');
    if (!totalPriceElement) {
        console.log('Элемент цены не найден');
        return;
    }
    
    itemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" width="50" height="50">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.price} руб × ${item.quantity} = ${itemTotal} руб</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-remove" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `;
        
        itemsContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = total;
    console.log('Корзина обновлена, итого:', total);
}

// Изменение количества
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    console.log('Удаление товара из корзины, ID:', productId);
    cart = cart.filter(item => item.id !== productId);
    console.log('Корзина после удаления:', cart);
    updateCart();
    updateCartCount();
}

// Очистка корзины
function clearCart() {
    console.log('Очистка корзины');
    cart = [];
    updateCart();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Корзина очищена');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    if (document.getElementById('products')) {
        console.log('Отображение товаров');
        displayProducts();
    }
    if (document.getElementById('cart')) {
        console.log('Обновление корзины');
        updateCart();
    }
    updateCartCount();
});

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCount;
        console.log('Обновлен счетчик корзины:', totalCount);
    }
}

// Загрузка корзины на страницу оформления заказа
function loadCartToCheckout() {
    const cartItems = getCart();
    const cartItemsContainer = document.getElementById('checkout');
    
    if (cartItemsContainer) {
        const cartItemsList = cartItemsContainer.querySelector('.cart-items');
        const totalPriceElement = document.getElementById('total-price');
        
        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<p>Ваша корзина пуста</p>';
        } else {
            cartItemsList.innerHTML = '';
            let total = 0;
            
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">${item.quantity} шт.</span>
                    <span class="item-price">${item.price * item.quantity} руб</span>
                `;
                cartItemsList.appendChild(itemElement);
                total += item.price * item.quantity;
            });
            
            totalPriceElement.textContent = total;
        }
    }
}

// Обработчик отправки формы заказа
function handleCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const city = document.getElementById('city').value;
            const address = document.getElementById('address').value;
            const postalCode = document.getElementById('postal-code').value;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            const orderData = {
                items: getCart(),
                total: calculateTotal(),
                customer: { name, phone, email },
                delivery: { city, address, postalCode },
                paymentMethod,
                date: new Date().toISOString()
            };
            
            console.log('Данные заказа:', orderData);
            alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
            
            // Очистка корзины после оформления заказа
            clearCart();
            
            // Перенаправление на главную страницу
            window.location.href = 'index.html';
        });
    }
}

// Инициализация страницы оформления заказа
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartToCheckout();
        handleCheckoutForm();
    });
} else {
    loadCartToCheckout();
    handleCheckoutForm();
}