<template>
  <div v-show="visible" class="draggable-card" :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown="startDrag" ref="cardRef">
    <div class="card-header">
      <span class="card-header-text">湖泊监测 </span>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="card-body">
      <div class="river-level-row">
        <label class="river-level-label">当前湖泊水位值：</label>
        <span class="river-level-value">{{ displayedRiverLevel }}</span>
      </div>

      <!-- 第二行：修改湖泊水位 -->
      <div class="river-level-modify-row">
        <label class="river-level-modify-label">修改湖泊水位：</label>
        <BaseNumberInput v-model="riverLevel" :min="5" :max="12" :step="1" width="80px" class="river-level-input" />

      </div>

      <!-- 第三行：操作按钮 -->
      <div class="button-row">
        <el-button type="primary" size="small" @click="updateRiverLevel" class="action-button">
          <svg t="1760585811887" class="icon dispatch-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="95794" width="30" height="30">
            <path
              d="M724.3 553.9L583.2 681c-23.3 23.3-61.5 23.3-84.9 0V343c23.3-23.3 61.5-23.3 84.9 0l141.1 126.1c23.3 23.3 23.3 61.5 0 84.8z"
              fill="#ffffff" p-id="95795"></path>
            <path
              d="M508.3 553.9L367.2 681c-23.3 23.3-61.5 23.3-84.9 0V343c23.3-23.3 61.5-23.3 84.9 0l141.1 126.1c23.3 23.3 23.3 61.5 0 84.8z"
              fill="#ffffff" p-id="95796"></path>
          </svg>
        </el-button>
        <el-button type="warning" size="small" @click="resetRiverLevel" class="action-button">
          <svg t="1763461177116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="27116" width="15" height="15">
            <path
              d="M944.5 376.6c3.6-8.7 5.7-18.1 6.1-27.9 0-1.1 0-2.1 0.1-3.2v-1l-1.7-184c-0.4-45.3-37.3-81.8-82.5-81.8h-0.8c-41 0.4-74.7 30.5-80.8 69.8-9.8-7.1-19.9-13.8-30.3-20.1-102.5-62.1-223.1-80.6-339.5-52C298.8 104.8 200.5 177 138.4 279.5S57.8 502.6 86.4 619s100.7 214.7 203.2 276.8c71 43 150.7 65.1 231.7 65.1 35.9 0 72-4.3 107.8-13.1C745.5 919.2 843.8 847 905.9 744.5c23.6-39 11.2-89.8-27.8-113.4-39-23.6-89.8-11.2-113.4 27.8-81 133.7-255.7 176.6-389.5 95.6-64.8-39.2-110.4-101.4-128.5-174.9-18.1-73.6-6.4-149.7 32.9-214.5 80.1-132.1 251.6-175.6 384.7-98.4-36.3 9-63.1 41.9-62.7 80.9 0.4 45.3 37.3 81.8 82.5 81.8h0.8l184-1.7c31.3-0.3 58.5-18 72.2-43.9 1.2-2.2 2.2-4.5 3.2-6.8 0.1-0.1 0.2-0.3 0.2-0.4z"
              fill="#ffffff" p-id="27117"></path>
          </svg>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onBeforeUnmount
} from "vue";

import BaseNumberInput from "@/components/ReuseCop/BaseNumInput.vue";

const displayedRiverLevel = ref(5.0); // 显示的水位值，默认为0+1=1
const riverLevel = ref(5.0); // 输入框的值

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(["close", "river-level-updated"]);

