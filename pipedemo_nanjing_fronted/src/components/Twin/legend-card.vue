<template>
  <div class="legend-card">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" class="check-all">
      全选
    </el-checkbox>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="checkbox-group-vertical">
      <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city">
        <span class="checkbox-label">{{ city }}</span>
        <img :src="cityIconMap[city]" class="checkbox-icon" alt="marker" />
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import type { CheckboxValueType } from 'element-plus'

// 定义 props
const props = defineProps<{
  legendType?: 'pump' | 'rain' | 'waterlog' | 'pipe' | null;
}>();

// 定义 emits
const emit = defineEmits<{
  (e: 'selection-change', selected: string[]): void
}>()

// 定义不同类型面板的选项
const pumpOptions = ['雨水泵站', '污水泵站']
const rainOptions = ['>50mm', '<50mm'];
const waterlogOptions = ['0mm', '1-15mm', '16-30mm', '30-50mm'];
const pipeOptions = ['<50%', '50%-100%', '100%', '液位异常', '离线'];

// 不同 city 对应的图标
const cityIconMap: Record<string, string> = {
  // pump
  '雨水泵站': new URL('@/assets/pngs/BG/legend/station/pump.png', import.meta.url).href,
  '污水泵站': new URL('@/assets/pngs/BG/legend/station/pump.png', import.meta.url).href,

  // rain
  '>50mm': new URL('@/assets/pngs/BG/legend/station/rain.png', import.meta.url).href,
  '<50mm': new URL('@/assets/pngs/BG/legend/station/rain.png', import.meta.url).href,

  // waterlog
  '0mm': new URL('@/assets/pngs/BG/legend/station/waterlog.png', import.meta.url).href,
  '1-15mm': new URL('@/assets/pngs/BG/legend/station/waterlog.png', import.meta.url).href,
  '16-30mm': new URL('@/assets/pngs/BG/legend/station/waterlog.png', import.meta.url).href,
  '30-50mm': new URL('@/assets/pngs/BG/legend/station/waterlog.png', import.meta.url).href,

  // pipe
  '<50%': new URL('@/assets/pngs/BG/legend/pipe/low.png', import.meta.url).href,
  '50%-100%': new URL('@/assets/pngs/BG/legend/pipe/middle.png', import.meta.url).href,
  '100%': new URL('@/assets/pngs/BG/legend/pipe/full.png', import.meta.url).href,
  '液位异常': new URL('@/assets/pngs/BG/legend/pipe/error.png', import.meta.url).href,
  '离线': new URL('@/assets/pngs/BG/legend/pipe/offline.png', import.meta.url).href,
}

// 根据面板类型计算当前选项
const cities = computed(() => {
  switch (props.legendType) {
    case 'rain': return rainOptions;
    case 'waterlog': return waterlogOptions;
    case 'pump': return pumpOptions;
    case 'pipe': return pipeOptions;
    default: return [];
  }
});

// 计算初始选中项
const checkAll = ref(true)
const isIndeterminate = ref(false)
const checkedCities = ref<string[]>([]);

watch(
  () => props.legendType,
  (newVal) => {
    checkedCities.value = cities.value;
    checkAll.value = true;
    isIndeterminate.value = false;
    if (newVal) emit("selection-change", checkedCities.value);
  },
  { immediate: true }
);

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCities.value = val ? cities.value : []
  isIndeterminate.value = false
  // Emit 选中状态变化
  emit('selection-change', checkedCities.value)
}

const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
  // Emit 选中状态变化
  emit('selection-change', value as string[])
}
</script>

<style scoped>
.legend-card {
  position: absolute;
  bottom: 10vh;
  right: 20.5vw;
  width: 6.5vw;
  background: url('@/assets/pngs/BG/legend/bg.png') no-repeat center/ 100% 100%;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  z-index: 99999;
  font-family: "AlimamaAgileVF", Arial, sans-serif;
  pointer-events: auto;
}

.checkbox-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.checkbox-group-vertical :deep(.el-checkbox) {
  display: flex;
  align-items: center;
  margin-right: 0;
}

.checkbox-label {
  margin-right: 15px;
  font-family: "SHJGSK", Arial, sans-serif;
}

.checkbox-icon {
  height: 25px;
  vertical-align: middle;
}

:deep(.el-checkbox__label) {
  margin-top: 1px;
  color: #d0d0d0;
  font-family: "SourceHanSansCN", Arial, sans-serif;
  opacity: 0.8;
}

:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: #ffffff;
  font-family: "SourceHanSansCN", Arial, sans-serif;
}

:deep(.el-checkbox__inner) {
  border-color: #d0d0d0;
  background-color: transparent;
  transition: all 0.3s ease-in-out;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #ffffff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #ffffff;
  background-color: transparent;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  border-color: #ffffff;
  background: url('@/assets/pngs/BG/legend/checked.png') no-repeat center/ 100% 100%;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner:before) {
  margin-top: 1px;
}

:deep(.el-checkbox__inner) {
  border: none;
  background: url('@/assets/pngs/BG/legend/check-bg.png') no-repeat center/ 100% 100%;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: url('@/assets/pngs/BG/legend/checked.png') no-repeat center/ 100% 100%;
}
</style>
