// global-functions.js - Global functions for FlySky Network

// Login with Telegram
window.loginWithTelegram = async function() {
    console.log('Login with Telegram called');
    const btn = document.getElementById('telegram-btn');
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Logging in...';
    }
    
    try {
        // Create mock user for testing
        const mockUser = {
            id: 'user_' + Date.now(),
            telegram_first_name: 'Test User',
            fsn_balance: 1000,
            current_package: 'economy'
        };
        
        localStorage.setItem('flysky_token', 'token_' + Date.now());
        localStorage.setItem('flysky_user', JSON.stringify(mockUser));
        
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Try Again';
        }
    }
};

// Continue as guest
window.continueAsGuest = function() {
    console.log('Continue as guest called');
    
    const guestUser = {
        id: 'guest_' + Date.now(),
        telegram_first_name: 'Guest',
        fsn_balance: 250,
        current_package: 'economy'
    };
    
    localStorage.setItem('flysky_token', 'guest_' + Date.now());
    localStorage.setItem('flysky_user', JSON.stringify(guestUser));
    localStorage.setItem('flysky_guest_mode', 'true');
    
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 500);
};

// Logout
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/';
    }
};

// Open Telegram
window.openTelegram = function() {
    window.open('https://t.me/fsncrewbot', '_blank');
};

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('flysky_token');
    const path = window.location.pathname;
    
    // If on dashboard without token, redirect to home
    if (path.includes('dashboard') && !token) {
        window.location.href = '/';
    }
    
    // If on home with token, redirect to dashboard
    if ((path === '/' || path === '/index.html') && token) {
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    }
});
