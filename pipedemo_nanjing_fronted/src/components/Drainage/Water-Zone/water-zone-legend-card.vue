<template>
  <div class="legend-card">
    <div class="row">
      <div class="legend-color" style="background: #FFE4B5;"></div>
      <span class="legend-text">排水分区1</span>
    </div>
    <div class="row">
      <div class="legend-color" style="background: #87CEFA;"></div>
      <span class="legend-text">排水分区2</span>
    </div>
    <div class="row">
      <div class="legend-color" style="background: #1E90FF;"></div>
      <span class="legend-text">排水分区3</span>
    </div>
    <div class="row">
      <div class="legend-color" style="background: #FF7F50;"></div>
      <span class="legend-text">排水分区4</span>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.legend-card {
  position: absolute;
  bottom: 11.6vh;
  left: 20.5vw;
  background: url("@/assets/pngs/BG/legend/bg.png") no-repeat center/ 100% 100%;
  width: 100px;
  height: 110px;
  backdrop-filter: blur(10px);
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  z-index: 99999;
  font-family: "AlimamaAgileVF", Arial, sans-serif;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  user-select: none;
}

.legend-color{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  opacity: 0.8;
}

.row{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgb(255, 255, 255, 0.8);
  font-size: 13px;
  font-family: "AlimamaAgileVF", Arial, sans-serif;
}

</style>
