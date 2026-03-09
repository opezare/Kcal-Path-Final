<template>
  <div class="login-wrapper">
    <!-- <img 
      src="https://media.giphy.com/media/3o7TKo6fjy7XydHCiQ/giphy.gif" 
      alt="Premium Background" 
      class="gif-bg"
    /> -->
    <div class="overlay"></div>

    <div class="login-container glass-card">
      <h1 class="premium-title">Kcal-Path 🍽️</h1>
      <h2 class="subtitle">เข้าสู่ระบบเพื่อจัดการสุขภาพ</h2>
      
      <div class="form-group">
        <label>ชื่อผู้ใช้ (Username)</label>
        <input 
          type="text" 
          v-model="username" 
          class="glass-input" 
          placeholder="กรอกชื่อผู้ใช้" 
          @keyup.enter="login"
        >
      </div>
      
      <div class="form-group">
        <label>รหัสผ่าน (Password)</label>
        <input 
          type="password" 
          v-model="password" 
          class="glass-input" 
          placeholder="กรอกรหัสผ่าน" 
          @keyup.enter="login"
        >
      </div>

      <button @click="login" class="premium-btn">เข้าสู่ระบบ</button>
      
      <div class="divider"></div>
      
      <p class="register-link">
        ยังไม่มีบัญชีใช่ไหม? 
        <button @click="goToRegister" class="btn-link text-accent">สมัครสมาชิกเลย</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  if (!username.value || !password.value) {
    alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
    return;
  }

  // ล้างข้อมูลเก่าทิ้งก่อน ป้องกันการจำค่าจากครั้งที่แล้ว
  localStorage.clear();

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ ล็อกอินผ่าน (Server ส่งสถานะ 200)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', data.user.id); 
      localStorage.setItem('username', data.user.username);
      
      alert('ยินดีต้อนรับครับ!');
      router.push('/dashboard');
    } else {
      // ❌ ล็อกอินไม่ผ่าน (Server ส่งสถานะ 401)
      password.value = ''; // ล้างช่องรหัสผ่าน
      alert(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ โปรดเช็คว่ารัน server.js หรือยัง');
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
/* 🎨 --- พื้นหลัง --- */
.login-wrapper {
  min-height: 100vh;
  position: relative;
  font-family: 'Prompt', sans-serif;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.gif-bg {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  object-fit: cover; z-index: 0; opacity: 0.6; 
}

.overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(15, 23, 42, 0.4); 
  z-index: 1;
}

/* 🎨 --- คอนเทนเนอร์หลัก (ดีไซน์โปร่งแสงพรีเมียม) --- */
.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px; /* ขนาดกะทัดรัดกว่าหน้า Register นิดหน่อยเพื่อให้ฟอร์มดูแน่นสวย */
  text-align: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 40px 35px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
}

.premium-title {
  margin-top: 0;
  color: #ffffff;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 2em;
  margin-bottom: 5px;
}

.subtitle { 
  color: #cbd5e1; 
  margin-bottom: 30px; 
  font-weight: 300; 
  font-size: 1.1em;
}

.text-accent { color: #d4af37; /* สีทองแชมเปญ */ font-weight: 400; }

/* 🎨 --- ส่วนของฟอร์ม --- */
.form-group { 
  margin-bottom: 20px; 
  text-align: left;
}

label { 
  display: block; 
  font-weight: 300; 
  margin-bottom: 8px; 
  color: #e2e8f0; 
  font-size: 0.95em; 
}

/* 🎨 --- Input Fields แบบหรูหรา --- */
.glass-input {
  width: 100%;
  padding: 14px 15px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  font-size: 1.05em;
  font-family: 'Prompt', sans-serif;
  font-weight: 300;
  outline: none;
  transition: all 0.3s ease;
}

.glass-input:focus {
  border-color: #d4af37; /* ตอนกดพิมพ์ ขอบจะเปลี่ยนเป็นสีทอง */
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
}

.glass-input::placeholder { color: #94a3b8; font-weight: 300; }

/* 🎨 --- ปุ่มกดพรีเมียม (สีทอง) --- */
.premium-btn {
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  background: linear-gradient(135deg, #d4af37, #b58d22);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.15em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease;
  font-family: 'Prompt', sans-serif;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, #e6c55d, #c59b27);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  margin: 30px 0 20px;
}

.register-link { 
  color: #cbd5e1; 
  font-size: 0.95em; 
  font-weight: 300; 
  margin: 0;
}

.btn-link {
  background: none; border: none; font-size: 1em;
  text-decoration: none; cursor: pointer;
  font-family: 'Prompt', sans-serif; transition: 0.3s;
  font-weight: 400;
  padding: 0;
}
.btn-link:hover { color: #f3e5ab; text-decoration: underline; }

@media (max-width: 600px) {
  .glass-card { padding: 30px 20px; }
}
</style>