// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to get URL parameter
function getOrderIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to render order details
function renderOrderDetails(order) {
    const container = document.getElementById('orderDetailsContainer');
    console.log(container);
    container.innerHTML = `
        <div class="order-header">
            <button onclick="window.location.href='./../orders.html'" class="back-button">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNSAxOGwtNi02IDYtNiIvPjwvc3ZnPg==" alt="Back">
            </button>
            <h1>Order Details</h1>
        </div>
        <div class="order-content">
            <div class="order-detail"><label>Order ID</label><div class="value">${order.Order_ID}</div></div>
            <div class="order-detail"><label>Client Name</label><div class="value">${order.Client_Name}</div></div>
            <div class="order-detail"><label>Date</label><div class="value">${formatDate(order.Date)}</div></div>
            <div class="order-detail"><label>Payment Method</label><div class="value">${order.Payment_Method}</div></div>
            <div class="order-detail"><label>Quantity</label><div class="value">${order.Quantity}</div></div>
            <div class="order-detail"><label>Amount Paid</label><div class="value">$${parseFloat(order.Amount_Payed).toFixed(2)}</div></div>
            <div class="order-detail"><label>Delivery Address</label><div class="value">${order.Item_Name}</div></div>
            <div class="order-detail"><label>Contact Number</label><div class="value">${order.Phone_No}</div></div>
            <div class="order-detail"><label>Description</label><div class="value">${order.Item_Description}</div></div>
        </div>
    `;
}

// Function to show loading state
function showLoading() {
    const container = document.getElementById('orderDetailsContainer');
    container.innerHTML = `
        <div class="loading-spinner">
            <p>Loading...</p>
        </div>
    `;
}

// Function to show error state
function showError(message) {
    const container = document.getElementById('orderDetailsContainer');
    container.innerHTML = `
        <div class="error-container">
            <h2>Error Loading Order Details</h2>
            <p>${message}</p>
            <button onclick="window.location.href='orders.html'" class="back-button">
                Back to Orders
            </button>
        </div>
    `;
}

// Function to fetch order details
async function fetchOrderDetails() {
    const orderId = getOrderIdFromURL();
    console.log(orderId);

    if (!orderId) {
        console.log(orderId);
        showError('No Order ID provided');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`http://localhost:8080/orders/${orderId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
        }

        const orderData = await response.json();
        console.log(orderData);

        // Validate if necessary fields exist
        if (!orderData || !orderData.Order_ID) {
            throw new Error('Invalid order data received');
        }

        renderOrderDetails(orderData);
    } catch (error) {
        console.error('Error fetching order:', error);
        showError(error.message);
    }
}

// Initiate fetch when page loads
document.addEventListener('DOMContentLoaded', fetchOrderDetails);
