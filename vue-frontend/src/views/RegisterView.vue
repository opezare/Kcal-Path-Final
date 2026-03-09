<template>
  <div class="register-wrapper">
    <!-- <img 
      src="https://media.giphy.com/media/3o7TKo6fjy7XydHCiQ/giphy.gif" 
      alt="Premium Background" 
      class="gif-bg" -->
    />
    <div class="overlay"></div>

    <div class="register-container glass-card">
      <h1 class="premium-title">📝 สมัครสมาชิก</h1>
      <p class="subtitle">เริ่มต้นสร้างสุขภาพที่ดีในแบบที่หรูหราที่สุด</p>

      <div class="form-section glass-inner-card">
        <h3>ข้อมูลบัญชี <span class="text-accent">(จำเป็น)</span></h3>
        <div class="form-group">
          <label>ชื่อผู้ใช้ (Username)</label>
          <input type="text" v-model="form.username" class="glass-input" placeholder="ตั้งชื่อผู้ใช้ของคุณ">
        </div>
        <div class="form-group">
          <label>อีเมล (Email)</label>
          <input type="email" v-model="form.email" class="glass-input" placeholder="example@email.com">
        </div>
        <div class="form-group">
          <label>รหัสผ่าน (Password)</label>
          <input type="password" v-model="form.password" class="glass-input" placeholder="ตั้งรหัสผ่าน">
        </div>
      </div>

      <div class="form-section glass-inner-card">
        <h3>ข้อมูลสุขภาพพื้นฐาน</h3>
        
        <div class="row">
          <div class="form-group half">
            <label>น้ำหนัก (กก.)</label>
            <input type="number" v-model="form.weight" class="glass-input" min="30" max="300">
          </div>
          <div class="form-group half">
            <label>ส่วนสูง (ซม.)</label>
            <input type="number" v-model="form.height" class="glass-input" min="100" max="250">
          </div>
        </div>

        <div class="row">
          <div class="form-group half">
            <label>อายุ (ปี)</label>
            <input type="number" v-model="form.age" class="glass-input" min="10" max="100">
          </div>
          <div class="form-group half">
            <label>เพศ</label>
            <select v-model="form.gender" class="glass-input">
              <option value="male" class="dark-option">ชาย</option>
              <option value="female" class="dark-option">หญิง</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>ระดับการออกกำลังกาย</label>
          <select v-model="form.activity_level" class="glass-input">
            <option value="low" class="dark-option">น้อย (นั่งทำงาน, ไม่ออกกำลังกาย)</option>
            <option value="medium" class="dark-option">ปานกลาง (ออกกำลังกาย 3-5 วัน/สัปดาห์)</option>
            <option value="high" class="dark-option">มาก (ออกกำลังกาย 6-7 วัน/สัปดาห์)</option>
          </select>
        </div>

        <div class="form-group highlight-box">
          <label class="text-accent">เป้าหมายของคุณ</label>
          <select v-model="form.goal" class="glass-input">
            <option value="lose" class="dark-option">ลดน้ำหนัก (เน้นลดไขมัน)</option>
            <option value="maintain" class="dark-option">รักษาน้ำหนัก (สุขภาพดี หุ่นคงที่)</option>
            <option value="gain" class="dark-option">เพิ่มกล้ามเนื้อ (เพิ่มน้ำหนัก)</option>
          </select>
        </div>
      </div>

      <button @click="register" class="premium-btn">ยืนยันการสมัครสมาชิก</button>
      
      <div class="divider"></div>
      
      <p class="login-link">
        มีบัญชีอยู่แล้วใช่ไหม? 
        <button @click="goToLogin" class="btn-link text-accent">เข้าสู่ระบบที่นี่</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  weight: 60,
  height: 165,
  age: 25,
  gender: 'male',
  activity_level: 'medium',
  goal: 'lose' 
})

