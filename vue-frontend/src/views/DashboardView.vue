<template>
  <div class="dashboard-bg">
    <div class="overlay"></div>

    <div class="dashboard-container">
      
      <header class="dashboard-header">
        <div class="greeting">
          <h1>สวัสดี, <span>{{ userName }}</span> 💪</h1>
          <p class="date-text">สรุปข้อมูลประจำวันที่ {{ todayDateDisplay }}</p>
        </div>
        <div class="header-actions">
          <button @click="router.push('/edit-profile')" class="btn-glass btn-edit">⚙️ แก้ไขโปรไฟล์</button>
          <button @click="router.push('/history')" class="btn-glass btn-history">📅 ประวัติ</button>
          <button @click="logout" class="btn-glass btn-logout">🚪 ออกจากระบบ</button>
        </div>
      </header>

      <section class="hero-grid">
        <div class="glass-card kcal-highlight">
          <h3>เป้าหมายแคลอรี่วันนี้</h3>
          
          <div class="kcal-circle-container">
            <div class="kcal-circle" :style="{ background: `conic-gradient(${totalCalories > userTDEE ? '#ff4d4d' : '#4CAF50'} ${(totalCalories / (userTDEE || 1)) * 360}deg, rgba(255,255,255,0.1) 0deg)` }">
              <div class="circle-inner">
                <span class="consumed" :class="{ 'text-danger': totalCalories > userTDEE }">{{ totalCalories }}</span>
                <span class="divider">/</span>
                <span class="target">{{ userTDEE }}</span>
                <span class="unit">kcal</span>
              </div>
            </div>
          </div>

          <div class="kcal-status">
            <p v-if="totalCalories > userTDEE" class="alert-text">
              ⚠️ วันนี้คุณกินเกินเป้าหมายแล้ว! พรุ่งนี้เอาใหม่นะ
            </p>
            <p v-else class="safe-text">
              เยี่ยมมาก! คุณยังกินได้อีก <b>{{ userTDEE - totalCalories }}</b> kcal
            </p>
          </div>
        </div>

        <div class="glass-card macros-highlight">
          <h3>สารอาหารที่ได้รับ (Macros)</h3>
          
          <div class="macro-box protein">
            <div class="macro-header"><span>🥩 โปรตีน</span> <span>{{ totalProtein }} g</span></div>
            <div class="macro-bar"><div class="fill" :style="{ width: Math.min((totalProtein / 150) * 100, 100) + '%' }"></div></div>
          </div>

          <div class="macro-box carbs">
            <div class="macro-header"><span>🍚 คาร์บ</span> <span>{{ totalCarbs }} g</span></div>
            <div class="macro-bar"><div class="fill" :style="{ width: Math.min((totalCarbs / 250) * 100, 100) + '%' }"></div></div>
          </div>

          <div class="macro-box fat">
            <div class="macro-header"><span>🥑 ไขมัน</span> <span>{{ totalFat }} g</span></div>
            <div class="macro-bar"><div class="fill" :style="{ width: Math.min((totalFat / 70) * 100, 100) + '%' }"></div></div>
          </div>
        </div>
      </section>

      <section class="health-info-grid">
        <div class="glass-card mini-card">
          <p class="label">ดัชนีมวลกาย (BMI)</p>
          <h2 class="value">{{ userBMI }}</h2>
          <p class="sub-text">{{ bmiMeaning }}</p>
        </div>
        <div class="glass-card mini-card">
          <p class="label">เผาผลาญพื้นฐาน (BMR)</p>
          <h2 class="value">{{ userBMR }}</h2>
          <p class="sub-text">kcal / วัน</p>
        </div>
        <div class="glass-card mini-card">
          <p class="label">เป้าหมายของคุณ</p>
          <h2 class="value goal-text">{{ formatGoal(userGoal).split(' ')[0] }}</h2>
          <p class="sub-text">{{ formatGoal(userGoal).substring(2) }}</p>
        </div>
        <div class="glass-card mini-card">
          <p class="label">ข้อมูลร่างกาย</p>
          <p class="sub-text">หนัก: <b>{{ userWeight }}</b> กก.</p>
          <p class="sub-text">สูง: <b>{{ userHeight }}</b> ซม.</p>
        </div>
      </section>

      <section class="food-logs-section">
        <div class="glass-card full-width">
          <div class="log-header">
            <h3>🍽️ รายการอาหารวันนี้</h3>
            <button @click="goToAddFood" class="btn-primary">+ เพิ่มมื้ออาหาร</button>
          </div>

          <div v-if="foodLogs.length === 0" class="empty-state">
            <p>ยังไม่มีข้อมูลอาหารของวันนี้... เริ่มบันทึกมื้อแรกกันเลย!</p>
          </div>

          <ul v-else class="log-list">
            <li v-for="food in foodLogs" :key="food.log_id" class="log-item">
              <div class="log-info">
                <span class="meal-badge">{{ formatMeal(food.meal_type) }}</span>
                <span class="food-name">{{ food.food_name }}</span>
                <span class="food-kcal">{{ food.total_calories }} kcal</span>
                <div class="food-macros">P: {{ food.total_protein }}g | C: {{ food.total_carbs }}g | F: {{ food.total_fat }}g</div>
              </div>
              <button @click="deleteLog(food.log_id)" class="btn-delete">ลบ</button>
            </li>
          </ul>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// --- ลอจิกเดิมของคุณทั้งหมด อยู่ตรงนี้ (ไม่มีการเปลี่ยนโค้ดส่วนนี้) ---
