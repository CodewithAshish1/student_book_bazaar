// State Management
let books = [];
let wishlist = [];
let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 9;
let filteredBooks = [];

// DOM Elements
const postAdBtn = document.getElementById('postAdBtn');
const postAdModal = document.getElementById('postAdModal');
const closeModal = document.getElementById('closeModal');
const bookForm = document.getElementById('bookForm');
const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const conditionFilter = document.getElementById('conditionFilter');
const sortFilter = document.getElementById('sortFilter');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const darkModeToggle = document.getElementById('darkModeToggle');
const wishlistBtn = document.getElementById('wishlistBtn');
const mobileWishlistBtn = document.getElementById('mobileWishlistBtn');
const wishlistModal = document.getElementById('wishlistModal');
const closeWishlistModal = document.getElementById('closeWishlistModal');
const bookDetailModal = document.getElementById('bookDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const confirmModal = document.getElementById('confirmModal');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const cancelConfirm = document.getElementById('cancelConfirm');
const confirmAction = document.getElementById('confirmAction');
const noResults = document.getElementById('noResults');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreWrapper = document.getElementById('loadMoreWrapper');
const viewBtns = document.querySelectorAll('.view-btn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const totalBooksEl = document.getElementById('totalBooks');
const wishlistCount = document.getElementById('wishlistCount');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderBooks();
    updateWishlistCount();
    updateTotalBooks();
    setupEventListeners();
    checkDarkMode();
});

// Event Listeners Setup
function setupEventListeners() {
    postAdBtn.addEventListener('click', () => openModal(postAdModal));
    closeModal.addEventListener('click', () => closeModalFn(postAdModal));
    closeDetailModal.addEventListener('click', () => closeModalFn(bookDetailModal));
    closeWishlistModal.addEventListener('click', () => closeModalFn(wishlistModal));
    closeConfirmModal.addEventListener('click', () => closeModalFn(confirmModal));
    cancelConfirm.addEventListener('click', () => closeModalFn(confirmModal));
    
    bookForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', debounce(filterBooks, 300));
    categoryFilter.addEventListener('change', filterBooks);
    conditionFilter.addEventListener('change', filterBooks);
    sortFilter.addEventListener('change', filterBooks);
    minPrice.addEventListener('input', debounce(filterBooks, 300));
    maxPrice.addEventListener('input', debounce(filterBooks, 300));
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    wishlistBtn.addEventListener('click', openWishlist);
    mobileWishlistBtn.addEventListener('click', () => {
        openWishlist();
        mobileMenu.classList.remove('active');
    });
    
    loadMoreBtn.addEventListener('click', loadMore);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => changeView(btn.dataset.view));
    });
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModalFn(e.target);
        }
    });
}

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalFn(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (modal === postAdModal) {
        bookForm.reset();
    }
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const newBook = {
        id: Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        condition: document.getElementById('bookCondition').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        description: document.getElementById('bookDescription').value,
        contact: document.getElementById('bookContact').value,
        image: document.getElementById('bookImage').value || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
        timestamp: Date.now()
    };
    
    books.unshift(newBook);
    saveToLocalStorage();
    closeModalFn(postAdModal);
    filterBooks();
    updateTotalBooks();
    
    showNotification('Book posted successfully!');
}

// Render Books
function renderBooks() {
    filteredBooks = [...books];
    filterBooks();
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const condition = conditionFilter.value;
    const sort = sortFilter.value;
    const min = parseFloat(minPrice.value) || 0;
    const max = parseFloat(maxPrice.value) || Infinity;
    
    filteredBooks = books.filter(book => {
        const matchSearch = book.title.toLowerCase().includes(searchTerm) || 
                           book.author.toLowerCase().includes(searchTerm);
        const matchCategory = !category || book.category === category;
        const matchCondition = !condition || book.condition === condition;
        const matchPrice = book.price >= min && book.price <= max;
        
        return matchSearch && matchCategory && matchCondition && matchPrice;
    });
    
    // Sort
    switch(sort) {
        case 'price-low':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'latest':
        default:
            filteredBooks.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    currentPage = 1;
    displayBooks();
}

function displayBooks() {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    if (booksToShow.length === 0) {
        booksContainer.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreWrapper.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    booksContainer.innerHTML = booksToShow.map(book => createBookCard(book)).join('');
    
    // Show/hide load more button
    if (endIndex < filteredBooks.length) {
        loadMoreWrapper.style.display = 'block';
    } else {
        loadMoreWrapper.style.display = 'none';
    }
    
    // Add event listeners to book cards
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                const bookId = parseInt(card.dataset.id);
                showBookDetails(bookId);
            }
        });
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = parseInt(btn.dataset.id);
            toggleWishlist(bookId);
        });
    });
}

