// // Sample Order Data
// // const initialOrders = [
// //     {
// //         id: 'ORD-001',
// //         clientName: 'TechCorp Solutions',
// //         date: '2024-03-20',
// //         status: 'Pending',
// //         totalItems: 5,
// //         totalValue: 1250.00
// //     },
// //     {
// //         id: 'ORD-002',
// //         clientName: 'Global Innovations',
// //         date: '2024-03-21',
// //         status: 'In Progress',
// //         totalItems: 3,
// //         totalValue: 875.50
// //     },
// //     {
// //         id: 'ORD-003',
// //         clientName: 'Sunrise Enterprises',
// //         date: '2024-03-22',
// //         status: 'Completed',
// //         totalItems: 7,
// //         totalValue: 2100.75
// //     },
// //     {
// //         id: 'ORD-004',
// //         clientName: 'Horizon Industries',
// //         date: '2024-03-23',
// //         status: 'Cancelled',
// //         totalItems: 2,
// //         totalValue: 450.00
// //     },
// //     {
// //         id: 'ORD-005',
// //         clientName: 'Quantum Systems',
// //         date: '2024-03-24',
// //         status: 'Pending',
// //         totalItems: 4,
// //         totalValue: 980.25
// //     }
// // ];

// const ordersBody = document.getElementById('orders-body');
// const searchInput = document.getElementById('search-input');
// const statusFilter = document.getElementById('status-filter');
// const prevBtn = document.getElementById('prev-btn');
// const nextBtn = document.getElementById('next-btn');
// const pageInfo = document.getElementById('page-info');

// async function fetchOrders() {
//     try {
//         const response = await fetch('http://localhost:8080/orders');
        
//         if (!response.ok) {
//             throw new Error('Failed to fetch orders');
//         }

//         const orders = await response.json();
//         console.log(orders.data);
//         renderOrders(orders.data);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
// fetchOrders();

// // DOM Elements


// // Pagination Variables
// let currentPage = 1;
// const ordersPerPage = 5;

// // Render Orders
// function renderOrders(orders) {
//     ordersBody.innerHTML = ''; // Clear existing orders

//     orders.forEach(order => {
//         const row = document.createElement('tr');
        
//         // Determine status badge class
        // let statusClass = 'status-badge ';
        // switch (order.Payment_Method) {
        //     case 'Credit Card':
        //         statusClass += 'status-pending';     // Example styling class
        //         break;
        //     case 'PayPal':
        //         statusClass += 'status-in-progress';  // Example styling class
        //         break;
        //     case 'Bank Transfer':
        //         statusClass += 'status-completed';    // Example styling class
        //         break;
        //     case 'Cash':
        //         statusClass += 'status-cancelled';    // Example styling class
        //         break;
        //     case 'UPI':
        //         statusClass += 'status-completed';    // Example styling class
        //         break;
            
        //     case 'Debit Card':
        //         statusClass += 'status-completed';    // Example styling class
        //         break;
            
        //     default:
        //         statusClass += 'status-unknown';      // For undefined or new methods
        //         break;
        // }

//         // row.innerHTML = `
//         //     <td>${order.id}</td>
//         //     <td>${order.clientName}</td>
//         //     <td>${order.date}</td>
//         //     <td><span class="${statusClass}">${order.status}</span></td>
//         //     <td>${order.totalItems}</td>
//         //     <td>$${order.totalValue.toFixed(2)}</td>
//         //     <td>
//         //         <button class="view-details-btn" data-order-id="${order.id}">
//         //             View Details
//         //         </button>
//         //     </td>
//         // `;


//         row.innerHTML = `
//             <td>${order.Order_ID}</td>
//             <td>${order.Client_Name}</td>
//             <td>${order.Date}</td>
//             <td><span class="${statusClass}">${order.Payment_Method}</span></td>
//             <td>${order.Quantity}</td>
//             <td>$${parseFloat(order.Amount_Payed).toFixed(2)}</td>
//             <td>
//                 <button class="view-details-btn" data-order-id="${order.Order_ID}">
//                     View Details
//                 </button>
//             </td>
//         `;
        
//         ordersBody.appendChild(row);
//     });

//     // Add event listeners to View Details buttons
//     document.querySelectorAll('.view-details-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const orderId = e.target.getAttribute('data-order-id');
//             // In a real application, this would navigate to a details page
//             alert(`Viewing details for Order ${orderId}`);
//         });
//     });
// }

// // Filter Orders
// // function filterOrders() {
// //     const searchTerm = searchInput.value.toLowerCase();
// //     const statusTerm = statusFilter.value;

// //     const filteredOrders = initialOrders.filter(order => 
// //         (searchTerm === '' || 
// //          order.id.toLowerCase().includes(searchTerm) || 
// //          order.clientName.toLowerCase().includes(searchTerm)) &&
// //         (statusTerm === '' || order.status === statusTerm)
// //     );

// //     renderOrders(filteredOrders);
// // }

// function filterOrders(orders) {
//     const searchTerm = searchInput.value.toLowerCase();
//     const statusTerm = statusFilter.value.toLowerCase();
//     console.log(searchTerm,statusTerm);

//     const filteredOrders = orders.filter(order => 
//         (searchTerm === '' || 
//          order.Order_ID.toLowerCase().includes(searchTerm) || 
//          order.Client_Name.toLowerCase().includes(searchTerm)) &&
//         (statusTerm === '' || order.Payment_Method.toLowerCase() === statusTerm)
//     );

//     renderOrders(filteredOrders);
// }

// // Event Listeners
// searchInput.addEventListener('input', filterOrders);
// statusFilter.addEventListener('change', filterOrders);

// // Initial Render
// // renderOrders(initialOrders);



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