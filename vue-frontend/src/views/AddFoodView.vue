<template>
  <div class="add-food-wrapper">
    <video autoplay loop muted playsinline class="video-bg">
      <source src="@/assets/images/เมนู.mp4" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <div class="add-food-container glass-card">
      <h1 class="premium-title">บันทึกมื้ออาหาร 🍽️</h1>
      <p class="subtitle">เพิ่มรายการอาหารที่คุณทานในวันนี้</p>

      <div class="form-section glass-inner-card">
        <div class="row">
          <div class="form-group half">
            <label>วันที่</label>
            <input type="date" v-model="logDate" class="glass-input">
          </div>
          <div class="form-group half">
            <label>มื้ออาหาร</label>
            <select v-model="mealType" class="glass-input">
              <option value="breakfast" class="dark-option">มื้อเช้า</option>
              <option value="lunch" class="dark-option">มื้อเที่ยง</option>
              <option value="dinner" class="dark-option">มื้อเย็น</option>
              <option value="snack" class="dark-option">ของว่าง</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section glass-inner-card">
        <div class="mode-toggle">
          <button 
            :class="['toggle-btn', { active: inputMode === 'search' }]" 
            @click="inputMode = 'search'"
          >
            🔍 ค้นหาจากฐานข้อมูล
          </button>
          <button 
            :class="['toggle-btn', { active: inputMode === 'custom' }]" 
            @click="inputMode = 'custom'"
          >
            เพิ่มอาหารใหม่เอง
          </button>
        </div>

        <div class="form-group" v-if="inputMode === 'search'">
          <label class="text-accent">ค้นหาและเลือกอาหาร</label>

          <div v-if="!selectedFood" class="search-container">
            <div class="input-with-icon">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="พิมพ์ชื่ออาหารเพื่อค้นหา..." 
                class="glass-input search-input"
              >
            </div>
            
            <ul class="search-results glass-list" v-if="searchQuery.trim() !== ''">
              <li v-if="filteredFoods.length === 0" class="no-result">
                ไม่พบอาหารที่ค้นหา ลองเพิ่มเองดูสิ!
              </li>
              <li 
                v-for="food in filteredFoods" 
                :key="food.id" 
                @click="selectFood(food)"
                class="glass-list-item"
              >
                <span class="food-name">{{ food.name }}</span> 
                <span class="cal-badge">{{ food.calories }} kcal</span>
              </li>
            </ul>
          </div>

          <div v-else class="selected-food-box">
            <div class="selected-info">
              <span class="check-icon">✨</span>
              <div>
                <p class="selected-name">{{ selectedFood.name }}</p>
                <p class="selected-cal">{{ selectedFood.calories }} kcal</p>
              </div>
            </div>
            <button @click="clearSelection" class="btn-clear">เปลี่ยน</button>
          </div>
        </div>

        <div class="form-group custom-section" v-if="inputMode === 'custom'">
          <label class="text-accent">สร้างเมนูอาหารใหม่</label>
          
          <div class="custom-form-grid">
            <div class="form-group full-width">
              <input type="text" v-model="customFood.name" placeholder="ชื่ออาหาร *" class="glass-input">
            </div>
            <div class="form-group">
              <input type="number" v-model="customFood.calories" placeholder="แคลอรี่ (kcal) *" class="glass-input">
            </div>
            <div class="form-group">
              <input type="number" v-model="customFood.protein" placeholder="โปรตีน (g)" class="glass-input">
            </div>
            <div class="form-group">
              <input type="number" v-model="customFood.carbs" placeholder="คาร์บ (g)" class="glass-input">
            </div>
            <div class="form-group">
              <input type="number" v-model="customFood.fat" placeholder="ไขมัน (g)" class="glass-input">
            </div>
          </div>
          <p class="helper-text">* จำเป็นต้องกรอก (ถ้าไม่ทราบสารอาหารให้เว้นว่างไว้)</p>
        </div>

        <div class="form-group highlight-box">
          <label>จำนวน (จาน/ชิ้น)</label>
          <div class="quantity-wrapper">
            <input type="number" v-model="quantity" step="0.5" min="0.1" class="glass-input quantity-input">
            <span class="unit-text">หน่วย</span>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button @click="submitFoodLog" class="premium-btn btn-submit">💾 บันทึกข้อมูล</button>
        <button @click="goBack" class="glass-btn btn-cancel">❌ ยกเลิก</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const logDate = ref(new Date().toLocaleDateString('sv-SE')) 
