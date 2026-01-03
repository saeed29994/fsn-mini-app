// telegram-webapp.js - Telegram Mini App Integration 
class TelegramWebApp { 
    constructor() { 
        this.tg = window.Telegram?.WebApp; 
        this.backendURL = 'http://localhost:3000/api'; // ????? ?? https://mini.fsncrew.io ??? ????? 
        this.user = null; 
        this.token = localStorage.getItem('flysky_token'); 
    } 
 
    // Initialize Telegram WebApp 
    init() { 
        if (!this.tg) { 
            console.warn('Telegram WebApp not detected. Running in browser mode.'); 
            return false; 
        } 
 
        // Expand to full screen 
        this.tg.expand(); 
 
        // Set theme colors 
        this.tg.setBackgroundColor('#0a0e17'); 
        this.tg.setHeaderColor('#4361ee'); 
 
        // Enable closing confirmation 
        this.tg.enableClosingConfirmation(); 
 
        console.log('? Telegram WebApp initialized'); 
        console.log('User:', this.tg.initDataUnsafe?.user); 
 
        return true; 
    } 
 
    // Get Telegram initData 
    getInitData() { 
    } 
 
    // Login with Telegram 
    async login() { 
        try { 
            const initData = this.getInitData(); 
            if (!initData) { 
                throw new Error('No Telegram initData available'); 
            } 
 
            const response = await fetch(this.backendURL + '/auth/telegram-login', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                }, 
                body: JSON.stringify({ initData: initData }) 
            }); 
 
            const data = await response.json(); 
 
            if (data.success) { 
                this.token = data.token; 
                this.user = data.user; 
 
                localStorage.setItem('flysky_token', data.token); 
                localStorage.setItem('flysky_user', JSON.stringify(data.user)); 
 
                console.log('? Telegram login successful:', data.user); 
                return data.user; 
            } else { 
            } 
        } catch (error) { 
            console.error('Telegram login error:', error); 
            throw error; 
        } 
    } 
 
    // Check if user is authenticated 
    async isAuthenticated() { 
        // Check token first 
        if (this.token) { 
            try { 
                const response = await fetch(this.backendURL + '/auth/verify', { 
                    headers: { 
                        'Authorization': 'Bearer ' + this.token 
                    } 
                }); 
 
                if (response.ok) { 
                    const data = await response.json(); 
                    if (data.success) { 
                        // Try to get full user data from localStorage 
                        const storedUser = localStorage.getItem('flysky_user'); 
                        if (storedUser) { 
                            this.user = JSON.parse(storedUser); 
                        } 
                        return true; 
                    } 
                } 
            } catch (error) { 
                console.error('Token verification failed:', error); 
            } 
        } 
 
        // Try Telegram login if available 
        if (this.tg?.initData) { 
            try { 
                await this.login(); 
                return true; 
            } catch (error) { 
                console.error('Auto-login failed:', error); 
                return false; 
            } 
        } 
 
        return false; 
    } 
 
    // Get dashboard data 
    async getDashboardData() { 
        if (!this.token) { 
            throw new Error('Not authenticated'); 
        } 
 
        const response = await fetch(this.backendURL + '/dashboard', { 
            headers: { 
                'Authorization': 'Bearer ' + this.token 
            } 
        }); 
 
        if (!response.ok) { 
            throw new Error('Failed to fetch dashboard data'); 
        } 
 
        return await response.json(); 
    } 
 
    // Start mining 
    async startMining() { 
        if (!this.token) throw new Error('Not authenticated'); 
 
        const response = await fetch(this.backendURL + '/mining/start', { 
            method: 'POST', 
            headers: { 
                'Authorization': 'Bearer ' + this.token, 
                'Content-Type': 'application/json' 
            } 
        }); 
 
        return await response.json(); 
    } 
 
    // Get current user 
    getCurrentUser() { 
        return this.user; 
    } 
 
    // Get auth headers for API calls 
    getAuthHeaders() { 
        return { 
            'Authorization': 'Bearer ' + this.token, 
            'Content-Type': 'application/json' 
        }; 
    } 
 
    // Show alert in Telegram 
    showAlert(message) { 
        if (this.tg?.showAlert) { 
            this.tg.showAlert(message); 
        } else { 
            alert(message); 
        } 
    } 
 
    // Close the app 
    close() { 
        if (this.tg?.close) { 
            this.tg.close(); 
        } 
    } 
} 
 
// Create global instance 
window.TelegramWebApp = new TelegramWebApp(); 
