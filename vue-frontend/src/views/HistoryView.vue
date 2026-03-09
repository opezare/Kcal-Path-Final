<template>
  <div class="history-bg">
    
    <img 
      src="@/assets/images/debc4c122780689.6125051268082.gif" 
      alt="Background GIF" 
      class="gif-bg"
    />

    <div class="overlay"></div>

    <div class="history-container">
      
      <header class="history-header">
        <h1>📅 ประวัติการกินย้อนหลัง</h1>
        <button @click="router.push('/dashboard')" class="btn-glass btn-back">⬅️ กลับหน้าหลัก</button>
      </header>

      <div class="glass-card date-picker-card">
        <label for="historyDate">เลือกวันที่ต้องการดูข้อมูล:</label>
        <div class="input-wrapper">
          <input 
            type="date" 
            id="historyDate" 
            v-model="selectedDate" 
            @change="fetchHistoryData"
            class="date-input glass-input"
          >
        </div>
      </div>

      <div class="glass-card summary-card">
        <h2>สรุปแคลอรี่ประจำวันที่ <span class="highlight-text">{{ formatDate(selectedDate) }}</span></h2>
        
        <div class="kcal-display">
          แคลอรี่รวม: 
          <b :class="{ 'text-danger': totalCalories > userTDEE, 'text-success': totalCalories <= userTDEE }">
            <span class="big-number">{{ totalCalories }}</span> / {{ userTDEE }} kcal
          </b>
        </div>
        
        <div class="progress-container glass-progress">
          <div 
            class="progress-bar" 
            :class="{ 'over-limit': totalCalories > userTDEE }"
            :style="{ width: Math.min((totalCalories / (userTDEE || 1)) * 100, 100) + '%' }"
          ></div>
        </div>

        <div class="macros-flex">
          <div class="macro-badge">🥩 โปรตีน: <span>{{ totalProtein }}g</span></div>
          <div class="macro-badge">🍚 คาร์บ: <span>{{ totalCarbs }}g</span></div>
          <div class="macro-badge">🥑 ไขมัน: <span>{{ totalFat }}g</span></div>
        </div>
      </div>

      <div class="glass-card food-list-card">
        <h3>🍽️ รายการอาหาร:</h3>
        
        <div v-if="foodLogs.length === 0" class="empty-state">
          <p>ไม่พบข้อมูลการกินของวันนี้</p>
          <span>(สงสัยจะลืมบันทึก หรืออดอาหารนะเนี่ย! 😅)</span>
        </div>

        <ul v-else class="log-list">
          <li v-for="food in foodLogs" :key="food.log_id" class="log-item">
            <div class="log-main">
              <span class="meal-badge">{{ formatMeal(food.meal_type) }}</span>
              <span class="food-name">{{ food.food_name }}</span>
            </div>
            <div class="log-details">
              <span class="food-qty">จำนวน: {{ food.quantity }}</span>
              <span class="food-kcal">{{ food.total_calories }} kcal</span>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)

const userTDEE = ref(0)
const totalCalories = ref(0)
const totalProtein = ref(0)
const totalCarbs = ref(0)
const totalFat = ref(0)
const foodLogs = ref([])

const formatMeal = (mealStr) => {
  const meals = { 'breakfast': 'มื้อเช้า', 'lunch': 'มื้อเที่ยง', 'dinner': 'มื้อเย็น', 'snack': 'ของว่าง' }
  return meals[mealStr] || mealStr
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const fetchHistoryData = async () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    router.push('/login')
    return
  }

  try {
    const userRes = await fetch(`http://localhost:3000/users/${userId}`)
    if (userRes.ok) {
      const userData = await userRes.json()
      let bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age)
      if (userData.gender === 'ชาย' || userData.gender === 'male') bmr += 5; else bmr -= 161;
      const multipliers = { 'low': 1.2, 'medium': 1.375, 'high': 1.55, 'น้อย': 1.2, 'ปานกลาง': 1.375, 'มาก': 1.55 }
      userTDEE.value = Math.round(bmr * (multipliers[userData.activity_level] || 1.2))
    }

    const summaryRes = await fetch(`http://localhost:3000/daily-summary/${userId}/${selectedDate.value}`)
    if (summaryRes.ok) {
      const summaryData = await summaryRes.json()
      totalCalories.value = summaryData.summary.total_calories || 0
      totalProtein.value = summaryData.summary.total_protein || 0
      totalCarbs.value = summaryData.summary.total_carbs || 0
      totalFat.value = summaryData.summary.total_fat || 0
      foodLogs.value = summaryData.logs || []
    }
  } catch (error) {
    console.error('Error fetching history:', error)
  }
}

onMounted(() => {
  fetchHistoryData()
})
</script>

