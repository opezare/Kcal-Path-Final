<template>
  <div class="edit-profile-bg">
    <div class="overlay"></div>

    <div class="edit-container">
      <div class="glass-card form-card">
        <div class="header-section">
          <h1>⚙️ แก้ไขข้อมูลส่วนตัว</h1>
          <p>ปรับปรุงข้อมูลเพื่อการคำนวณ TDEE ที่แม่นยำขึ้น</p>
        </div>

        <div class="form-content">
          <div class="form-row">
            <div class="form-group">
              <label>น้ำหนัก (กก.)</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.weight" placeholder="เช่น 65">
              </div>
            </div>
            <div class="form-group">
              <label>ส่วนสูง (ซม.)</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.height" placeholder="เช่น 170">
              </div>
            </div>
            <div class="form-group">
              <label>อายุ (ปี)</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.age" placeholder="เช่น 25">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>เพศ</label>
            <select v-model="form.gender" class="custom-select">
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
            </select>
          </div>

          <div class="form-group">
            <label>ระดับการออกกำลังกาย</label>
            <select v-model="form.activity_level" class="custom-select">
              <option value="low">น้อย (ทำงานนั่งโต๊ะ ไม่ออกกำลังกาย)</option>
              <option value="medium">ปานกลาง (ออกกำลังกาย 3-5 วัน/สัปดาห์)</option>
              <option value="high">มาก (ออกกำลังกายหนัก 6-7 วัน/สัปดาห์)</option>
            </select>
          </div>

          <div class="form-group">
            <label>เป้าหมายของคุณ</label>
            <select v-model="form.goal" class="custom-select">
              <option value="lose"> ลดน้ำหนัก / ลดไขมัน</option>
              <option value="maintain"> รักษาน้ำหนัก / สุขภาพดี</option>
              <option value="gain"> เพิ่มน้ำหนัก / สร้างกล้ามเนื้อ</option>
            </select>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="updateProfile" class="btn-primary">💾 บันทึกการเปลี่ยนแปลง</button>
          <button @click="router.push('/dashboard')" class="btn-glass">ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// --- ลอจิกเดิมของคุณทั้งหมด ไม่มีการแก้ไข ---
const router = useRouter()
const form = ref({
  weight: 0, height: 0, age: 0, 
  gender: '', activity_level: '', goal: ''
})

onMounted(async () => {
  const userId = localStorage.getItem('userId')
  const res = await fetch(`http://localhost:3000/users/${userId}`)
  if (res.ok) {
    const data = await res.json()
    form.value = data
  }
})

const updateProfile = async () => {
  const userId = localStorage.getItem('userId')
  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (res.ok) {
      alert('บันทึกข้อมูลเรียบร้อย! 🎉')
      router.push('/dashboard')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
/* 🎨 --- พื้นหลังแบบเดียวกับ Dashboard --- */
.edit-profile-bg {
  min-height: 100vh;
  /* 🚩 รูปพื้นหลังแนวฟิตเนส โทนดาร์กเท่ๆ */
  background-image: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  font-family: 'Prompt', sans-serif;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.85); 
  z-index: 1;
}

.edit-container {
  position: relative; z-index: 2;
  width: 100%; max-width: 600px; padding: 20px;
}

/* 🎨 --- กล่องกระจก (Glassmorphism) --- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px; padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

/* 🎨 --- ส่วนหัว --- */
.header-section { text-align: center; margin-bottom: 30px; }
.header-section h1 { margin: 0 0 10px 0; font-size: 2em; color: #fff; }
.header-section p { color: #cbd5e1; margin: 0; }

/* 🎨 --- ฟอร์มกรอกข้อมูล --- */
.form-content { margin-bottom: 30px; }
.form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.form-group { margin-bottom: 20px; text-align: left; }
.form-group label { display: block; font-weight: 500; color: #e2e8f0; margin-bottom: 8px; font-size: 0.95em; }

/* สไตล์ Input และ Select */
input[type="number"], .custom-select {
  width: 100%; padding: 12px 15px;
  background: rgba(255, 255, 255, 0.08); /* พื้นหลังโปร่งแสง */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px; color: white; font-family: 'Prompt', sans-serif;
  font-size: 1em; transition: all 0.3s ease;
  box-sizing: border-box; /* สำคัญ: ป้องกัน input ล้นกล่อง */
}

input[type="number"]:focus, .custom-select:focus {
  outline: none; border-color: #4CAF50;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

/* ปรับสีตัวเลือกใน Dropdown (เพราะตัวเลือกจะไม่อิงตามความใส) */
.custom-select option { background-color: #1e293b; color: white; }

/* 🎨 --- ปุ่ม --- */
.action-buttons { display: flex; gap: 15px; flex-direction: column; }

.btn-primary {
  background: #4CAF50; color: white; border: none; padding: 15px;
  border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1.1em;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.2s;
  width: 100%;
}
.btn-primary:hover { transform: translateY(-2px); background: #45a049; }

.btn-glass {
  background: transparent; color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.2); padding: 15px;
  border-radius: 12px; cursor: pointer; font-size: 1em; transition: all 0.2s;
  width: 100%;
}
.btn-glass:hover { background: rgba(255, 255, 255, 0.1); color: white; }

/* 📱 Responsive สำหรับมือถือ */
@media (max-width: 500px) {
  .glass-card { padding: 25px; }
  .form-row { grid-template-columns: 1fr; gap: 0; } /* มือถือให้เรียงตัวเลขลงมาเป็นบรรทัดเดียว */
}
</style>