const register = async () => {
  if (!form.value.username || !form.value.email || !form.value.password) {
    alert('กรุณากรอก ชื่อผู้ใช้, อีเมล และรหัสผ่าน ให้ครบถ้วนครับ!')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()

    if (response.ok) {
      alert('🎉 สมัครสมาชิกสำเร็จ! ระบบจะพาคุณเข้าสู่ระบบทันที')
      
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', form.value.username)
      
      router.push('/dashboard')
    } else {
      alert(`❌ สมัครไม่สำเร็จ: ${data.error}`)
    }
  } catch (error) {
    console.error('Register Error:', error)
    alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ โปรดตรวจสอบว่ารัน backend หรือยัง')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 🎨 --- พื้นหลัง --- */
.register-wrapper {
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
  object-fit: cover; z-index: 0; opacity: 0.6; /* ปรับให้สว่างขึ้นนิดหน่อยเพื่อให้ดูหรู */
}

.overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(15, 23, 42, 0.4); /* ลดความดำลง เพื่อให้เห็นลายพื้นหลังชัดขึ้น */
  z-index: 1;
}

/* 🎨 --- คอนเทนเนอร์หลัก (ดีไซน์โปร่งแสงพรีเมียม) --- */
.register-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05); /* โปร่งใสมากๆ */
  backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); /* เบลอจัดๆ แบบกระจกฝ้า */
  border: 1px solid rgba(255, 255, 255, 0.15); /* ขอบขาวจางๆ */
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
}

.premium-title {
  margin-top: 0;
  color: #ffffff;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 2em;
}

.subtitle { color: #cbd5e1; margin-bottom: 30px; font-weight: 300; }

/* 🎨 --- ส่วนของฟอร์ม --- */
.glass-inner-card {
  background: transparent; /* ไม่ใส่สีพื้นหลัง ให้กลืนไปกับกระจกแผ่นใหญ่ */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* มีแค่เส้นคั่นบางๆ */
  padding: 0 0 20px 0;
  margin-bottom: 20px;
  text-align: left;
}

.form-section h3 { 
  margin-top: 0; 
  color: #f1f5f9; 
  font-weight: 500;
  font-size: 1.1em; 
  margin-bottom: 20px;
}

.text-accent { color: #d4af37; /* สีทองแชมเปญ */ font-weight: 400; }

.form-group { margin-bottom: 18px; }
.row { display: flex; gap: 15px; }
.half { flex: 1; }

label { display: block; font-weight: 300; margin-bottom: 8px; color: #e2e8f0; font-size: 0.9em; }

/* 🎨 --- Input Fields แบบหรูหรา --- */
.glass-input {
  width: 100%;
  padding: 12px 15px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.08); /* พื้นหลังขาวจางๆ */
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  font-size: 1em;
  font-family: 'Prompt', sans-serif;
  font-weight: 300;
  outline: none;
  transition: all 0.3s ease;
  color-scheme: dark; 
}

.glass-input:focus {
  border-color: #d4af37; /* ตอนกดพิมพ์ ขอบจะเปลี่ยนเป็นสีทอง */
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
}

.glass-input::placeholder { color: #94a3b8; font-weight: 300; }

.dark-option { background-color: #1e293b; color: #fff; }

.highlight-box {
  background: rgba(212, 175, 55, 0.05); /* พื้นหลังอมทองจางๆ */
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  margin-top: 25px;
}

/* 🎨 --- ปุ่มกดพรีเมียม --- */
.premium-btn {
  width: 100%;
  padding: 15px;
  margin-top: 10px;
  background: linear-gradient(135deg, #d4af37, #b58d22); /* ไล่สีทอง */
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
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

.login-link { color: #cbd5e1; font-size: 0.9em; font-weight: 300; }

.btn-link {
  background: none; border: none; font-size: 1em;
  text-decoration: none; cursor: pointer;
  font-family: 'Prompt', sans-serif; transition: 0.3s;
  font-weight: 400;
}
.btn-link:hover { color: #f3e5ab; text-decoration: underline; }

@media (max-width: 600px) {
  .row { flex-direction: column; gap: 0; }
  .glass-card { padding: 30px 20px; }
}
</style>