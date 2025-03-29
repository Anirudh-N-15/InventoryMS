let products=[];
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/client/product'); 
        console.log("fetch request is send...");// Change URL as per your backend route
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const product = await response.json();
        console.log(product.data);
        renderProducts(product.data);
        products = product.data;
        console.log(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}



function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    // Iterate through the array with proper object access
    productsToRender.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        // Create HTML content dynamically
        productCard.innerHTML = `
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.Name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.Name}</h3>
                <p class="product-price">$${parseFloat(product.Price).toFixed(2)}</p>
        
                <p class="product-description">${product.Description}</p>
                <div class="product-actions">
                    <button class="btn btn-view-details" data-id="${product.Item_ID}">View Details</button>
                    <button class="btn btn-add-to-cart" data-id="${product.Item_ID}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });

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


function filterProducts() {
    if (!Array.isArray(products)) {
        console.error("Invalid data format:", products);
        return;
    }

    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value.toLowerCase();
    const priceFilter = document.getElementById('price-filter').value;
    const availabilityFilter = document.getElementById('availability-filter').value.toLowerCase();
    const sortFilter = document.getElementById('sort-filter').value;

    console.log('Filtering products:', { searchInput, categoryFilter, priceFilter, availabilityFilter, sortFilter });

    const filteredProducts = products.filter(product => {
        console.log("jeedfd");
        const matchesSearch = searchInput === '' || 
            String(product.Name).toLowerCase().includes(searchInput);

        const matchesCategory = categoryFilter === '' || 
            String(product.Description).toLowerCase().includes(categoryFilter);

        const matchesPrice = !priceFilter || 
            (priceFilter === '0-50' && product.Price <= 50) ||
            (priceFilter === '50-100' && product.Price > 50 && product.Price <= 100) ||
            (priceFilter === '100+' && product.Price > 100);

        const matchesAvailability = availabilityFilter === '' || (
            (availabilityFilter === 'in-stock' && product.Quantity > 50) ||   
            (availabilityFilter === 'low-stock' && product.Quantity > 0 && product.Quantity <= 50) || 
            (availabilityFilter === 'out-of-stock' && product.Quantity <= 0)  
        );
        
        console.log(product.Price);

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    // Sorting logic
    switch (sortFilter) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.Price - b.Price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.Price - a.Price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.Name.localeCompare(b.Name));
            break;
    }

    console.log(filteredProducts);

    renderProducts(filteredProducts);
}


// Event listeners for filters and search
document.getElementById('search-input').addEventListener('input', filterProducts);
document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('price-filter').addEventListener('change', filterProducts);
document.getElementById('availability-filter').addEventListener('change', filterProducts);
document.getElementById('sort-filter').addEventListener('change', filterProducts);

const urlParams = new URLSearchParams(window.location.search);
const clientID = urlParams.get('clientID');
const ordersLink = document.getElementById("history");
if (clientID) {
    ordersLink.href = `./history/index.html?clientID=${clientID}`;
} else {
    console.error("Client ID not found");
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchProducts);