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

const newUrl = `http://localhost:8080/html/clientLanding.html?clientID=${clientID}`;
backButton.href=newUrl;

let product = [];

async function fetchOrderHistory() {
  try {
      const response = await fetch(`http://localhost:8080/client/product/orders/${clientID}`); 
      console.log("fetch request is send...");
      if (!response.ok) {
          throw new Error('Failed to fetch products');
      }
      const result = await response.json();  
      product = result.data;                 
      console.log(product)
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
  

  function renderTable(product) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrders = product.slice(start, end);
    console.log(paginatedOrders);
    
   
    startIndex.textContent = filteredOrders.length > 0 ? start + 1 : 0;
    endIndex.textContent = Math.min(end, filteredOrders.length);
    totalItems.textContent = filteredOrders.length;
    
   
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = end >= filteredOrders.length;
    
  
    orderTableBody.innerHTML = '';
    
 
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
  

  function setupEventListeners() {
   
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
    

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      const orders = product.filter(order => 
        order.Name.toLowerCase().includes(searchTerm)
      );
      
      currentPage = 1;
      renderTable(orders);
    });
    
   
  }
  

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
 
  window.addEventListener('DOMContentLoaded', init);