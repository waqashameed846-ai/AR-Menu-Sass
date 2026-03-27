// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth scroll for anchor links
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
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Initialize tooltips
    initTooltips();
    
    // Handle file uploads
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
});

// Form validation function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            clearError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-+()]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                showError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show error message
function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.classList.add('error');
    field.style.borderColor = '#dc3545';
    
    field.parentNode.appendChild(errorDiv);
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file) {
        // Check file size
        if (file.size > maxSize) {
            showError(event.target, 'File size must be less than 5MB');
            event.target.value = '';
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showError(event.target, 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
            event.target.value = '';
            return;
        }
        
        // Preview image
        const preview = document.querySelector(`#${event.target.id}-preview`);
        if (preview) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'var(--black)';
            tooltip.style.color = 'var(--white)';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = 'var(--border-radius)';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            });
        });
    });
}

// API Service
const APIService = {
    baseURL: '/api/',
    
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers
        };
        
        try {
            const response = await fetch(this.baseURL + endpoint, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Handle token refresh or redirect to login
                    window.location.href = '/login/';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },
    
    get(endpoint) {
        return this.request(endpoint);
    },
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};

// QR Code Generation
function generateQRCode(elementId, text, options = {}) {
    const defaultOptions = {
        width: 150,
        height: 150,
        colorDark: '#0066FF',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.H
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    new QRCode(document.getElementById(elementId), {
        text: text,
        width: qrOptions.width,
        height: qrOptions.height,
        colorDark: qrOptions.colorDark,
        colorLight: qrOptions.colorLight,
        correctLevel: qrOptions.correctLevel
    });
}

// Menu Management
const MenuManager = {
    categories: [],
    items: [],
    
    async loadCategories(restaurantId) {
        try {
            this.categories = await APIService.get(`restaurants/${restaurantId}/categories/`);
            this.renderCategories();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    },
    
    async loadMenuItems(restaurantId, categoryId = null) {
        try {
            let endpoint = `restaurants/${restaurantId}/menu-items/`;
            if (categoryId) {
                endpoint += `?category=${categoryId}`;
            }
            this.items = await APIService.get(endpoint);
            this.renderMenuItems();
        } catch (error) {
            console.error('Failed to load menu items:', error);
        }
    },
    
    renderCategories() {
        const container = document.querySelector('.category-tabs');
        if (!container) return;
        
        container.innerHTML = '<button class="category-tab active" data-category="all">All</button>';
        
        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-tab';
            button.dataset.category = category.id;
            button.textContent = category.name;
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                button.classList.add('active');
                this.loadMenuItems(restaurantId, category.id);
            });
            
            container.appendChild(button);
        });
    },
    
    renderMenuItems() {
        const container = document.querySelector('.menu-items-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.innerHTML = `
                <div class="menu-item-image">
                    <img src="${item.image || '/static/images/placeholder.jpg'}" alt="${item.name}">
                </div>
                <div class="menu-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                    <span class="price">$${item.price}</span>
                </div>
                <div class="menu-item-actions">
                    <button class="btn-icon" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
};

// Dashboard Charts
function initDashboardCharts() {
    // Views chart
    const viewsCtx = document.getElementById('viewsChart');
    if (viewsCtx) {
        new Chart(viewsCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Menu Views',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#0066FF',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Categories chart
    const categoriesCtx = document.getElementById('categoriesChart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Appetizers', 'Main Course', 'Desserts', 'Beverages'],
                datasets: [{
                    data: [30, 45, 15, 10],
                    backgroundColor: [
                        '#0066FF',
                        '#0052CC',
                        '#003399',
                        '#E6F0FF'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// Initialize dashboard charts when DOM is loaded
if (document.querySelector('.dashboard')) {
    document.addEventListener('DOMContentLoaded', initDashboardCharts);
}

// Export functions for global use
window.APIService = APIService;
window.MenuManager = MenuManager;
window.generateQRCode = generateQRCode;