const mealType = ref('breakfast') 
const quantity = ref(1)

// --- ตัวแปรสำหรับโหมดและข้อมูล ---
const inputMode = ref('search') // 'search' หรือ 'custom'

// โหมด Search
const foods = ref([])
const searchQuery = ref('')
const selectedFoodId = ref('')
const selectedFood = ref(null) 

// โหมด Custom
const customFood = ref({
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: ''
})

const fetchFoods = async () => {
  try {
    const response = await fetch('http://localhost:3000/foods')
    if (response.ok) foods.value = await response.json()
  } catch (error) {
    console.error('Error fetching foods:', error)
  }
}

const filteredFoods = computed(() => {
  if (!searchQuery.value.trim()) return [] 
  return foods.value.filter(food => 
    food.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  )
})

const selectFood = (food) => {
  selectedFoodId.value = food.id
  selectedFood.value = food
  searchQuery.value = '' 
}

const clearSelection = () => {
  selectedFoodId.value = ''
  selectedFood.value = null
}

// 🎯 ฟังก์ชันหลักตอนกดบันทึก
const submitFoodLog = async () => {
  const userId = localStorage.getItem('userId')

  if (!userId) {
    alert('ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่อีกครั้งครับ')
    router.push('/login')
    return
  }

  let finalFoodId = selectedFoodId.value;

  // ถ้าผู้ใช้เลือกโหมด "เพิ่มอาหารเอง" ให้สร้างอาหารลง DB ก่อน
  if (inputMode.value === 'custom') {
    if (!customFood.value.name || !customFood.value.calories) {
      alert('⚠️ กรุณากรอก "ชื่ออาหาร" และ "แคลอรี่" ให้ครบถ้วนครับ');
      return;
    }

    try {
      const createRes = await fetch('http://localhost:3000/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customFood.value)
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        alert(`❌ สร้างอาหารใหม่ไม่สำเร็จ: ${createData.error}`);
        return;
      }
      
      // เอา ID อาหารที่เพิ่งสร้างใหม่มาใช้
      finalFoodId = createData.food.id; 
    } catch (error) {
      console.error('Error creating custom food:', error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ตอนสร้างอาหาร)');
      return;
    }
  } else {
    // โหมด Search ปกติ
    if (!finalFoodId) {
      alert('⚠️ กรุณาค้นหาและเลือกอาหารก่อนครับ!');
      return;
    }
  }

  // เตรียมข้อมูลเพื่อบันทึกลง Daily Log
  const payload = {
    user_id: userId,
    food_id: finalFoodId, 
    quantity: quantity.value,
    meal_type: mealType.value,
    log_date: logDate.value
  }

  // ส่งข้อมูลไปเซิร์ฟเวอร์
  try {
    const response = await fetch('http://localhost:3000/food-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json() 

    if (response.ok) {
      alert('✅ บันทึกมื้ออาหารเรียบร้อย! ')
      router.push('/dashboard')
    } else {
      alert(`❌ บันทึกไม่สำเร็จ: ${data.error}`) 
    }
  } catch (error) {
    console.error('Error:', error)
    alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
  }
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(() => {
  fetchFoods()
})
</script>

<style scoped>
/* สไตล์โครงสร้างหลัก (เหมือนเดิม) */
.add-food-wrapper { min-height: 100vh; position: relative; font-family: 'Prompt', sans-serif; color: #f8fafc; display: flex; justify-content: center; align-items: center; padding: 40px 20px; box-sizing: border-box; overflow-x: hidden; }
.video-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; opacity: 0.6; }
.overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.447); z-index: 1; }
.add-food-container { position: relative; z-index: 2; width: 100%; max-width: 550px; text-align: center; }
.glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 24px; padding: 40px 35px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05); }
.premium-title { margin-top: 0; color: #ffffff; font-weight: 400; font-size: 2em; margin-bottom: 5px; }
.subtitle { color: #cbd5e1; margin-bottom: 30px; font-weight: 300; }
.glass-inner-card { background: transparent; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 0 0 20px 0; margin-bottom: 20px; text-align: left; }
.form-group { margin-bottom: 18px; text-align: left; }
.row { display: flex; gap: 15px; }
.half { flex: 1; }
label { display: block; font-weight: 300; margin-bottom: 8px; color: #e2e8f0; font-size: 0.9em; }
.text-accent { color: #d4af37; font-weight: 400; }
.glass-input { width: 100%; padding: 12px 15px; box-sizing: border-box; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 12px; font-size: 1em; font-family: 'Prompt', sans-serif; font-weight: 300; outline: none; transition: all 0.3s ease; color-scheme: dark; }
.glass-input:focus { border-color: #d4af37; background: rgba(255, 255, 255, 0.12); box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
.glass-input::placeholder { color: #94a3b8; }
.dark-option { background-color: #1e293b; color: #fff; }

/* ระบบ Toggle */
.mode-toggle { display: flex; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 5px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1); }
.toggle-btn { flex: 1; padding: 10px; border: none; background: transparent; color: #94a3b8; font-family: 'Prompt', sans-serif; font-size: 0.95em; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
.toggle-btn.active { background: rgba(255,255,255,0.15); color: #fff; font-weight: 500; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }

/* กล่องค้นหา */
.search-container { position: relative; }
.input-with-icon { position: relative; }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); font-size: 1.2em; opacity: 0.7; }
.search-input { padding-left: 45px; }
.glass-list { list-style: none; padding: 0; margin: 10px 0 0 0; max-height: 200px; overflow-y: auto; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; position: absolute; width: 100%; z-index: 10; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
.glass-list::-webkit-scrollbar { width: 6px; }
.glass-list::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.glass-list::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.5); border-radius: 10px; }
.glass-list-item { padding: 12px 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
.glass-list-item:hover { background: rgba(212, 175, 55, 0.15); padding-left: 20px; }
.glass-list-item:last-child { border-bottom: none; }
.no-result { text-align: center; color: #94a3b8; padding: 15px; cursor: default !important; }
.food-name { color: #f8fafc; font-weight: 400; }
.cal-badge { background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #f3e5ab; padding: 4px 10px; border-radius: 20px; font-size: 0.85em; }

/* อาหารที่เลือก */
.selected-food-box { background: rgba(46, 125, 50, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: inset 0 0 15px rgba(76, 175, 80, 0.05); }
.selected-info { display: flex; align-items: center; gap: 15px; }
.check-icon { font-size: 1.5em; }
.selected-name { margin: 0; font-weight: 500; color: #81c784; font-size: 1.1em; }
.selected-cal { margin: 0; font-size: 0.9em; color: #cbd5e1; font-weight: 300; }
.btn-clear { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; font-family: 'Prompt'; font-size: 0.85em; }
.btn-clear:hover { background: rgba(255, 255, 255, 0.2); color: #ffb74d; }

/* 🌟 โหมดเพิ่มอาหารเอง (Custom Section) */
.custom-section { animation: fadeIn 0.4s ease; background: rgba(0,0,0,0.1); padding: 15px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.2); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.full-width { grid-column: 1 / -1; }
.helper-text { font-size: 0.8em; color: #94a3b8; margin-top: 5px; text-align: right; }

/* อื่นๆ */
.highlight-box { margin-top: 25px; }
.quantity-wrapper { position: relative; display: flex; align-items: center; }
.quantity-input { padding-right: 60px; font-size: 1.1em; }
.unit-text { position: absolute; right: 15px; color: #94a3b8; font-weight: 300; }
.button-group { display: flex; gap: 15px; margin-top: 30px; }
.premium-btn { flex: 2; padding: 14px; background: linear-gradient(135deg, #d4af37, #b58d22); color: #fff; border: none; border-radius: 12px; font-size: 1.1em; font-weight: 500; cursor: pointer; transition: all 0.4s ease; font-family: 'Prompt', sans-serif; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }
.premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5); background: linear-gradient(135deg, #e6c55d, #c59b27); }
.glass-btn { flex: 1; padding: 14px; background: rgba(255, 59, 48, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 59, 48, 0.3); border-radius: 12px; font-size: 1.1em; cursor: pointer; transition: all 0.3s ease; font-family: 'Prompt', sans-serif; }
.glass-btn:hover { background: rgba(255, 59, 48, 0.2); color: #ff4d4d; }

@media (max-width: 600px) { .row { flex-direction: column; gap: 0; } .glass-card { padding: 30px 20px; } .button-group { flex-direction: column; } .custom-form-grid { grid-template-columns: 1fr; } }
</style>