const router = useRouter()

const userName = ref('กำลังโหลด...')
const userWeight = ref(0)
const userHeight = ref(0)
const userAge = ref(0)
const userGender = ref('-')
const userGoal = ref('-')
const userBMI = ref(0)
const bmiMeaning = ref('')
const userBMR = ref(0)
const userTDEE = ref(0)

const todayDateDisplay = ref(new Date().toLocaleDateString('th-TH'))
const totalCalories = ref(0)
const totalProtein = ref(0)
const totalCarbs = ref(0)
const totalFat = ref(0)
const foodLogs = ref([])

const formatGender = (genderStr) => {
  if (genderStr === 'male') return 'ชาย'
  if (genderStr === 'female') return 'หญิง'
  return genderStr
}

const formatGoal = (goalStr) => {
  const goals = {
    'lose': '📉 ลดน้ำหนัก',
    'maintain': '⚖️ รักษาน้ำหนัก',
    'gain': '💪 เพิ่มกล้ามเนื้อ'
  }
  return goals[goalStr] || goalStr
}

const formatMeal = (mealStr) => {
  const meals = {
    'breakfast': 'มื้อเช้า',
    'lunch': 'มื้อเที่ยง',
    'dinner': 'มื้อเย็น',
    'snack': 'ของว่าง'
  }
  return meals[mealStr] || mealStr
}

const calculateHealth = (weight, height, age, gender, activityLevel) => {
    const heightM = height / 100
    const bmi = weight / (heightM * heightM)
    userBMI.value = bmi.toFixed(2)

    if (bmi < 18.5) bmiMeaning.value = '(น้ำหนักน้อย)'
    else if (bmi < 23) bmiMeaning.value = '(สมส่วน)'
    else if (bmi < 25) bmiMeaning.value = '(น้ำหนักเกิน)'
    else bmiMeaning.value = '(โรคอ้วน)'

    let bmr = (10 * weight) + (6.25 * height) - (5 * age)
    if (gender === 'ชาย' || gender === 'male') bmr += 5; else bmr -= 161;
    userBMR.value = Math.round(bmr)

    const multipliers = { 
      'น้อย': 1.2, 'ปานกลาง': 1.375, 'มาก': 1.55,
      'low': 1.2, 'medium': 1.375, 'high': 1.55 
    }
    const factor = multipliers[activityLevel] || 1.2
    userTDEE.value = Math.round(bmr * factor)
}

