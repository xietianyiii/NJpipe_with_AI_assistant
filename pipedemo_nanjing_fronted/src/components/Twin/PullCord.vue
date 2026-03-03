<template>
    <div class="pull-cord-container" :class="{ hidden: !visible }">
        <!-- 拉绳主体 -->
        <div class="cord-wrapper" @click="toggle">
            <!-- 细线 -->
            <div class="cord-line">
                <div class="cord-line-inner"></div>
            </div>

            <!-- 拉环 -->
            <div class="cord-ring" :class="{ pulled: !visible }">
                <!-- 外圆 -->
                <div class="ring-outer">
                    <!-- 内圆 -->
                    <div class="ring-inner">
                        <!-- 箭头图标 -->
                        <svg class="ring-arrow" :class="{ flipped: !visible }" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                <!-- 光晕 -->
                <div class="ring-glow"></div>
            </div>

            <!-- Tooltip -->
            <div class="cord-tooltip">
                {{ visible ? '收起面板' : '展开面板' }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'toggle', value: boolean): void
}>()

const visible = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
        emit('toggle', val)
    }
})

const toggle = () => {
    visible.value = !visible.value
}
</script>

<style scoped>
/* ===== 容器 ===== */
.pull-cord-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
}

/* ===== 拉绳整体可点击区域 ===== */
.cord-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    position: relative;
}

.cord-wrapper:hover .cord-tooltip {
    opacity: 1;
    transform: translateY(4px);
}

/* ===== 细线 ===== */
.cord-line {
    width: 2px;
    height: 24px;
    background: linear-gradient(to bottom,
            transparent,
            rgba(100, 200, 255, 0.3));
    position: relative;
    overflow: hidden;
}

.cord-line-inner {
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
            transparent,
            rgba(100, 200, 255, 0.9),
            transparent);
    animation: cord-flow 2s ease-in-out infinite;
}

@keyframes cord-flow {
    0% {
        top: -100%;
    }

    100% {
        top: 100%;
    }
}

/* ===== 拉环 ===== */
.cord-ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: cord-sway 4s ease-in-out infinite;
    transform-origin: top center;
}

/* 悬挂晃动动画 */
@keyframes cord-sway {

    0%,
    100% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(1.5deg);
    }

    40% {
        transform: rotate(-1deg);
    }

    60% {
        transform: rotate(0.8deg);
    }

    80% {
        transform: rotate(-0.5deg);
    }
}

/* 点击后状态 */
.cord-ring.pulled {
    animation: cord-sway-pulled 3s ease-in-out infinite;
}

@keyframes cord-sway-pulled {

    0%,
    100% {
        transform: rotate(0deg) translateY(0px);
    }

    25% {
        transform: rotate(2deg) translateY(1px);
    }

    75% {
        transform: rotate(-2deg) translateY(1px);
    }
}

/* ===== 外圆 ===== */
.ring-outer {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(100, 200, 255, 0.5);
    background: rgba(10, 30, 60, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: border-color 0.3s ease, background 0.3s ease;
    box-shadow:
        0 0 12px rgba(0, 150, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.cord-wrapper:hover .ring-outer {
    border-color: rgba(100, 200, 255, 0.9);
    background: rgba(0, 60, 120, 0.8);
    box-shadow:
        0 0 20px rgba(0, 150, 255, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.cord-ring.pulled .ring-outer {
    border-color: rgba(80, 220, 160, 0.6);
    box-shadow:
        0 0 16px rgba(80, 220, 160, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* ===== 内圆 ===== */
.ring-inner {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(100, 200, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 40% 35%,
            rgba(100, 200, 255, 0.15),
            transparent 60%);
}

/* ===== 箭头 ===== */
.ring-arrow {
    width: 14px;
    height: 14px;
    color: rgba(100, 200, 255, 0.9);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
}

.ring-arrow.flipped {
    transform: rotate(180deg);
    color: rgba(80, 220, 160, 0.9);
}

.cord-wrapper:hover .ring-arrow {
    color: #64c8ff;
}

/* ===== 光晕 ===== */
.ring-glow {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: radial-gradient(circle,
            rgba(0, 150, 255, 0.2) 0%,
            transparent 70%);
    animation: glow-pulse 2.5s ease-in-out infinite;
    pointer-events: none;
}

@keyframes glow-pulse {

    0%,
    100% {
        opacity: 0.5;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.3);
    }
}

.cord-ring.pulled .ring-glow {
    background: radial-gradient(circle,
            rgba(80, 220, 160, 0.2) 0%,
            transparent 70%);
}

/* ===== Tooltip ===== */
.cord-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: rgba(10, 30, 60, 0.9);
    border: 1px solid rgba(100, 200, 255, 0.3);
    color: rgba(100, 200, 255, 0.9);
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    backdrop-filter: blur(4px);
}
</style>