function createBookCard(book) {
    const isInWishlist = wishlist.some(item => item.id === book.id);
    
    return `
        <div class="book-card" data-id="${book.id}">
            <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'">
            <div class="book-content">
                <span class="book-category">${book.category}</span>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-condition">
                    <i class="fas fa-circle"></i>
                    ${book.condition}
                </div>
                <div class="book-price">₹${book.price}</div>
                <div class="book-actions">
                    <button class="btn-secondary" onclick="event.stopPropagation(); showContactInfo(${book.id})">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" data-id="${book.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const isInWishlist = wishlist.some(item => item.id === book.id);
    
    const detailContent = `
        <div class="book-detail">
            <div>
                <img src="${book.image}" alt="${book.title}" class="book-detail-image" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'">
            </div>
            <div class="book-detail-info">
                <h2>${book.title}</h2>
                <div class="detail-row">
                    <div class="detail-label">Author</div>
                    <div class="detail-value">${book.author}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Category</div>
                    <div class="detail-value">${book.category}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Condition</div>
                    <div class="detail-value">${book.condition}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Price</div>
                    <div class="detail-value" style="font-size: 2rem; color: var(--primary-color); font-weight: 700;">₹${book.price}</div>
                </div>
                ${book.description ? `
                <div class="detail-row">
                    <div class="detail-label">Description</div>
                    <div class="detail-value">${book.description}</div>
                </div>
                ` : ''}
                <div class="book-actions" style="margin-top: 2rem;">
                    <button class="btn-secondary" onclick="showContactInfo(${book.id})">
                        <i class="fas fa-phone"></i> Contact Seller
                    </button>
                    <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${book.id}); updateBookDetailWishlist(${book.id});">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-delete" onclick="confirmDelete(${book.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('bookDetailContent').innerHTML = detailContent;
    openModal(bookDetailModal);
}

function updateBookDetailWishlist(bookId) {
    const btn = document.querySelector(`#bookDetailModal .btn-wishlist`);
    const isInWishlist = wishlist.some(item => item.id === bookId);
    if (btn) {
        btn.classList.toggle('active', isInWishlist);
    }
}

function showContactInfo(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        alert(`Contact Seller:\n\nPhone: ${book.contact}\n\nFor: ${book.title} by ${book.author}`);
    }
}

// Wishlist Functions
function toggleWishlist(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const index = wishlist.findIndex(item => item.id === bookId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(book);
        showNotification('Added to wishlist');
    }
    
    saveToLocalStorage();
    updateWishlistCount();
    displayBooks();
}

function openWishlist() {
    if (wishlist.length === 0) {
        document.getElementById('wishlistContent').innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #94a3b8;">
                <i class="fas fa-heart" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem;">Your wishlist is empty</p>
            </div>
        `;
    } else {
        const wishlistHTML = wishlist.map(book => `
            <div class="wishlist-item">
                <img src="${book.image}" alt="${book.title}" class="wishlist-image" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'">
                <div class="wishlist-info">
                    <h4>${book.title}</h4>
                    <p style="color: #64748b;">by ${book.author}</p>
                    <div style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700; margin: 0.5rem 0;">₹${book.price}</div>
                    <div class="wishlist-actions">
                        <button class="btn-secondary" onclick="showContactInfo(${book.id})">Contact</button>
                        <button class="btn-secondary" onclick="showBookDetails(${book.id})">View Details</button>
                        <button class="btn-delete" onclick="toggleWishlist(${book.id}); openWishlist();">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('wishlistContent').innerHTML = `<div class="wishlist-grid">${wishlistHTML}</div>`;
    }
    
    openModal(wishlistModal);
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// Delete Confirmation
let bookToDelete = null;

function confirmDelete(bookId) {
    bookToDelete = bookId;
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this book listing?';
    openModal(confirmModal);
}

confirmAction.addEventListener('click', () => {
    if (bookToDelete !== null) {
        deleteBook(bookToDelete);
        bookToDelete = null;
        closeModalFn(confirmModal);
        closeModalFn(bookDetailModal);
    }
});

function deleteBook(bookId) {
    books = books.filter(b => b.id !== bookId);
    wishlist = wishlist.filter(b => b.id !== bookId);
    saveToLocalStorage();
    filterBooks();
    updateWishlistCount();
    updateTotalBooks();
    showNotification('Book deleted successfully');
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function checkDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.className = 'fas fa-sun';
    }
}

