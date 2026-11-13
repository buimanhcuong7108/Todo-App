# Todo App — Backend (Chapter 2)

Backend cho ứng dụng quản lý công việc (Todo), có các route xác thực và Todo. Project được tổ chức theo hướng tách server, kết nối cơ sở dữ liệu, middleware và routes.

## Yêu cầu

- Node.js và npm
- Cơ sở dữ liệu được cấu hình trong project

## Cài đặt và chạy

1. Mở terminal tại thư mục `chap_2`.
2. Cài các dependency:

 ```bash
 npm install
 ```

3. Tạo hoặc cập nhật file `.env` với các biến môi trường mà `src/db.js` và `src/server.js` yêu cầu. Không đưa thông tin bí mật trong `.env` lên Git.
4. Xem các script hiện có rồi khởi chạy ứng dụng:

 ```bash
 npm run
 ```

 Chọn lệnh phù hợp được khai báo trong `package.json` (thường là `npm start` hoặc `npm run dev`).

Khi server khởi động, xem terminal để biết địa chỉ và cổng đang chạy.

## Sử dụng API

Các request mẫu nằm trong `todo-app.rest`. Mở file này bằng REST Client trong VS Code, khởi động server rồi gửi từng request. Thực hiện đăng nhập/đăng ký trước nếu request Todo yêu cầu token; gửi token theo đúng định dạng được minh họa trong file request.

Các endpoint cụ thể và dữ liệu cần gửi được định nghĩa trong `src/routes/authRoutes.js` và `src/routes/todoRoutes.js`. Prefix của route được đăng ký tại `src/server.js`.

## Cấu trúc thư mục

```text
chap_2/
├── .env                  # Cấu hình môi trường (không chia sẻ giá trị bí mật)
├── package.json          # Dependency và các script chạy project
├── todo-app.rest         # Request mẫu để kiểm thử API
├── public/               # Giao diện tĩnh
│   ├── index.html
│   ├── styles.css
│   └── fanta.css
└── src/
  ├── server.js         # Khởi tạo server và đăng ký middleware/routes
  ├── db.js             # Cấu hình kết nối cơ sở dữ liệu
  ├── middleware/
  │   └── authMiddleware.js # Middleware xác thực
  ├── routes/
  │   ├── authRoutes.js # Các route xác thực
  │   └── todoRoutes.js # Các route Todo
  └── data/             # Dữ liệu hoặc module liên quan đến dữ liệu
```
