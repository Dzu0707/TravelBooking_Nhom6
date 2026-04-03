const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "TRAVEL_GO_SECRET_2026";

// --- CẤU HÌNH SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TravelGo API Documentation',
            version: '1.0.0',
            description: 'API quản lý Tour - Báo cáo Tuần 12 (SQL Server & JWT)',
        },
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        }
    },
    apis: ['./server.js'], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- CẤU HÌNH SQL SERVER ---
const config = {
    user: 'sa', // Tên đăng nhập SQL của bạn
    password: '123', // Mật khẩu SQL của bạn
    server: 'localhost',
    database: 'TravelTourDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// --- ĐỊNH NGHĨA API CHO SWAGGER ---

/**
 * @swagger
 * /api/tours:
 * get:
 * summary: Lấy danh sách Tour từ SQL Server (Mục 1)
 * responses:
 * 200:
 * description: Trả về mảng JSON các Tour
 */
app.get('/api/tours', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM Tours");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: "Lỗi SQL: " + err.message });
    }
});

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Đăng nhập xác thực JWT (Mục 2)
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: { type: string, example: "admin@travelgo.com" }
 * password: { type: string, example: "123456" }
 * responses:
 * 200:
 * description: Thành công trả về Token
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // Demo logic: Giả sử user đúng, trả về Token
    const token = jwt.sign({ email, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, message: "Đăng nhập thành công!" });
});

app.listen(5000, () => {
    console.log("✅ Server đang chạy tại: http://localhost:5000");
    console.log("📑 Check API tại Swagger: http://localhost:5000/api-docs");
});