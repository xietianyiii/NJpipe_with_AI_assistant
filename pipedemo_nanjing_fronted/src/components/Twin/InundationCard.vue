<template>
  <div v-show="visible" class="draggable-card" :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown="startDrag" ref="cardRef">
    <div class="card-header">
      <span class="card-header-text">淹没卡片 </span>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="card-body">
      <div class="river-level-row">
        <label class="river-level-label">模拟类型：</label>
        <BaseSelect v-model="MoniType" :options="MoniTypeOptions" placeholder="请选择模拟类型" />
      </div>

      <!-- 第二行：修改湖泊水位 -->
      <div class="river-level-row">
        <label class="river-level-modify-label">模拟方案：</label>
        <BaseSelect v-model="MoniScheme" :options="MoniSchemeOptions" placeholder="请选择模拟方案" />
      </div>

      <!-- 第三行：操作按钮 -->
      <div class="button-row">
        <el-button type="primary" size="small" @click="inundationExecute" class="action-button">
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
        <el-button type="warning" size="small" @click="inundationReset" class="action-button">
          <svg t="1763461177116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="27116" width="15" height="15">
            <path
              d="M944.5 376.6c3.6-8.7 5.7-18.1 6.1-27.9 0-1.1 0-2.1 0.1-3.2v-1l-1.7-184c-0.4-45.3-37.3-81.8-82.5-81.8h-0.8c-41 0.4-74.7 30.5-80.8 69.8-9.8-7.1-19.9-13.8-30.3-20.1-102.5-62.1-223.1-80.6-339.5-52C298.8 104.8 200.5 177 138.4 279.5S57.8 502.6 86.4 619s100.7 214.7 203.2 276.8c71 43 150.7 65.1 231.7 65.1 35.9 0 72-4.3 107.8-13.1C745.5 919.2 843.8 847 905.9 744.5c23.6-39 11.2-89.8-27.8-113.4-39-23.6-89.8-11.2-113.4 27.8-81 133.7-255.7 176.6-389.5 95.6-64.8-39.2-110.4-101.4-128.5-174.9-18.1-73.6-6.4-149.7 32.9-214.5 80.1-132.1 251.6-175.6 384.7-98.4-36.3 9-63.1 41.9-62.7 80.9 0.4 45.3 37.3 81.8 82.5 81.8h0.8l184-1.7c31.3-0.3 58.5-18 72.2-43.9 1.2-2.2 2.2-4.5 3.2-6.8 0.1-0.1 0.2-0.3 0.2-0.4z"
              fill="#ffffff" p-id="27117"></path>
          </svg>
        </el-button>

        <div class="material-button" :class="{ disabled: !isInundationMode }">
          <button class="material-btn button1" :class="{ active: activeMaterial === 'water' }"
            @click="selectMaterial('water')"> 水体</button>

          <button class="material-btn button2" :class="{ active: activeMaterial === 'heatmap' }"
            @click="selectMaterial('heatmap')"> 热力</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onBeforeUnmount,
  computed
} from "vue";

import BaseSelect from "@/components/ReuseCop/BaseSelect-long.vue";

type SchemeOption = {
  label: string
  value: string
}

type MoniConfig = {
  schemes: SchemeOption[]
}
const isInundationMode = computed(() => MoniType.value === '内涝模拟')

const MONI_CONFIG_MAP: Record<string, MoniConfig> = {
  内涝模拟: {
    schemes: [
      { label: "大范围", value: "area" },
      { label: "积水点", value: "point" },
    ],
  },

  管道模拟: {
    schemes: [
      { label: "默认", value: "default" },
    ],
  },
}

const MoniType = ref("内涝模拟");
const MoniScheme = ref("");

const MoniTypeOptions = [
  { label: "内涝模拟", value: "内涝模拟" },
  { label: "管道模拟", value: "管道模拟" },
];

const MoniSchemeOptions = computed(() => {
  return MONI_CONFIG_MAP[MoniType.value]?.schemes ?? []
})

watch(MoniType, () => {
  MoniScheme.value = ""
})

// 'water' | 'heatmap' 
type MaterialType = 'water' | 'heatmap'

// 默认激活 water（你可以改）
const activeMaterial = ref<MaterialType>('water')

function selectMaterial(type: MaterialType) {
  activeMaterial.value = type
}

const props = defineProps<{
  visible: boolean
}>()

type InundationExecutePayload = {
  moniType: string
  moniScheme: string
  material: MaterialType
}

const emit = defineEmits<{
  (e: "close"): void
  (e: "inundation-execute", payload: InundationExecutePayload): void
  (e: "inundation-reset"): void
}>()


const inundationExecute = () => {
  emit("inundation-execute", {
    moniType: MoniType.value,
    moniScheme: MoniScheme.value,
    material: activeMaterial.value
  })
};

// 河道监测重置方法
const inundationReset = () => {
  console.log("重置淹没");
  emit("inundation-reset"), {moniType: MoniType.value,};
};

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

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});

</script>

<style scoped>
.draggable-card {
  position: absolute;
  width: 290px;
  background: url('@/assets/pngs/BG/InuCard/bg.png') no-repeat center/ 100% 100%;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 14px;
  z-index: 999;
  backdrop-filter: blur(3px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  pointer-events: auto;
  user-select: none;
  cursor: grab;
  animation: popupAppear 0.3s ease-out;
}

.draggable-card:hover {
  box-shadow: 0 1px 1px rgba(0, 191, 255, 0.5);
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
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.6);
}

.button-row {
  display: flex;
  gap: 10px;
}

.river-level-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

:deep(.base-select) {
  width: 150px;
}

:deep(.base-select .dropdown) {
  bottom: auto !important;
  top: calc(100% + 6px);
}

.material-button {
  width: 100px;
  height: 24px;
  background: url('@/assets/pngs/BG/InuCard/btn-bg.png') no-repeat center/ 100% 100%;
  box-sizing: border-box;
  display: flex;
}

.material-button.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.material-btn {
  flex: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ffffff;
  font-family: "ALMMAVF";
  font-size: 12px;
}

.material-btn.active {
  background: url('@/assets/pngs/BG/InuCard/btn-hover.png') no-repeat center/ 100% 100%;
  box-sizing: border-box;
}
</style>