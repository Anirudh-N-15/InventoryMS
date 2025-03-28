// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "electronics",
        status: "in-stock",
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://via.placeholder.com/250"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 129.99,
        category: "electronics",
        status: "low-stock",
        description: "Advanced fitness tracking smartwatch",
        image: "https://via.placeholder.com/250"
    },
    {
        id: 3,
        name: "Leather Jacket",
        price: 199.99,
        category: "clothing",
        status: "out-of-stock",
        description: "Stylish genuine leather jacket",
        image: "https://via.placeholder.com/250"
    },
    // Add more products here
];

// Function to render product cards
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <span class="product-status status-${product.status}">
                    ${product.status.replace('-', ' ').toUpperCase()}
                </span>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn btn-view-details" data-id="${product.id}">View Details</button>
                    <button class="btn btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners for buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            window.location.href = `product-details.html?id=${productId}`;
        });
    });

    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            alert(`Product ${productId} added to cart`);
        });
    });
}

// Filter and search functionality
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const availabilityFilter = document.getElementById('availability-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchInput) || 
                               product.category.toLowerCase().includes(searchInput);
        
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        const matchesPrice = !priceFilter || 
            (priceFilter === '0-50' && product.price <= 50) ||
            (priceFilter === '50-100' && product.price > 50 && product.price <= 100) ||
            (priceFilter === '100+' && product.price > 100);
        
        const matchesAvailability = !availabilityFilter || product.status === availabilityFilter;

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    // Sorting
    switch(sortFilter) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    renderProducts(filteredProducts);
}

// Event listeners for filters and search
document.getElementById('search-input').addEventListener('input', filterProducts);
document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('price-filter').addEventListener('change', filterProducts);
document.getElementById('availability-filter').addEventListener('change', filterProducts);
document.getElementById('sort-filter').addEventListener('change', filterProducts);

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});