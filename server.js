const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // เปลี่ยนเป็น username ของฐานข้อมูลคุณ (มักจะเป็น root)
    password: '00000', // ใส่รหัสผ่านฐานข้อมูลของคุณ (ถ้าไม่มีปล่อยว่างไว้)
    database: 'calorie_tracker', // ชื่อ Database ของเรา
    port: 3306 // พอร์ตตามที่คุณใช้ใน DBeaver เลย
});

// ทดสอบการเชื่อมต่อ
db.connect((err) => {
    if (err) {
        console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', err);
        return;
    }
    console.log('✅ เชื่อมต่อฐานข้อมูล MySQL สำเร็จแล้ว!');
});

// เปิด Server
const PORT = 3000;


// เส้นทาง API สำหรับดึงข้อมูลอาหารทั้งหมด (Read)

app.get('/foods', (req, res) => {
    // คำสั่ง SQL สำหรับดึงข้อมูลทุกคอลัมน์จากตาราง foods
    const sql = 'SELECT * FROM foods';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
            return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลอาหารได้' });
        }
        // ส่งข้อมูลกลับไปให้หน้าบ้านในรูปแบบ JSON
        res.json(results);
    });
});


// API สำหรับสมัครสมาชิก (Register)
app.post('/register', async (req, res) => {
    try {
        // รับข้อมูลที่ Frontend ส่งมา
        const { username, password, email, weight, height, age, gender, activity_level, goal } = req.body;

        // เช็คว่ากรอกข้อมูลสำคัญครบไหม
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'กรุณากรอก Username, Email และ Password ให้ครบ' });
        }

        // นำรหัสผ่านไปเข้ารหัส (Hash) ให้ปลอดภัย
        const hashedPassword = await bcrypt.hash(password, 10);

        // บันทึกลงฐานข้อมูล MySQL
        const sql = `INSERT INTO users (username, password, email, weight, height, age, gender, activity_level, goal) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                     
        const values = [username, hashedPassword, email, weight, height, age, gender, activity_level, goal];
        
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('❌ Error บันทึกข้อมูล:', err);
                return res.status(500).json({ error: 'อีเมลหรือชื่อผู้ใช้นี้อาจมีในระบบแล้ว' });
            }
            res.status(201).json({ 
                message: '✅ สมัครสมาชิกสำเร็จ!', 
                userId: result.insertId 
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
    }
});


// API สำหรับเข้าสู่ระบบ (Login)

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // เช็คว่ากรอกข้อมูลมาครบไหม
        if (!username || !password) {
            return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
        }

        // ค้นหาผู้ใช้ในฐานข้อมูลจาก Username
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('❌ Error database:', err);
                return res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
            }

            // เช็คว่าเจอผู้ใช้นี้ในระบบไหม (ถ้า array ว่าง แปลว่าไม่เจอ)
            if (results.length === 0) {
                return res.status(401).json({ error: '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }

            const user = results[0]; // ดึงข้อมูลผู้ใช้คนที่เจอออกมา

            // ตรวจสอบรหัสผ่านด้วย bcrypt.compare()
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }

            // รหัสผ่านถูกต้อง! ส่งข้อมูลผู้ใช้กลับไปให้หน้าบ้าน (ไม่ส่งรหัสผ่านกลับไปนะ)
            res.status(200).json({
                message: '✅ เข้าสู่ระบบสำเร็จ!',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    weight: user.weight,
                    height: user.height
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
    }
});


// API สำหรับบันทึกการกินอาหาร (Add Food Log)

app.post('/food-logs', (req, res) => {
    try {
        // รับข้อมูลการกินจากหน้าเว็บ
        const { user_id, food_id, quantity, meal_type, log_date } = req.body;

        // เช็คว่าส่งข้อมูลมาครบไหม
        if (!user_id || !food_id || !meal_type || !log_date) {
            return res.status(400).json({ error: 'กรุณาส่งข้อมูล user_id, food_id, meal_type และ log_date ให้ครบถ้วน' });
        }

        // เตรียมคำสั่ง SQL เพื่อบันทึกลงตาราง food_logs
        // quantity ถ้าไม่ส่งมาให้ตั้งค่าเริ่มต้นเป็น 1.00 (กิน 1 จาน/ชิ้น)
        const sql = `INSERT INTO food_logs (user_id, food_id, quantity, meal_type, log_date) 
                     VALUES (?, ?, ?, ?, ?)`;
        const values = [user_id, food_id, quantity || 1.00, meal_type, log_date];

        // สั่งรัน SQL
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('❌ Error บันทึกข้อมูลการกิน:', err);
                return res.status(500).json({ error: 'ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบว่า user_id และ food_id มีอยู่จริงในระบบ' });
            }
            res.status(201).json({ 
                message: '✅ บันทึกมื้ออาหารสำเร็จ!', 
                logId: result.insertId 
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
    }
});


// API ดึงสรุปแคลอรี่และสารอาหารรายวัน (Get Daily Summary)

app.get('/daily-summary/:userId/:date', (req, res) => {
    // รับค่า user_id และ date จาก URL (เช่น /daily-summary/1/2026-03-06)
    const { userId, date } = req.params;

    // คำสั่ง SQL ขั้นเทพ: นำตาราง food_logs มา JOIN กับ foods
    const sql = `
        SELECT 
            fl.id AS log_id,
            f.name AS food_name,
            fl.meal_type,
            fl.quantity,
            (f.calories * fl.quantity) AS total_calories,
            (f.protein * fl.quantity) AS total_protein,
            (f.carbs * fl.quantity) AS total_carbs,
            (f.fat * fl.quantity) AS total_fat
        FROM food_logs fl
        JOIN foods f ON fl.food_id = f.id
        WHERE fl.user_id = ? AND fl.log_date = ?
    `;

    // สั่งรัน SQL
    db.query(sql, [userId, date], (err, results) => {
        if (err) {
            console.error('❌ Error fetching daily summary:', err);
            return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสรุปรายวันได้' });
        }

        // นำผลลัพธ์มาบวกเลขรวมกัน (Sum) เพื่อทำสรุปยอด
        let summary = {
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0
        };

        results.forEach(item => {
            summary.total_calories += parseFloat(item.total_calories);
            summary.total_protein += parseFloat(item.total_protein);
            summary.total_carbs += parseFloat(item.total_carbs);
            summary.total_fat += parseFloat(item.total_fat);
        });

        // ส่งข้อมูลกลับไปให้หน้าบ้าน (ทั้งยอดรวม และรายการอาหารย่อยๆ)
        res.status(200).json({
            date: date,
            summary: summary,
            logs: results 
        });
    });
});


// API ดึงข้อมูลส่วนตัวผู้ใช้ (Get Profile)
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    const sql = `SELECT id, username, email, weight, height, age, gender, activity_level, goal, created_at 
                 FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching user profile:', err);
            return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้ในระบบ' });
        }

        res.status(200).json(results[0]);
    });
});


// API สำหรับแก้ไขข้อมูลส่วนตัว (Update Profile)

app.put('/users/:id', (req, res) => {
    try {
        const userId = req.params.id;
        // 1. รับข้อมูลใหม่ที่ต้องการแก้ไขจากหน้าเว็บ
        const { weight, height, age, gender, activity_level } = req.body;

        // 2. คำสั่ง SQL สำหรับอัปเดตข้อมูล (UPDATE ... SET ...)
        const sql = `
            UPDATE users 
            SET weight = ?, height = ?, age = ?, gender = ?, activity_level = ? 
            WHERE id = ?
        `;
        const values = [weight, height, age, gender, activity_level, userId];

        // 3. สั่งรัน SQL
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('❌ Error updating user:', err);
                return res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' });
            }

            // เช็คว่ามีข้อมูลถูกอัปเดตจริงๆ ไหม (เผื่อใส่ ID ที่ไม่มีในระบบมา)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'ไม่พบผู้ใช้นี้ในระบบ' });
            }

            res.status(200).json({ message: '✅ อัปเดตข้อมูลส่วนตัวสำเร็จ!' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
    }
});

app.listen(PORT, () => {
    console.log(`Server เปิดทำงานแล้วที่ http://localhost:${PORT}`);
});