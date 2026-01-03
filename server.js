const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes
app.post('/api/auth/telegram-login', (req, res) => {
    const initData = req.body.initData;
    
    // ?????? ??????? ????? ??????
    const mockUser = {
        success: true,
        token: 'token_' + Date.now(),
        user: {
            id: Date.now(),
            telegram_id: initData ? 123456789 : null,
            telegram_first_name: 'Telegram',
            telegram_last_name: 'User',
            fsn_balance: 1000,
            current_package: 'economy',
            limits: {
                mining_reward: 10,
                max_ads_daily: 15,
                mining_cooldown: 43200
            }
        }
    };
    
    res.json(mockUser);
});

// Serve all routes to index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(\Server running on port \\);
    console.log(\http://localhost:\\);
});
