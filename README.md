# 🍽️ Meal Planner - Ứng Dụng Lập Kế Hoạch Bữa Ăn

Ứng dụng Full-Stack đơn giản được xây dựng bằng Node.js (Express) và PostgreSQL. Cho phép người dùng quản lý, thêm mới, sửa, xóa và tìm kiếm các món ăn, công thức nấu ăn của họ.

## ✨ Công Nghệ Sử Dụng

| Lớp | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla JS) | Giao diện người dùng và Logic tương tác. |
| **Backend** | Node.js, Express.js | Xây dựng API RESTful. |
| **Database** | PostgreSQL | Lưu trữ dữ liệu món ăn. |
| **Middleware** | `dotenv`, `cors`, `helmet`, `morgan`, `pg` | Quản lý biến môi trường, xử lý Cross-Origin, Bảo mật, Logging, Kết nối DB. |

## 🚀 Tính Năng Chính

* **CRUD Hoàn chỉnh:** Tạo mới (Create), Đọc (Read), Cập nhật (Update), Xóa (Delete) các món ăn.
* **Tìm kiếm Động:** Tìm kiếm món ăn theo tên, mô tả hoặc danh mục ngay lập tức.
* **Quản lý Form Modal:** Sử dụng giao diện modal thống nhất cho việc thêm mới và chỉnh sửa.
* **Bảo mật:** Sử dụng `helmet` để thiết lập Content Security Policy (CSP) và các tiêu đề bảo mật khác.

## 🛠️ Hướng Dẫn Cài Đặt

### Yêu cầu

* Node.js (LTS Version)
* PostgreSQL Server (Đã cài đặt và chạy)

### Bước 1: Clone và Cài đặt Dependencies

```bash
# Clone repository
git clone https://github.com/hanth0509/meal-planner.git
cd meal-planner

# Cài đặt các gói Node.js
npm install
Bước 2: Thiết lập Database
Tạo Database: Tạo một cơ sở dữ liệu PostgreSQL mới, ví dụ: mealplanner.

Cập nhật .env: Sửa file .env với thông tin kết nối của bạn:

Đoạn mã

DATABASE_URL=postgres://[user]:[password]@localhost:5432/mealplanner
PORT=3005
Tạo Bảng: Chạy lệnh SQL trong file 001_create_products.sql trong PgAdmin để tạo bảng products.

Bước 3: Khởi động Ứng dụng
Sử dụng nodemon để tự động khởi động lại server khi có thay đổi:

Bash

npm run dev
Server sẽ chạy trên: http://localhost:3005

📂 Cấu Trúc Dự Án
meal-planner/
├── client/
│   ├── index.html          # Giao diện người dùng
│   ├── script.js           # Logic Frontend (Vanilla JS)
│   └── style.css           # CSS Styling
├── routes/
│   └── productRoutes.js    # Logic API CRUD (GET, POST, PUT, DELETE)
├── migrations/
│   └── 001_create_products.sql # Lệnh SQL tạo bảng
├── .env                    # Biến môi trường
├── db.js                   # Cấu hình kết nối PostgreSQL
└── server.js               # Cấu hình Server (Express, Middleware)
