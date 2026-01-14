<template>
  <div v-show="visible" class="draggable-card" :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown="startDrag" ref="cardRef">
    <div class="card-header">
      <span class="card-header-text">缺陷信息 </span>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="card-body">
      <div class="mapping-header">
        <span class="header-item">字段</span>
        <span class="header-item">属性</span>
      </div>
      <div class="mapping-row">
        <span class="field-item">管网代码</span><span class="value-item">{{ detailData.id }}</span>
      </div>
      <div class="mapping-row">
        <span class="field-item">材质</span><span class="value-item">{{ detailData.material }}</span>

      </div>
      <div class="mapping-row">
        <span class="field-item">管径</span><span class="value-item">{{ detailData.diameter }} mm</span>
      </div>
      <div class="mapping-row">
        <span class="field-item">长度</span><span class="value-item">{{ detailData.length }} m</span>
      </div>
      <div class="mapping-row">
        <span class="field-item">位置</span>
        <span class="value-item">{{ detailData.location }}</span>
      </div>

      <div class="mapping-row">
        <span class="field-item">缺陷类型</span>
        <span class="value-item">{{ detailData.defect }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
} from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  visible: boolean
  detailData: {
    id: string
    material: string
    diameter: string
    length: string
    location: string
    defect: string
  }
}>()

const emit = defineEmits(["close"]);

const position = ref({ x: 1500, y: 180 });
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
  maxY: 370,
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
      position.value = { x: 1500, y: 300 };
    }
  }
);

// 监听值变化并触发动画
let animationTimeouts: number[] = [];

onBeforeUnmount(() => {
  // 清除所有待执行的定时器
  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
});

// 当任何值发生变化时，为对应的元素添加动画类
const triggerValueChangeAnimation = (selector: string) => {
  nextTick(() => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const element = el as HTMLElement;
      // 先移除可能存在的动画类，确保动画能重新触发
      element.classList.remove("value-change-animation");

      // 强制重排，确保移除类后能重新触发动画
      element.offsetHeight;

      // 添加动画类
      element.classList.add("value-change-animation");

      // 设置定时器在动画结束后移除类
      const timeout = setTimeout(() => {
        el.classList.remove("value-change-animation");
        // 从 timeouts 数组中移除已执行的定时器
        const index = animationTimeouts.indexOf(timeout);
        if (index > -1) {
          animationTimeouts.splice(index, 1);
        }
      }, 500); // 动画持续时间应与 CSS 中定义的相同

      // 将定时器添加到数组中
      animationTimeouts.push(timeout);
    });
  });
};

watch(
  () => props.detailData,
  () => {
    triggerValueChangeAnimation(".value-item")
  },
  { deep: true }
)
</script>

<style scoped>
.draggable-card {
  position: absolute;
  width: 260px;
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

.mapping-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  opacity: 1;
  border-radius: 8px;
  background: linear-gradient(180deg,
      rgba(36, 104, 190, 0.06) 0%,
      rgba(0, 144, 211, 0.6) 105%);
  box-sizing: border-box;
  border: 0.81px solid rgba(65, 129, 225, 0.3);
  margin-bottom: 3px;
}

.header-item {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: lighter;
}

.mapping-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(214, 245, 255, 0.2);
  max-height: 16px;
  font-size: 12px;
  border-radius: 5.04px;
}

.mapping-row:nth-child(odd) {
  background: rgba(79, 111, 120, 0.2);
}

.field-item,
.value-item {
  flex: 1;
  text-align: center;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 为值变化添加特殊的动画效果 */
.value-item.value-change-animation {
  animation: valueChange 0.5s ease-in-out;
}

@keyframes valueChange {
  0% {
    opacity: 0.5;
    transform: translateY(-5px) scale(0.95);
  }

  50% {
    opacity: 1;
    transform: translateY(2px) scale(1.05);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>