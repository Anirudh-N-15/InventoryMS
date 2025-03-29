// Sample order data
// const orders = [
//     { orderId: "ORD-1001", productName: "Blue Widget", quantity: 5, totalAmount: "$250.00", orderDate: "2025-03-25" },
//     { orderId: "ORD-1002", productName: "Premium Service Package", quantity: 1, totalAmount: "$1,200.00", orderDate: "2025-03-20" },
//     { orderId: "ORD-1003", productName: "Wireless Headphones", quantity: 2, totalAmount: "$159.98", orderDate: "2025-03-18" },
//     { orderId: "ORD-1004", productName: "Smart Home Hub", quantity: 1, totalAmount: "$129.99", orderDate: "2025-03-15" },
//     { orderId: "ORD-1005", productName: "Blue Widget", quantity: 10, totalAmount: "$450.00", orderDate: "2025-03-12" },
//     { orderId: "ORD-1006", productName: "Annual Subscription", quantity: 1, totalAmount: "$99.00", orderDate: "2025-03-10" },
//     { orderId: "ORD-1007", productName: "Smartphone Case", quantity: 3, totalAmount: "$59.97", orderDate: "2025-03-05" },
//     { orderId: "ORD-1008", productName: "Wireless Keyboard", quantity: 1, totalAmount: "$85.00", orderDate: "2025-03-02" }
//   ];


// Basic state variables
let currentPage = 1;
let itemsPerPage = 5;
let filteredOrders = [];
let sortField = null;
let sortDirection = 'asc';

// Get DOM elements
const orderTableBody = document.getElementById('orderTableBody');
const emptyState = document.getElementById('emptyState');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const startIndex = document.getElementById('startIndex');
const endIndex = document.getElementById('endIndex');
const totalItems = document.getElementById('totalItems');
const searchInput = document.getElementById('searchInput');
const sortableHeaders = document.querySelectorAll('.sortable-header');
const backButton = document.getElementById('backButton');

const urlParams = new URLSearchParams(window.location.search);
const clientID = urlParams.get('clientID');

let product = [];

async function fetchOrderHistory() {
  try {
      const response = await fetch(`http://localhost:8080/client/product/orders/${clientID}`); 
      console.log("fetch request is send...");// Change URL as per your backend route
      if (!response.ok) {
          throw new Error('Failed to fetch products');
      }
      const result = await response.json();  // Await the JSON parsing first
      product = result.data;                 // Then access the data property
      console.log(product);
      renderTable(product);
  } catch (error) {
      console.error('Error fetching products:', error);
  }
}


  
  // Initialize the page
function init() {    
  fetchOrderHistory();  // Fetch data on load
  setupEventListeners();
}
  
  // Display table with data
  function renderTable(product) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrders = product.slice(start, end);
    console.log(paginatedOrders);
    
    // Update pagination text
    startIndex.textContent = filteredOrders.length > 0 ? start + 1 : 0;
    endIndex.textContent = Math.min(end, filteredOrders.length);
    totalItems.textContent = filteredOrders.length;
    
    // Enable/disable pagination buttons
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = end >= filteredOrders.length;
    
    // Clear table
    orderTableBody.innerHTML = '';
    
    // Show empty state or fill table
    if (paginatedOrders.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      
      // Add rows
      paginatedOrders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${order.Order_ID}</td>
          <td>${order.Name}</td>
          <td>${order.Quantity}</td>
          <td>${order.Amount_Payed}</td>
          <td>${formatDate(order.Date)}</td>
        `;
        
        orderTableBody.appendChild(row);
      });
    }
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Pagination
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable(product);
      }
    });
    
    nextButton.addEventListener('click', () => {
      if (currentPage * itemsPerPage < product.length) {
        currentPage++;
        renderTable(product);
      }
    });
    
    // Search
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      const orders = product.filter(order => 
        order.Name.toLowerCase().includes(searchTerm)
      );
      
      currentPage = 1;
      renderTable(orders);
    });
    
    // Sorting
    // sortableHeaders.forEach(header => {
    //   header.addEventListener('click', () => {
    //     const field = header.getAttribute('data-field');
        
    //     // Change sort direction
    //     if (sortField === field) {
    //       sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    //     } else {
    //       sortField = field;
    //       sortDirection = 'asc';
    //     }
        
    //     // Sort the data
    //     filteredOrders.sort((a, b) => {
    //       let valueA = a[field];
    //       let valueB = b[field];
          
    //       // Handle number fields
    //       if (field === 'quantity') {
    //         valueA = parseInt(valueA);
    //         valueB = parseInt(valueB);
    //       } else if (field === 'totalAmount') {
    //         valueA = parseFloat(valueA.replace(/[^0-9.-]+/g, ''));
    //         valueB = parseFloat(valueB.replace(/[^0-9.-]+/g, ''));
    //       }
          
    //       // Compare values
    //       if (valueA < valueB) {
    //         return sortDirection === 'asc' ? -1 : 1;
    //       }
    //       if (valueA > valueB) {
    //         return sortDirection === 'asc' ? 1 : -1;
    //       }
    //       return 0;
    //     });
        
    //     currentPage = 1;
    //     renderTable();
    //   });
    // });
    
    // Back button
    // backButton.addEventListener('click', () => {
      
    // });
  }
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Initialize when page loads
  window.addEventListener('DOMContentLoaded', init);