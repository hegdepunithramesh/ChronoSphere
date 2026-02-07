// Date Input Validation and Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date-input');
    const searchForm = document.querySelector('.search-form');
    
    if (dateInput) {
        // Set max date to today
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        dateInput.setAttribute('max', maxDate);
        
        // Set default date to today
        dateInput.value = maxDate;
        
        // Add visual feedback for invalid dates
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (selectedDate > todayDate) {
                this.setCustomValidity('Please select a date from the past');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Show info modal when form is submitted
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedDate = new Date(dateInput.value);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[selectedDate.getMonth()];
            const day = selectedDate.getDate();
            
            // Show modal with info - form will submit when user clicks "Got it!"
            showInfoModal(monthName, day, searchForm);
        });
    }
    
    // Add animation to timeline items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Info Modal Function
function showInfoModal(monthName, day, form) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'info-modal';
    
    // Get selected date from input
    const dateInput = document.getElementById('date-input');
    const selectedDate = new Date(dateInput.value);
    const year = selectedDate.getFullYear();
    
    modal.innerHTML = `
        <div class="info-modal-content">
            <div class="info-modal-header">
                <h2>🔍 Searching History for ${monthName} ${day}, ${year}</h2>
            </div>
            <div class="info-modal-body">
                <p><strong>You will discover:</strong></p>
                <ul>
                    <li>🎉 <strong>Events</strong> - Major historical events on ${monthName} ${day} up to ${year}</li>
                    <li>🎂 <strong>Births</strong> - Notable people born on ${monthName} ${day} up to ${year}</li>
                    <li>🕯️ <strong>Deaths</strong> - Significant figures who passed on ${monthName} ${day} up to ${year}</li>
                </ul>
                <p class="info-note">Each entry shows the specific year it occurred. You'll see everything from ancient history up to and including ${year}!</p>
            </div>
            <div class="info-modal-footer">
                <button onclick="closeInfoModalAndSubmit()" class="modal-close-btn">Got it! Show me the history →</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Store form reference globally for the button to access
    window.pendingForm = form;
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeInfoModalAndSubmit() {
    const modal = document.querySelector('.info-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            // Submit the form after modal closes
            if (window.pendingForm) {
                window.pendingForm.submit();
                window.pendingForm = null;
            }
        }, 300);
    }
}

function closeInfoModal() {
    const modal = document.querySelector('.info-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}
