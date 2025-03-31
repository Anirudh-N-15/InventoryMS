
const ordersBody = document.getElementById('orders-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');


let fetchedOrders = [];


async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:8080/orders');

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        

        fetchedOrders = orders.data || [];

        console.log('Fetched Orders:', fetchedOrders);
        

        renderOrders(fetchedOrders);
    } catch (error) {
        console.error('Error:', error);
    }
}
fetchOrders();



function renderOrders(orders) {
    ordersBody.innerHTML = ''; 

    orders.forEach(order => {
        const row = document.createElement('tr');


        let statusClass = 'status-badge ';
        switch (order.Payment_Method) {
            case 'Credit Card':
                statusClass += 'status-pending';     // Example styling class
                break;
            case 'PayPal':
                statusClass += 'status-in-progress';  
                break;
            case 'Bank Transfer':
                statusClass += 'status-completed';    
                break;
            case 'Cash':
                statusClass += 'status-cancelled';    
                break;
            case 'UPI':
                statusClass += 'status-completed';    
                break;
            
            case 'Debit Card':
                statusClass += 'status-completed';    
                break;
            
            default:
                statusClass += 'status-unknown'; 
                break;
        }


        row.innerHTML = `
            <td>${order.Order_ID}</td>
            <td>${order.Client_Name}</td>
            <td>${order.Date}</td>
            <td><span class="${statusClass}">${order.Payment_Method}</span></td>
            <td>${order.Quantity}</td>
            <td>$${parseFloat(order.Amount_Payed).toFixed(2)}</td>
            <td>
                <button class="view-details-btn" data-order-id="${order.Order_ID}">
                    View Details
                </button>
            </td>
        `;

        ordersBody.appendChild(row);
    });


    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            window.location.href = `details/index.html?id=${orderId}`;
            // alert(`Viewing details for Order ${orderId}`);
        });
    });
}


function filterOrders(orders) {

    if (!Array.isArray(orders)) {
        console.error("Invalid data format:", orders);
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const statusTerm = statusFilter.value.toLowerCase();

    console.log('Filtering orders:', searchTerm, statusTerm);

    const filteredOrders = orders.filter(order =>  
        (searchTerm === '' || 
         String(order.Order_ID).toLowerCase().includes(searchTerm) ||   // Cast to string
         String(order.Client_Name).toLowerCase().includes(searchTerm)) && // Cast to string
        (statusTerm === '' || String(order.Payment_Method).toLowerCase() === statusTerm) // Cast to string
    );

    renderOrders(filteredOrders);
}


searchInput.addEventListener('input', () => filterOrders(fetchedOrders));
statusFilter.addEventListener('change', () => filterOrders(fetchedOrders));