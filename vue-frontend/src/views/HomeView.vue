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
        <div class="content hero-content">
          <h1 class="bounce-in">รู้หรือเปล่า?</h1>
          <p class="subtitle">การกินที่ดี ไม่ใช่การอด <br>แต่คือการ <b>"เลือกกินให้เป็น"</b></p>
          <button @click="goTo('/register')" class="cta-button">เริ่มเปลี่ยนตัวเองวันนี้ 🚀</button>
          <p class="scroll-hint">เลื่อนลงเพื่อค้นพบความลับของอาหาร 👇</p>
        </div>
      </section>

      <section class="screen category-section protein-section">
        <div class="overlay"></div>
        <div class="content full-screen-content">
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

<section class="screen category-section carbs-section">
        
        <video autoplay loop muted playsinline class="bg-video">
          <source src="@/assets/images/ขนมปัง.mp4" type="video/mp4" />
        </video>

        <div class="overlay"></div>
        
        <div class="content full-screen-content">
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

<section class="screen category-section fat-section">
        
        <video autoplay loop muted playsinline class="bg-video">
          <source src="@/assets/images/ไขมันดี.mp4" type="video/mp4" />
        </video>

        <div class="overlay"></div>
        
        <div class="content full-screen-content">
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

      <section class="screen category-section vitamin-section">
        
        <video autoplay loop muted playsinline class="bg-video">
          <source src="@/assets/images/vitamin.mp4" type="video/mp4" />
        </video>

        <div class="overlay"></div>
        
        <div class="content full-screen-content">
          <h2>🥦 หมู่ที่ 4: วิตามินและแร่ธาตุ</h2>
          <p class="fact">"ผู้ช่วยส่วนตัวเรื่องระบบขับถ่าย เสริมภูมิคุ้มกัน และทำให้ผิวพรรณสดใสเปล่งปลั่ง"</p>
          <div class="food-icons" style="margin-bottom: 40px;">
            <span>🥦 บรอกโคลี</span>
            <span>🍓 เบอร์รี่</span>
            <span>🥬 ผักใบเขียว</span>
            <span>🍊 ส้ม</span>
          </div>
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
/* --- โครงสร้างหลัก --- */
* { box-sizing: border-box; margin: 0; padding: 0; }
.home-wrapper { font-family: 'Prompt', sans-serif; }

/* แถบเมนูด้านบน */
.sticky-nav {
  position: fixed; top: 0; left: 0; width: 100%;
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 30px; background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px); z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.logo { font-size: 1.5em; font-weight: bold; color: #2c3e50; }
.nav-buttons button { margin-left: 10px; padding: 8px 20px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; transition: all 0.3s; }
.btn-login { background: transparent; color: #4CAF50; border: 2px solid #4CAF50 !important; }
.btn-login:hover { background: #e8f5e9; }
.btn-register { background: #4CAF50; color: white; }
.btn-register:hover { background: #d4af37; }

/* ระบบเลื่อนหน้าจอ (Scroll Snap) */
.scroll-container { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; scroll-behavior: smooth; }
.screen { height: 100vh; width: 100%; scroll-snap-align: start; display: flex; justify-content: center; align-items: center; text-align: center; padding: 20px; position: relative; overflow: hidden; }
.content { max-width: 800px; animation: fadeIn 1s ease-in-out; z-index: 10; position: relative; }

/* --- โซน 1: ต้อนรับ (Hero) --- */
.hero-section { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
h1 { font-size: 4em; color: #2c3e50; margin-bottom: 10px; }
.subtitle { font-size: 1.8em; color: #555; margin-bottom: 30px; }
.cta-button { background: #ff5722; color: white; font-size: 1.3em; padding: 15px 45px; border: none; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4); transition: transform 0.2s; }
.cta-button:hover { transform: scale(1.05); background: #e64a19; }
.scroll-hint { margin-top: 50px; color: #888; animation: bounce 2s infinite; font-weight: bold; }

/* --- 💥 สไตล์รวมสำหรับหมวดหมู่อาหารแบบ Full Screen (Shared Class) 💥 --- */
.category-section {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* --- 🎬 สไตล์สำหรับ Video Background --- */
.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* บังคับให้วิดีโอขยายเต็มกรอบโดยไม่เสียสัดส่วน */
  z-index: 1; /* ให้อยู่ชั้นล่างสุด (แต่ใต้แผ่นฟิล์มสีดำ Overlay) */
}

/* แผ่นกรองสีดำกึ่งโปร่งใส */
.category-section .overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.65); /* ความมืดระดับ 65% บังภาพไม่ให้แย่งซีนตัวหนังสือ */
  z-index: 5;
}

/* จัดให้ตัวหนังสืออยู่เหนือ Overlay */
.category-section .full-screen-content { z-index: 10; width: 100%; }

/* ตกแต่งตัวหนังสือสีขาวลอยเด่นๆ */
.category-section h2 {
  color: #fff; font-size: 3em; margin-bottom: 20px;
  text-shadow: 0 2px 5px rgba(0,0,0,0.8);
}
.category-section .fact {
  color: #f1f1f1; font-size: 1.4em; font-style: italic; margin-bottom: 40px; line-height: 1.6;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

/* ป้ายชื่ออาหารแบบใส (Glassmorphism) */
.category-section .food-icons {
  display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;
}
.category-section .food-icons span {
  background: rgba(255, 255, 255, 0.15);
  color: #fff; padding: 12px 25px; border-radius: 50px; font-weight: bold;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s, background 0.3s;
}
.category-section .food-icons span:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.3);
}

.final-cta { background: #4CAF50; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.5); border: 2px solid white; }
.final-cta:hover { background: #45a049; }

/* --- 🖼️ กำหนดรูปภาพ GIF ให้แต่ละหมวดหมู่ (แก้ชื่อไฟล์ตรงนี้ได้เลย) --- */
.protein-section { background-image: url('@/assets/images/giphy.gif'); }



/* Animations & Responsive */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }

@media (max-width: 600px) {
  h1 { font-size: 2.8em; }
  .category-section h2 { font-size: 2.2em; }
  .category-section .fact { font-size: 1.1em; }
  .nav-buttons button { padding: 5px 10px; font-size: 0.9em; }
}
</style>