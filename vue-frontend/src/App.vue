<template>
  <div>
    <RouterView /> 
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* Reset CSS พื้นฐานสำหรับทั้งเว็บไซต์ให้เต็มจอ 100% */
html, body {
  font-family: 'Prompt', Arial, sans-serif; /* แอบเติมฟอนต์ Prompt ให้เข้ากับธีม */
  margin: 0; /* 🚩 เปลี่ยนจาก 20px เป็น 0 เพื่อลบขอบทิ้ง */
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #0f172a; /* เปลี่ยนสีพื้นหลังตัวแม่ให้เป็นโทนเข้ม เผื่อรูปโหลดยังไม่เสร็จจะได้ไม่แสบตา */
}

/* เผื่อกรณี Vue สร้าง div id="app" ขึ้นมาครอบ */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>