<template>
    <div class="custom-number" :style="wrapperStyle">
        <div class="elevation-num-input-btn" :class="{ disabled }" @click="decrease">
            <img src="@/assets/pngs/pipetoolbar/num_input_decrease.png" style="width: 24px; height: 24px" />

        </div>

        <el-input :model-value="displayValue" @update:model-value="onInputUpdate" :style="inputStyle"
            :disabled="disabled" />

        <div class="elevation-num-input-btn" :class="{ disabled }" @click="increase">
            <img src="@/assets/pngs/pipetoolbar/num_input_increase.png" style="width: 24px; height: 24px" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type MaybeNumber = number | string | null | undefined;

const props = withDefaults(
    defineProps<{
        modelValue: number;
        step?: number; // 步长，默认 0.5
        min?: number;
        max?: number;
        precision?: number; // 小数位数（可选；不传则根据 step 自动推断）
        width?: string; // el-input 宽度
        height?: string; // el-input 高度
        gap?: string; // 按钮与输入框间距
        disabled?: boolean;
    }>(),
    {
        step: 0.5,
        width: "100px",
        height: "24px",
        gap: "10px",
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", v: number): void;
    (e: "change", v: number): void;
}>();

function inferPrecision(step: number): number {
    const s = String(step);
    if (!s.includes(".")) return 0;
    return s.split(".")[1]?.length ?? 0;
}

const usedPrecision = computed(() =>
    typeof props.precision === "number" ? props.precision : inferPrecision(props.step)
);

function clamp(n: number) {
    let v = n;
    if (typeof props.min === "number") v = Math.max(props.min, v);
    if (typeof props.max === "number") v = Math.min(props.max, v);
    return v;
}

function addWithStep(base: number, delta: number) {
    const p = usedPrecision.value;
    const scale = Math.pow(10, p);
    return (Math.round(base * scale) + Math.round(delta * scale)) / scale;
}

function toFixedNumber(n: number) {
    const p = usedPrecision.value;
    return Number(n.toFixed(p));
}

const displayValue = computed(() => props.modelValue);

function commit(v: number) {
    const fixed = toFixedNumber(clamp(v));
    emit("update:modelValue", fixed);
    emit("change", fixed);
}

function increase() {
    if (props.disabled) return;
    commit(addWithStep(props.modelValue, props.step));
}

function decrease() {
    if (props.disabled) return;
    commit(addWithStep(props.modelValue, -props.step));
}

function onInputUpdate(val: MaybeNumber) {
    const num = typeof val === "number" ? val : Number(val);
    if (Number.isNaN(num)) return;
    commit(num);
}

const inputStyle = computed(() => ({
    width: props.width,
    height: props.height,
}));

const wrapperStyle = computed(() => ({
    gap: props.gap,
}));
</script>

<style scoped>
.custom-number {
    display: flex;
    align-items: stretch;
    max-width: 152px;
}

.elevation-num-input-btn:hover {
    transform: scale(1.1);
    cursor: pointer;
    filter: brightness(1.2);
    transition: all 0.2s ease-in-out;
}

.elevation-num-input-btn:active {
    transform: scale(0.95);
    filter: brightness(0.8);
    transition: all 0.1s ease-in-out;
}

.elevation-num-input-btn.disabled {
    opacity: 0.5;
    pointer-events: none;
}

:deep(.el-input__wrapper) {
    background-color: rgba(28, 49, 77, 0.6) !important;
    border-top: 1px solid #1ebdd0 !important;
    border-bottom: 1px solid #1ebdd0 !important;
    border-left: none !important;
    border-right: none !important;
    border-radius: 6px !important;
    box-shadow: #b5bbda 0 0 3px !important;
    text-align: center !important;
}

:deep(.el-input__inner) {
    text-align: center !important;
    font-size: 13px !important;
    color: #ffffff !important;
}
</style>
