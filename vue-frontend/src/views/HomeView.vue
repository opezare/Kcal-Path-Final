<template>
  <div class="home-wrapper">
    <nav class="sticky-nav">
      <div class="logo">🥗 Kcal-Path</div>
      <div class="nav-buttons">
        <button @click="goTo('/login')" class="btn-login">เข้าสู่ระบบ</button>
        <button @click="goTo('/register')" class="btn-register">สมัครสมาชิก</button>
      </div>
    </nav>

    <div class="scroll-container">
      
      <section class="screen hero-section">
        <div class="content">
          <h1 class="bounce-in">รู้หรือเปล่า?</h1>
          <p class="subtitle">การกินที่ดี ไม่ใช่การอด <br>แต่คือการ <b>"เลือกกินให้เป็น"</b></p>
          <button @click="goTo('/register')" class="cta-button">เริ่มเปลี่ยนตัวเองวันนี้ 🚀</button>
          <p class="scroll-hint">เลื่อนลงเพื่อค้นพบความลับของอาหาร 👇</p>
        </div>
      </section>

      <section class="screen protein-section">
        <div class="content card">
          <h2>🥩 หมู่ที่ 1: โปรตีน (Protein)</h2>
          <p class="fact">"ไม่ใช่แค่เรื่องของกล้ามเนื้อ แต่ช่วยซ่อมแซมทุกเซลล์ในร่างกาย และทำให้อิ่มนาน!"</p>
          <div class="food-icons">
            <span>🍗 อกไก่</span>
            <span>🥚 ไข่ต้ม</span>
            <span>🍣 แซลมอน</span>
            <span>🧊 เต้าหู้</span>
          </div>
        </div>
      </section>

      <section class="screen carbs-section">
        <div class="content card">
          <h2>🍚 หมู่ที่ 2: คาร์บ (Carbohydrates)</h2>
          <p class="fact">"อย่ากลัวคาร์บ! นี่คือแหล่งพลังงานหลักของสมอง แค่เลือก 'คาร์บเชิงซ้อน' ก็หุ่นดีได้"</p>
          <div class="food-icons">
            <span>🌾 ข้าวกล้อง</span>
            <span>🍠 มันหวาน</span>
            <span>🥣 ข้าวโอ๊ต</span>
            <span>🍞 โฮลวีต</span>
          </div>
        </div>
      </section>

      <section class="screen fat-section">
        <div class="content card">
          <h2>🥑 หมู่ที่ 3: ไขมันดี (Healthy Fats)</h2>
          <p class="fact">"กินไขมันไม่ได้แปลว่าจะอ้วน! ไขมันดีช่วยดูดซึมวิตามินและปรับสมดุลฮอร์โมนนะ"</p>
          <div class="food-icons">
            <span>🥑 อะโวคาโด</span>
            <span>🥜 อัลมอนด์</span>
            <span>🫒 น้ำมันมะกอก</span>
            <span>🐟 ปลาทะเล</span>
          </div>
        </div>
      </section>

      <section class="screen vitamin-section">
        <div class="content card">
          <h2>🥦 หมู่ที่ 4: วิตามินและแร่ธาตุ</h2>
          <p class="fact">"ผู้ช่วยส่วนตัวเรื่องระบบขับถ่าย เสริมภูมิคุ้มกัน และทำให้ผิวพรรณสดใสเปล่งปลั่ง"</p>
          <div class="food-icons">
            <span>🥦 บรอกโคลี</span>
            <span>🍓 เบอร์รี่</span>
            <span>🥬 ผักใบเขียว</span>
            <span>🍊 ส้ม</span>
          </div>
          <br>
          <button @click="goTo('/register')" class="cta-button final-cta">พร้อมจะดูแลสุขภาพหรือยัง? ไปลุยกัน!</button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* ล้าง margin พื้นฐาน */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.home-wrapper {
  font-family: 'Prompt', sans-serif; /* แนะนำให้ใช้ฟอนต์ Prompt หรือฟอนต์ไทยสวยๆ */
}

/* แถบ Navigation */
.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
}

.nav-buttons button {
  margin-left: 10px;
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-login {
  background: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50 !important;
}
.btn-login:hover {
  background: #e8f5e9;
}

.btn-register {
  background: #4CAF50;
  color: white;
}
.btn-register:hover {
  background: #45a049;
}

/* หัวใจหลักของความ Smooth (Scroll Snap) */
.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory; /* บังคับให้ดูดเข้าล็อกแนวตั้ง */
  scroll-behavior: smooth;
}

/* ขนาดของแต่ละหน้าจอ */
.screen {
  height: 100vh;
  width: 100%;
  scroll-snap-align: start; /* จุดที่ให้มันดูดเข้าล็อก */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

/* ตกแต่งเนื้อหาข้างใน */
.content {
  max-width: 800px;
  animation: fadeIn 1s ease-in-out;
}

.card {
  background: rgba(255, 255, 255, 0.85);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

h1 { font-size: 3.5em; color: #2c3e50; margin-bottom: 10px; }
h2 { font-size: 2.5em; margin-bottom: 20px; color: #333; }
.subtitle { font-size: 1.5em; color: #555; margin-bottom: 30px; }
.fact { font-size: 1.2em; font-style: italic; color: #666; margin-bottom: 30px; line-height: 1.6; }

.food-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.food-icons span {
  background: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}
.food-icons span:hover {
  transform: translateY(-5px);
}

.cta-button {
  background: #ff5722;
  color: white;
  font-size: 1.2em;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
  transition: transform 0.2s, background 0.2s;
}
.cta-button:hover {
  background: #e64a19;
  transform: scale(1.05);
}
.final-cta { background: #4CAF50; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4); }
.final-cta:hover { background: #45a049; }

.scroll-hint {
  margin-top: 40px;
  color: #888;
  font-size: 0.9em;
  animation: bounce 2s infinite;
}

/* ธีมสีแต่ละโซน (ไล่สี Gradient ให้ดูหรูหรา) */
.hero-section { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
.protein-section { background: linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%); }
.carbs-section { background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); } /* สีข้าวโอ๊ต */
.fat-section { background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); }
.vitamin-section { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }

/* ปรับให้รองรับมือถือ */
@media (max-width: 600px) {
  h1 { font-size: 2.5em; }
  h2 { font-size: 1.8em; }
  .card { padding: 20px; }
  .nav-buttons button { padding: 5px 10px; font-size: 0.9em; }
}
</style>