// View Toggle
function changeView(view) {
    currentView = view;
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'list') {
        booksContainer.classList.add('list-view');
    } else {
        booksContainer.classList.remove('list-view');
    }
}

// Load More
function loadMore() {
    currentPage++;
    displayBooks();
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
    const storedBooks = localStorage.getItem('books');
    const storedWishlist = localStorage.getItem('wishlist');
    
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    } else {
        // Add sample data
        books = [
            {
                id: 1,
                title: 'Engineering Mathematics',
                author: 'B.S. Grewal',
                category: 'Engineering',
                condition: 'Good',
                price: 250,
                description: 'Complete book with all chapters. Minor highlighting present.',
                contact: '+91 98765 43210',
                image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
                timestamp: Date.now() - 86400000
            },
            {
                id: 2,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Novels',
                condition: 'Like New',
                price: 150,
                description: 'Classic novel in excellent condition.',
                contact: '+91 98765 43211',
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
                timestamp: Date.now() - 172800000
            },
            {
                id: 3,
                title: 'Organic Chemistry',
                author: 'Morrison & Boyd',
                category: 'Science',
                condition: 'Fair',
                price: 300,
                description: 'Used for one semester. All topics covered.',
                contact: '+91 98765 43212',
                image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
                timestamp: Date.now() - 259200000
            },
            {
                id: 4,
                title: 'Financial Accounting',
                author: 'R.L. Gupta',
                category: 'Commerce',
                condition: 'Good',
                price: 200,
                description: 'Perfect for CA students.',
                contact: '+91 98765 43213',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
                timestamp: Date.now() - 345600000
            },
            {
                id: 5,
                title: 'Gray\'s Anatomy',
                author: 'Henry Gray',
                category: 'Medical',
                condition: 'New',
                price: 800,
                description: 'Brand new, never used.',
                contact: '+91 98765 43214',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500',
                timestamp: Date.now() - 432000000
            },
            {
                id: 6,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                category: 'Novels',
                condition: 'Like New',
                price: 120,
                description: 'Beautiful edition, read once.',
                contact: '+91 98765 43215',
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
                timestamp: Date.now() - 518400000
            }
        ];
    }
    
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
    }
}

function updateTotalBooks() {
    totalBooksEl.textContent = books.length;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Image Upload Preview (Optional Enhancement)
document.getElementById('bookImage')?.addEventListener('input', function(e) {
    const url = e.target.value;
    if (url) {
        // You could add preview functionality here
        console.log('Image URL:', url);
    }
});

// Form Validation Enhancement
const formInputs = document.querySelectorAll('#bookForm input, #bookForm select, #bookForm textarea');
formInputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });
    
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// Add error styling dynamically
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .form-input.error {
        border-color: var(--danger-color) !important;
        animation: shake 0.3s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(errorStyle);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModalFn(modal);
        });
    }
});

// Handle Online/Offline Status
window.addEventListener('online', () => {
    showNotification('You are back online!');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Changes will be saved locally.');
});

// Print Functionality (Optional)
function printBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        <html>
        <head>
            <title>Book Details - ${book.title}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; }
                img { max-width: 300px; }
            </style>
        </head>
        <body>
            <h1>${book.title}</h1>
            <img src="${book.image}" alt="${book.title}">
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Condition:</strong> ${book.condition}</p>
            <p><strong>Price:</strong> ₹${book.price}</p>
            <p><strong>Description:</strong> ${book.description || 'N/A'}</p>
            <p><strong>Contact:</strong> ${book.contact}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Export/Import Data (Advanced Feature)
function exportData() {
    const data = {
        books: books,
        wishlist: wishlist,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'book-bazaar-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.books) books = data.books;
            if (data.wishlist) wishlist = data.wishlist;
            saveToLocalStorage();
            filterBooks();
            updateWishlistCount();
            updateTotalBooks();
            showNotification('Data imported successfully!');
        } catch (error) {
            showNotification('Error importing data!');
        }
    };
    reader.readAsText(file);
}

// Initialize tooltips and additional features
console.log('Student Book Bazaar initialized successfully!');
console.log(`Total Books: ${books.length}`);
console.log(`Wishlist Items: ${wishlist.length}`);