const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
        router.push('/login')
        return
    }

    try {
        const userRes = await fetch(`http://localhost:3000/users/${userId}`)
        if (userRes.ok) {
            const userData = await userRes.json()
            userName.value = userData.username
            userWeight.value = userData.weight
            userHeight.value = userData.height
            userAge.value = userData.age
            userGender.value = userData.gender
            userGoal.value = userData.goal
            calculateHealth(userData.weight, userData.height, userData.age, userData.gender, userData.activity_level)
        }

        const d = new Date()
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        
        const summaryRes = await fetch(`http://localhost:3000/daily-summary/${userId}/${today}`)
        if (summaryRes.ok) {
            const summaryData = await summaryRes.json()
            totalCalories.value = summaryData.summary.total_calories || 0
            totalProtein.value = summaryData.summary.total_protein || 0
            totalCarbs.value = summaryData.summary.total_carbs || 0
            totalFat.value = summaryData.summary.total_fat || 0
            foodLogs.value = summaryData.logs || []
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const logout = () => {
    localStorage.clear()
    router.push('/') 
}

const goToAddFood = () => {
    router.push('/add-food')
}

onMounted(() => {
    fetchDashboardData()
})

const deleteLog = async (logId) => {
  if (!confirm('คุณแน่ใจนะว่าจะลบรายการนี้?')) return;
  try {
    const response = await fetch(`http://localhost:3000/food-logs/${logId}`, { method: 'DELETE' });
    if (response.ok) {
      fetchDashboardData(); 
    } else {
      alert('ลบไม่สำเร็จ กรุณาลองใหม่');
    }
  } catch (error) {
    console.error('Delete Error:', error);
  }
}
</script>

<style scoped>
/* 🎨 --- พื้นหลังและโครงสร้างหลัก --- */
.dashboard-bg {
  min-height: 100vh;
  /* 🚩 เปลี่ยนรูปพื้นหลังได้ที่นี่ แนะนำรูปอาหารโทนเข้มๆ */
  background-image: url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1920&auto=format&fit=crop'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  font-family: 'Prompt', sans-serif;
  color: white;
}
.overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* สีน้ำเงินเข้มโปร่งแสง */
  z-index: 1;
}
.dashboard-container {
  position: relative; z-index: 2;
  max-width: 1100px; margin: 0 auto; padding: 40px 20px;
}

/* 🎨 --- ส่วนหัว --- */
.dashboard-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
  flex-wrap: wrap; gap: 20px;
}
.greeting h1 { margin: 0; font-size: 2.2em; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.greeting h1 span { color: #4CAF50; }
.date-text { margin: 5px 0 0 0; color: #cbd5e1; font-size: 1.1em; }
.header-actions { display: flex; gap: 10px; }

/* 🎨 --- ปุ่มสไตล์กระจก --- */
.btn-glass {
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
  color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer;
  backdrop-filter: blur(5px); transition: all 0.3s ease; font-family: 'Prompt', sans-serif;
}
.btn-glass:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
.btn-logout:hover { background: rgba(255, 77, 77, 0.3); border-color: #ff4d4d; }

.btn-primary {
  background: #4CAF50; color: white; border: none; padding: 10px 20px;
  border-radius: 20px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  transition: transform 0.2s;
}
.btn-primary:hover { transform: scale(1.05); background: #45a049; }

/* 🎨 --- กล่องกระจก (Glassmorphism Core) --- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
  padding: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.glass-card h3 { margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px; color: #f8fafc; font-size: 1.3em; }

/* 🎨 --- Grid Layout --- */
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.health-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px; }
.mini-card { padding: 20px; text-align: center; }
.mini-card .label { font-size: 0.9em; color: #94a3b8; margin-bottom: 5px; }
.mini-card .value { font-size: 2em; margin: 0; color: #fff; }
.mini-card .sub-text { font-size: 0.8em; color: #cbd5e1; margin-top: 5px; }
.goal-text { color: #3b82f6 !important; font-size: 1.5em !important; }

/* 🎨 --- วงแหวนแคลอรี่ (UI พระเอก) --- */
.kcal-highlight { text-align: center; }
.kcal-circle-container { display: flex; justify-content: center; margin: 20px 0; }
.kcal-circle {
  width: 200px; height: 200px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}
.circle-inner {
  width: 170px; height: 170px; border-radius: 50%;
  background: #1e293b; /* สีพื้นหลังในวงแหวน */
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.consumed { font-size: 3em; font-weight: bold; color: #fff; line-height: 1; }
.divider { font-size: 1.5em; color: #64748b; margin: 5px 0; }
.target { font-size: 1.5em; color: #94a3b8; }
.unit { font-size: 0.9em; color: #64748b; }
.text-danger { color: #ff4d4d !important; }

.kcal-status p { margin: 0; font-weight: bold; border-radius: 10px; padding: 10px; }
.alert-text { background: rgba(255, 77, 77, 0.1); color: #ff8080; border: 1px solid rgba(255, 77, 77, 0.2); }
.safe-text { background: rgba(76, 175, 80, 0.1); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.2); }

/* 🎨 --- แถบสารอาหาร (Macros Bars) --- */
.macro-box { margin-bottom: 20px; }
.macro-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; }
.macro-bar { width: 100%; height: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; }
.macro-bar .fill { height: 100%; border-radius: 10px; transition: width 1s ease-in-out; }
.protein .fill { background: linear-gradient(90deg, #ff7e5f, #feb47b); }
.carbs .fill { background: linear-gradient(90deg, #f6d365, #fda085); }
.fat .fill { background: linear-gradient(90deg, #84fab0, #8fd3f4); }

/* 🎨 --- รายการอาหาร (Food Logs) --- */
.log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;}
.log-header h3 { margin: 0; border: none; padding: 0; }
.log-list { list-style: none; padding: 0; margin: 0; }
.log-item { 
  display: flex; justify-content: space-between; align-items: center; 
  background: rgba(0, 0, 0, 0.2); padding: 15px 20px; border-radius: 15px; margin-bottom: 10px;
  border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;
}
.log-item:hover { background: rgba(0, 0, 0, 0.4); }
.meal-badge { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 10px; font-size: 0.8em; margin-right: 15px; color: #e2e8f0; }
.food-name { font-weight: bold; font-size: 1.1em; color: #fff; margin-right: 15px;}
.food-kcal { color: #4CAF50; font-weight: bold; }
.food-macros { font-size: 0.85em; color: #94a3b8; margin-top: 5px; }

.btn-delete {
  background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d;
  padding: 5px 12px; border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.btn-delete:hover { background: #ff4d4d; color: white; }
.empty-state { text-align: center; padding: 30px; color: #94a3b8; background: rgba(0,0,0,0.1); border-radius: 15px; }

/* 📱 Responsive สำหรับมือถือ */
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; }
  .health-info-grid { grid-template-columns: 1fr 1fr; }
  .dashboard-header { flex-direction: column; text-align: center; }
  .log-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .btn-delete { align-self: flex-end; }
}
</style>