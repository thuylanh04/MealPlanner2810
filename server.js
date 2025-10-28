// server.js
const express = require('express');
const path = require('path');
const db = require('./db');
const cors = require('cors');
// 🔥 Import các thư viện mới 🔥
const helmet = require('helmet'); 
const morgan = require('morgan'); 
require('dotenv').config();

// 🔥 Nhập routes đã tách 🔥
const productRoutes = require('./routes/productRoutes'); 

const app = express();

// --- MIDDLEWARE ---
// Bảo mật: Thêm headers bảo mật HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            imgSrc: [
                "'self'", 
                'data:', 
                'https://i.imgur.com', 
                'https://images.unsplash.com', 
                'https://example.com', 
                // 🔥 ĐÃ THÊM: i.istockimg.com (Domain hình ảnh thực tế của iStock)
                'https://i.istockimg.com', 
                // THÊM: Domain trang web nếu bạn muốn (tuy nhiên nên dùng link trực tiếp)
                'https://www.istockphoto.com' 
            ], 
        },
    },
}));
// Logging: Ghi lại các yêu cầu HTTP (có ích khi phát triển)
app.use(morgan('tiny')); 

app.use(express.json()); // Cho phép Express đọc JSON từ req.body
app.use(cors());

// 🔥 Phục vụ các tệp tĩnh từ thư mục 'client' (Đã sửa lỗi 404) 🔥
app.use(express.static(path.join(__dirname, 'client'))); 

// Test server
app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date() }));

// 🔥 TÍCH HỢP ROUTES API 🔥
// Tất cả các route trong productRoutes.js sẽ có tiền tố /api/products
app.use('/api/products', productRoutes);


// Khởi động server (Logic này không đổi)
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});