<style scoped>
/* 🎨 --- พื้นหลัง --- */
.history-bg {
  min-height: 100vh;
  position: relative;
  font-family: 'Prompt', sans-serif;
  color: white;
  padding: 40px 20px;
  box-sizing: border-box;
  overflow-x: hidden; 
}

/* 🖼️ 2. CSS สำหรับควบคุม GIF ให้เต็มจอ (เปลี่ยนชื่อคลาสเป็น .gif-bg) */
.gif-bg {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover; /* โค้ดนี้เด็ดมาก ทำให้รูปภาพ/GIF ไม่เบี้ยวแม้จอจะหดหรือขยาย */
  z-index: 0; 
  opacity: 0.5; /* ปรับความสว่าง-มืด ของ GIF ตรงนี้ (0.0 - 1.0) */
}

/* 🌌 แผ่นกรองสีเข้ม */
.overlay {
  position: fixed; 
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.729); 
  z-index: 1;
}

/* เนื้อหาหลัก */
.history-container {
  position: relative; 
  z-index: 2; 
  max-width: 800px; 
  margin: 0 auto;
}

/* 🎨 --- ส่วนหัว --- */
.history-header {
  display: flex; justify-content: space-between; align-items: center; 
  margin-bottom: 30px; flex-wrap: wrap; gap: 15px;
}
.history-header h1 { margin: 0; font-size: 2.2em; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }

.btn-glass {
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
  color: white; padding: 10px 20px; border-radius: 20px; cursor: pointer;
  backdrop-filter: blur(5px); transition: all 0.3s ease; font-family: 'Prompt', sans-serif;
}
.btn-glass:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }

/* 🎨 --- กล่องกระจกกลาง (Glassmorphism Core) --- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px; padding: 30px; margin-bottom: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 🎨 --- Date Picker --- */
.date-picker-card { text-align: center; padding: 25px; }
.date-picker-card label { display: block; font-size: 1.2em; margin-bottom: 15px; font-weight: 500; color: #e2e8f0; }
.glass-input {
  background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.3);
  color: white; padding: 12px 20px; border-radius: 12px; font-size: 1.2em;
  font-family: 'Prompt', sans-serif; outline: none; transition: all 0.3s ease;
  cursor: pointer; color-scheme: dark; 
}
.glass-input:focus { border-color: #4CAF50; box-shadow: 0 0 15px rgba(76, 175, 80, 0.4); }

/* 🎨 --- Summary Card --- */
.summary-card { text-align: center; }
.summary-card h2 { margin-top: 0; font-size: 1.5em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
.highlight-text { color: #3b82f6; }
.kcal-display { font-size: 1.3em; margin: 20px 0; }
.big-number { font-size: 1.8em; }
.text-success { color: #4CAF50; }
.text-danger { color: #ff4d4d; }

.glass-progress { background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; height: 18px; overflow: hidden; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05); }
.progress-bar { background: linear-gradient(90deg, #4CAF50, #81c784); height: 100%; transition: width 0.5s ease-in-out; border-radius: 20px; }
.over-limit { background: linear-gradient(90deg, #ff4d4d, #ff8080) !important; }

.macros-flex { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 20px; }
.macro-badge { background: rgba(0, 0, 0, 0.3); padding: 8px 15px; border-radius: 12px; font-size: 0.95em; color: #cbd5e1; }
.macro-badge span { color: white; font-weight: bold; }

/* 🎨 --- รายการอาหาร --- */
.food-list-card h3 { margin-top: 0; color: #f8fafc; }
.empty-state { text-align: center; padding: 40px 20px; background: rgba(0,0,0,0.2); border-radius: 15px; color: #94a3b8; }
.empty-state span { display: block; margin-top: 10px; font-size: 0.9em; }

.log-list { list-style: none; padding: 0; margin: 0; }
.log-item {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0, 0, 0, 0.2); padding: 15px 20px; border-radius: 15px; margin-bottom: 12px;
  border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;
}
.log-item:hover { background: rgba(0, 0, 0, 0.4); }
.log-main { display: flex; align-items: center; gap: 15px; }
.meal-badge { background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 10px; font-size: 0.85em; color: #e2e8f0; }
.food-name { font-weight: bold; font-size: 1.1em; color: #fff; }
.log-details { text-align: right; display: flex; flex-direction: column; gap: 5px; }
.food-qty { font-size: 0.85em; color: #94a3b8; }
.food-kcal { color: #4CAF50; font-weight: bold; }

@media (max-width: 600px) {
  .history-header { flex-direction: column; text-align: center; }
  .log-item { flex-direction: column; align-items: flex-start; gap: 15px; }
  .log-details { text-align: left; flex-direction: row; gap: 15px; align-items: center; width: 100%; justify-content: space-between; }
}
</style>