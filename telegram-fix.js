// Fix for Telegram WebApp 6.0
if (window.Telegram?.WebApp) {
    // Fix showAlert
    if (!window.Telegram.WebApp.showAlert) {
        window.Telegram.WebApp.showAlert = function(msg) {
            alert(msg);
            return Promise.resolve();
        };
    }
    // Fix showPopup  
    if (!window.Telegram.WebApp.showPopup) {
        window.Telegram.WebApp.showPopup = function(params) {
            alert(params.title + ": " + params.message);
            return Promise.resolve();
        };
    }
}
