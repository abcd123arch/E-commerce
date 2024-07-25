let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, price) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ name: productName, price, quantity: 1 });
    }
    updateCartCount();
    saveCart();
    loadCartItems('cart-items', 'cart-total');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartItems(containerId, totalId) {
    const cartItemsContainer = document.getElementById(containerId);
    const cartTotal = document.getElementById(totalId);

    if (!cartItemsContainer || !cartTotal) return; 

    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${item.name} - Rs${item.price} x ${item.quantity} = Rs${itemTotal.toFixed(2)}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += itemTotal;
    });

    cartTotal.textContent = `Total: Rs${total.toFixed(2)}`;
}

function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        cart[productIndex].quantity -= 1;
        if (cart[productIndex].quantity === 0) {
            cart.splice(productIndex, 1); 
        }
    }
    updateCartCount();
    saveCart();
    loadCartItems('cart-items', 'cart-total');
    loadCartItems('checkout-items', 'checkout-total'); 
}

function checkout() {
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Purchase completed!');
            cart = [];
            saveCart();
            updateCartCount();
            loadCartItems('checkout-items', 'checkout-total');
        });
    }
});

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productPrice = parseFloat(product.dataset.price);

        if ((category === 'all' || category === productCategory) &&
            productPrice >= minPrice && productPrice <= maxPrice) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
function searchProducts() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();

        if (productName.includes(searchQuery)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    const path = window.location.pathname;
    if (path.includes('cart.html')) {
        loadCartItems('cart-items', 'cart-total');
    }
    if (path.includes('checkout.html')) {
        loadCartItems('checkout-items', 'checkout-total');
    }
});
