<template>
  <div
    class="card test-card"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
    @mousedown="startDrag"
    ref="cardRef"
  >
    <div class="test-card-content">
      <div class="test-card-item">
        <div class="test-card-label">测试指标</div>
        <div class="test-card-value">123</div>
      </div>
      <div class="test-card-item">
        <div class="test-card-label">状态</div>
        <div class="test-card-status active">正常运行</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const pos = ref({ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 })
const isDragging = ref(false)
const offset = ref({ x: 0, y: 0 })
const cardRef = ref<HTMLElement | null>(null)

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  offset.value.x = e.clientX - pos.value.x
  offset.value.y = e.clientY - pos.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  pos.value.x = e.clientX - offset.value.x
  pos.value.y = e.clientY - offset.value.y
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 可选：初始化居中显示
onMounted(() => {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect()
    pos.value = {
      x: window.innerWidth / 2 - rect.width / 2,
      y: window.innerHeight / 2 - rect.height / 2,
    }
  }
})
</script>

<style scoped>
.test-card {
  width: 300px;
  flex: none;
  position: absolute;
  cursor: grab;
  transition: box-shadow 0.2s ease;
}

.test-card:active {
  cursor: grabbing;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.test-card-content {
  flex: 1;
  padding: 12px;
  font-size: 14px;
  color: #000;
  background-color: rgba(79, 99, 113, 0.9);
  border-radius: 8px;
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  user-select: none;
  gap: 10px;
}

/* 其他样式保持不变 */

.test-card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.test-card-label {
  font-size: 14px;
  color: #e0e0e0;
}

.test-card-value {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: #566fff 0 0 8px;
}

.test-card-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.test-card-status.active {
  background-color: rgba(46, 204, 113, 0.3);
  color: #2ecc71;
}

.test-card-chart-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 5px;
}

.chart-placeholder-text {
  color: #aaa;
  font-size: 14px;
}
</style>