const position = ref({ x: 1200, y: 470 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const cardRef = ref<HTMLElement | null>(null);
const velocity = ref({ x: 0, y: 0 }); // 用于跟踪拖动速度
const lastPosition = ref({ x: 0, y: 0 }); // 用于计算速度
const lastTime = ref(0); // 用于计算时间差

// 允许自定义边界
const BOUND = {
  minX: 50,
  maxX: 1600,
  minY: 100,
  maxY: 700,
};

const startDrag = (e: MouseEvent) => {
  if (!cardRef.value) return;
  isDragging.value = true;

  offset.value.x = e.clientX - position.value.x;
  offset.value.y = e.clientY - position.value.y;

  // 重置速度
  velocity.value.x = 0;
  velocity.value.y = 0;
  lastPosition.value.x = position.value.x;
  lastPosition.value.y = position.value.y;
  lastTime.value = Date.now();

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  let newX = e.clientX - offset.value.x;
  let newY = e.clientY - offset.value.y;

  // 使用手动边界配置
  newX = Math.max(BOUND.minX, Math.min(newX, BOUND.maxX));
  newY = Math.max(BOUND.minY, Math.min(newY, BOUND.maxY));

  // 计算时间差
  const now = Date.now();
  const deltaTime = now - lastTime.value;

  if (deltaTime > 0) {
    // 计算速度 (像素/毫秒)
    velocity.value.x = (newX - lastPosition.value.x) / deltaTime;
    velocity.value.y = (newY - lastPosition.value.y) / deltaTime;
  }

  // 更新位置和时间
  position.value = { x: newX, y: newY };
  lastPosition.value.x = newX;
  lastPosition.value.y = newY;
  lastTime.value = now;
};

// 惯性动画函数
const inertiaAnimation = () => {
  // 初始速度
  let vx = velocity.value.x * 1000; // 转换为像素/秒
  let vy = velocity.value.y * 1000;

  // 物理参数
  const friction = 0.92; // 摩擦系数 (更真实的摩擦力)
  const minVelocity = 0.5; // 最小速度阈值
  const deceleration = 0.98; // 减速度

  // 上一帧时间
  let lastTimestamp = 0;

  // 动画函数
  const animate = (timestamp: number) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.1); // 转换为秒，最大0.1秒
    lastTimestamp = timestamp;

    // 应用减速度和摩擦力
    vx *= deceleration * friction;
    vy *= deceleration * friction;

    // 计算新位置
    let newX = position.value.x + vx * deltaTime;
    let newY = position.value.y + vy * deltaTime;

    // 使用手动边界配置
    newX = Math.max(BOUND.minX, Math.min(newX, BOUND.maxX));
    newY = Math.max(BOUND.minY, Math.min(newY, BOUND.maxY));

    // 如果碰到边界，反转速度方向以产生反弹效果
    if (newX <= BOUND.minX || newX >= BOUND.maxX) {
      vx = -vx * 0.3; // 反弹并减少速度
    }
    if (newY <= BOUND.minY || newY >= BOUND.maxY) {
      vy = -vy * 0.3; // 反弹并减少速度
    }

    // 更新位置
    position.value.x = newX;
    position.value.y = newY;

    // 如果速度足够大，继续动画
    if (Math.abs(vx) > minVelocity || Math.abs(vy) > minVelocity) {
      requestAnimationFrame(animate);
    }
  };

  // 开始动画
  if (Math.abs(vx) > minVelocity || Math.abs(vy) > minVelocity) {
    requestAnimationFrame(animate);
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);

  // 启动惯性动画
  inertiaAnimation();
};

// 当卡片每次被打开时，重置位置
watch(
  () => props.visible,
  (n) => {
    if (n) {
      position.value = { x: 1200, y: 470 };
    }
  }
);


// 河道监测执行方法
const updateRiverLevel = () => {
  // 更新显示的水位值
  const v = Number(riverLevel.value) || 0;
  displayedRiverLevel.value = v;
  console.log("执行河道监测，当前水位值:", displayedRiverLevel.value);
  // 触发一个事件通知父组件水位已更新
  emit("river-level-updated", riverLevel.value);
};

// 河道监测重置方法
const resetRiverLevel = () => {
  console.log("重置河道监测");
  riverLevel.value = 5.0;
  displayedRiverLevel.value = 5.0;
  emit("river-level-updated", riverLevel.value);
};

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});

</script>

<style scoped>
.draggable-card {
  position: absolute;
  width: 300px;
  background: rgba(23, 50, 88, 0.6);
  border: 1px solid rgba(214, 245, 255, 0.2);
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
  padding: 16px 20px;
  font-size: 14px;
  z-index: 999;
  backdrop-filter: blur(6px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  pointer-events: auto;
  user-select: none;
  cursor: grab;
  animation: popupAppear 0.3s ease-out;
}

.draggable-card:hover {
  box-shadow: 0 5px 20px rgba(0, 191, 255, 1);
}

.draggable-card:active {
  cursor: grabbing;
}

@keyframes popupAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  color: #ffffff;
  /* text-shadow: 0 0 5px rgba(25, 223, 18, 0.7); */
  font-family: "ALMMAVF";
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(248, 248, 248, 0.5);
  margin-bottom: 15px;
}

.card-header-text {
  letter-spacing: 1px;
  word-spacing: 4px;
  font-size: 16px;
}

.close-btn {
  background: radial-gradient(circle at 30% 30%,
      rgba(5, 50, 66, 0.5),
      rgba(0, 212, 255, 0.5));
  border: 1px solid rgba(248, 248, 248, 0.8);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
}

.close-btn:hover {
  background: radial-gradient(circle at 0% 60%,
      #1a918b 0%,
      #0099c8 60%,
      #00e5ff 100%);
  box-shadow: 0 0 10px rgba(0, 255, 255, 1);
  transform: scale(1.1);
}

.card-body {
  font-family: "ALMMAVF";
  font-weight: 600;
  color: #ffffff;
  animation: contentFadeIn 0.3s ease-out 0.2s both;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.river-level-modify-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-button {
  flex: 1;
  font-family: "SHJGSK";
  background-color: rgba(36, 74, 85, 0.7);
  border: 1px solid rgba(170, 151, 151, 0.8);
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
  transition: all 0.3s ease;
}

.action-button:hover {
  background: radial-gradient(circle at 0% 60%,
      #1a918b 0%,
      #0099c8 60%,
      #00e5ff 100%);
  box-shadow: 0 0 10px rgba(0, 255, 255, 1);
}

.button-row {
  display: flex;
  gap: 10px;
}
</style>