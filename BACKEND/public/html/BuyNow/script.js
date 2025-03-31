
// DOM elements
const productImg = document.getElementById('product-img');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const quantityInput = document.getElementById('quantity');
const totalAmount = document.getElementById('total-amount');
const confirmBtn = document.getElementById('confirm-btn');
const confirmationMessage = document.getElementById('confirmation-message');
const statusFilter = document.getElementById('status-filter');

let product = {};  // Store product details globally

// ✅ Function to extract URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);

    // Use the exact case of the URL parameters
    return {
        clientID: params.get('clientID'),   // Match the exact case
        productID: params.get('productID')  // Match the exact case
    };
}

// ✅ Function to fetch product details from backend
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:8080/client/product/buynow/${productId}`);  // Replace with your backend URL
        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const result = await response.json();
        return result.data;  // Assuming backend returns the product as JSON
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// ✅ Format price as currency
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// ✅ Calculate total based on quantity
function calculateTotal() {
    const quantity = parseInt(quantityInput.value) || 1;
    console.log("helooo");
    console.log(quantity);
    if (quantity < 1) {
        quantityInput.value = 1;
        return calculateTotal();
    }
    const total = product[0].Price * quantity;
    console.log(total);
    totalAmount.textContent = `$${total}`;
}

// ✅ Display product details
function displayProductDetails() {
    if (!product) return;
    console.log(product.Name,product.Description);
    console.log(product);

    productImg.src = product[0].image || '../../image-equilibrium.jpg';
    productImg.alt = product[0].Name;
    productName.textContent = product[0].Name;
    productPrice.textContent = `$${product[0].Price}`;
    productDescription.textContent = product[0].Description;

    // Calculate initial total
    calculateTotal();
}

// ✅ Handle order confirmation
async function confirmOrder() {
    const { clientID, productID } = getUrlParams();
    const quantity = parseInt(quantityInput.value) || 1;
    const total = product[0].Price * quantity;

    // Prepare order payload
    const order = {
        clientId: clientID,
        productId: product[0].Item_ID,
        productName: product[0].Name,
        quantity: quantity,
        unitPrice: product[0].Price,
        totalAmount: total,
        method: statusFilter.value,
        orderDate: new Date().toISOString()
    };

    console.log('Order confirmed:', order);

    try {
        const response = await fetch(`http://localhost:8080/client/product/buynow`, {  // Replace with your backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`Failed to confirm order: ${response.status}`);
        }

        // Show confirmation message
        confirmationMessage.textContent = 'Order placed successfully!';
        confirmationMessage.style.display = 'block';
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Order Placed';
        confirmBtn.style.backgroundColor = '#28a745';

        // Scroll to confirmation message
        confirmationMessage.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error placing order:', error);
        confirmationMessage.textContent = 'Failed to place order. Please try again.';
        confirmationMessage.style.color = 'red';
        confirmationMessage.style.display = 'block';
    }
}

// ✅ Initialize the page
async function initOrderPage() {
    const { clientID, productID } = getUrlParams();
    console.log(`Client ID: ${clientID}, Product ID: ${productID}`);

    if (!productID) {
        console.error('No product ID in URL');
        confirmationMessage.textContent = 'Invalid product ID';
        confirmationMessage.style.color = 'red';
        confirmationMessage.style.display = 'block';
        return;
    }

    // Fetch product details
    product = await fetchProductDetails(productID);
    console.log(product);

    if (product) {
        displayProductDetails();
        quantityInput.addEventListener('input', calculateTotal);
        confirmBtn.addEventListener('click', confirmOrder);
    } else {
        confirmationMessage.textContent = 'Failed to load product details.';
        confirmationMessage.style.color = 'red';
        confirmationMessage.style.display = 'block';
    }
}

// ✅ Initialize when page loads
document.addEventListener('DOMContentLoaded', initOrderPage);