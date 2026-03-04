<template>
    <div style="position: fixed; inset: 0; z-index: 999999; pointer-events: none;">
        <Transition name="loading-fade">
            <div v-if="visible" class="loading-overlay">
                <!-- 背景网格装饰 -->
                <div class="bg-grid"></div>
                <!-- 角落装饰线 -->
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>

                <!-- 系统标题 -->
                <div class="system-title">
                    <span class="title-en">SMART PIPELINE PLATFORM</span>
                    <span class="title-zh">51-WIM排水防涝管理平台</span>
                </div>

                <!-- 六边形水波容器 -->
                <div class="hex-wrapper">
                    <!-- 外层旋转光晕环 -->
                    <div class="hex-ring hex-ring-outer"></div>
                    <div class="hex-ring hex-ring-inner"></div>

                    <!-- 六边形描边外壳 -->
                    <div class="hex-border">
                        <div class="wave-container">
                            <div class="wave-change" :style="{ top: waveTop + 'px' }"></div>
                            <div class="wave"></div>
                            <!-- 水面百分比文字 -->
                            <div class="wave-percent">{{ progress }}<span>%</span></div>
                        </div>
                    </div>

                    <!-- 扫描线 -->
                    <div class="scan-line"></div>

                    <!-- 六个角的装饰点 -->
                    <div class="hex-dot" v-for="i in 6" :key="i" :class="`dot-${i}`"></div>
                </div>

                <!-- 底部状态栏 -->
                <div class="status-bar">
                    <div class="status-item" v-for="(item, i) in statusItems" :key="i"
                        :style="{ animationDelay: i * 0.3 + 's' }">
                        <span class="status-dot" :class="{ active: progress >= item.threshold }"></span>
                        <span class="status-label">{{ item.label }}</span>
                    </div>
                </div>

                <!-- 底部加载动效 -->
                <div class="loading-bars">
                    <div v-for="i in 5" :key="i"></div>
                </div>

            </div>
        </Transition>
    </div>


</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const progress = ref(0)
const visible = ref(true)

// waveTop: 容器200px，初始top=200(全遮)，到top=0(全露)
// 从 progress=0 → top=200, progress=100 → top=0
const waveTop = computed(() => {
    return 80 - (progress.value / 100) * 200
})

const statusItems = [
    { label: '核心插件初始化', threshold: 10 },
    { label: '场景初始化', threshold: 30 },
    { label: '场景渲染', threshold: 50 },
    { label: '管网数据加载', threshold: 70 },
    { label: '系统启动完成', threshold: 100 },
]

// 进度时间线
watch(progress, (val) => {
    if (val >= 100) {
        setTimeout(() => { visible.value = false }, 1000)
    }
})

defineExpose({
    setProgress: (val: number) => { progress.value = Math.min(100, Math.max(0, val)) },
    getProgress: () => progress.value,
})
</script>

<style scoped>
/* ── CSS 变量 ─────────────────────────────── */
:root {
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.15);
    --blue: #0077ff;
    --dark: #060d1a;
    --panel: #0a1628;
    --glow-cyan: 0 0 20px rgba(0, 229, 255, 0.6), 0 0 60px rgba(0, 229, 255, 0.2);
    --glow-blue: 0 0 20px rgba(0, 119, 255, 0.5);
}

/* ── 全屏遮罩 ───────────────────────────────── */
.loading-overlay {
    position: absolute;
    top: 0vh;
    left: 0;
    width: 100%;
    height: 100vh;
    background: radial-gradient(ellipse at 50% 40%, #0d1f3c 0%, #060d1a 70%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999998;
    overflow: hidden;
    gap: 0;
}

/* ── 背景网格 ───────────────────────────────── */
.bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
}

/* ── 四角装饰线 ─────────────────────────────── */
.corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: rgba(0, 229, 255, 0.5);
    border-style: solid;
}

.corner-tl {
    top: 20px;
    left: 20px;
    border-width: 2px 0 0 2px;
}

.corner-tr {
    top: 20px;
    right: 20px;
    border-width: 2px 2px 0 0;
}

.corner-bl {
    bottom: 20px;
    left: 20px;
    border-width: 0 0 2px 2px;
}

.corner-br {
    bottom: 20px;
    right: 20px;
    border-width: 0 2px 2px 0;
}

/* ── 系统标题 ───────────────────────────────── */
.system-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 36px;
    gap: 6px;
}

.title-en {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    letter-spacing: 0.35em;
    color: rgba(0, 229, 255, 0.5);
    text-transform: uppercase;
}

.title-zh {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: #fff;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
}

/* ── 六边形整体包裹 ──────────────────────────── */
.hex-wrapper {
    position: relative;
    width: 240px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── 旋转光晕环（六边形轮廓）────────────────── */
.hex-ring {
    position: absolute;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.hex-ring-outer {
    width: 240px;
    height: 240px;
    background: conic-gradient(from 0deg,
            transparent 0deg,
            rgba(0, 229, 255, 0.8) 60deg,
            transparent 120deg,
            transparent 180deg,
            rgba(0, 119, 255, 0.6) 240deg,
            transparent 300deg,
            transparent 360deg);
    animation: hex-spin 3s linear infinite;
}

.hex-ring-inner {
    width: 228px;
    height: 228px;
    background: #060d1a;
}

@keyframes hex-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* ── 六边形描边外壳 ──────────────────────────── */
.hex-border {
    position: absolute;
    width: 216px;
    height: 216px;
    background: linear-gradient(160deg, #001a33, #002244);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 16px rgba(0, 229, 255, 0.5));
    overflow: hidden;
}

/* ── 水波容器 ───────────────────────────────── */
.wave-container {
    width: 200px;
    height: 200px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    overflow: hidden;
    position: relative;
}

/* ── 水波变化层 ─────────────────────────────── */
.wave-change {
    position: absolute;
    width: 200px;
    height: 200px;
    left: 0;
    transition: top 1.1s ease-in-out;

    &::before,
    &::after {
        content: "";
        position: absolute;
        width: 400px;
        height: 400px;
        top: 0;
        left: 50%;
        background-color: rgba(6, 13, 26, 0.75);
        border-radius: 45% 47% 43% 46%;
        transform: translate(-50%, -70%) rotate(0);
        animation: rotate 7s linear infinite;
        z-index: 1;
    }

    &::after {
        border-radius: 47% 42% 46% 44%;
        background-color: rgba(6, 13, 26, 0.88);
        animation: rotate 9s linear -4s infinite;
        z-index: 2;
    }
}

/* ── 水体底色 ───────────────────────────────── */
.wave {
    position: relative;
    width: 200px;
    height: 200px;
    background: linear-gradient(180deg, #00aaff 0%, #0044cc 60%, #002a80 100%);
}

/* ── 水面百分比 ─────────────────────────────── */
.wave-percent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Courier New', monospace;
    font-size: 36px;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 0 12px rgba(0, 229, 255, 0.8);
    z-index: 10;
    line-height: 1;
    letter-spacing: -1px;
}

.wave-percent span {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.7;
}

/* ── 扫描线 ─────────────────────────────────── */
.scan-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 5%, rgba(0, 229, 255, 0.9) 50%, transparent 95%);
    animation: scan 2.4s ease-in-out infinite;
    pointer-events: none;
    z-index: 10;
}

@keyframes scan {
    0% {
        top: 10%;
        opacity: 0;
    }

    15% {
        opacity: 1;
    }

    85% {
        opacity: 1;
    }

    100% {
        top: 90%;
        opacity: 0;
    }
}

/* ── 六个角装饰点 ───────────────────────────── */
.hex-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #00e5ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #00e5ff, 0 0 16px rgba(0, 229, 255, 0.5);
    animation: dot-pulse 2s ease-in-out infinite;
}

/* 六边形六个顶点位置 */
.dot-1 {
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 0s;
}

.dot-2 {
    top: 25%;
    left: 100%;
    transform: translate(-50%, -50%);
    animation-delay: 0.33s;
}

.dot-3 {
    top: 75%;
    left: 100%;
    transform: translate(-50%, -50%);
    animation-delay: 0.66s;
}

.dot-4 {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 1s;
}

.dot-5 {
    top: 75%;
    left: 0%;
    transform: translate(-50%, -50%);
    animation-delay: 1.33s;
}

.dot-6 {
    top: 25%;
    left: 0%;
    transform: translate(-50%, -50%);
    animation-delay: 1.66s;
}

@keyframes dot-pulse {

    0%,
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(0.6);
    }
}

/* ── 状态栏 ─────────────────────────────────── */
.status-bar {
    display: flex;
    gap: 28px;
    margin-top: 36px;
    margin-bottom: 20px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 7px;
    animation: fade-in 0.5s ease both;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(0, 229, 255, 0.2);
    border: 1px solid rgba(0, 229, 255, 0.3);
    transition: all 0.5s ease;
    flex-shrink: 0;
}

.status-dot.active {
    background: #00e5ff;
    box-shadow: 0 0 8px #00e5ff;
    border-color: #00e5ff;
}

.status-label {
    /* font-family: 'Courier New', monospace; */
    font-size: 10.5px;
    letter-spacing: 0.05em;
    color: rgba(0, 229, 255, 0.45);
    transition: color 0.3s ease;
    white-space: nowrap;
}

.status-item:has(.status-dot.active) .status-label {
    color: rgba(0, 229, 255, 0.9);
}

/* ── 进度条 ─────────────────────────────────── */
.progress-track {
    width: 300px;
    height: 2px;
    background: rgba(0, 229, 255, 0.1);
    border-radius: 2px;
    position: relative;
    margin-bottom: 24px;
    overflow: visible;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0055cc, #00e5ff);
    border-radius: 2px;
    transition: width 0.8s ease-in-out;
}

.progress-glow {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    background: #00e5ff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px #00e5ff, 0 0 24px rgba(0, 229, 255, 0.6);
    transition: left 0.8s ease-in-out;
}

/* ── 底部加载动效（竖条）──────────────────────── */
.loading-bars {
    display: flex;
    gap: 4px;
    align-items: center;
}

.loading-bars>div {
    width: 3px;
    height: 18px;
    background: rgba(0, 229, 255, 0.6);
    border-radius: 2px;
    animation: bar-pulse 0.9s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}

.loading-bars>div:nth-child(3) {
    animation-delay: -0.9s;
}

.loading-bars>div:nth-child(2),
.loading-bars>div:nth-child(4) {
    animation-delay: -0.7s;
}

.loading-bars>div:nth-child(1),
.loading-bars>div:nth-child(5) {
    animation-delay: -0.5s;
}

@keyframes bar-pulse {
    0% {
        transform: scaleY(1);
        opacity: 1;
    }

    50% {
        transform: scaleY(0.3);
        opacity: 0.4;
    }

    100% {
        transform: scaleY(1);
        opacity: 1;
    }
}

/* ── 水波旋转动画 ───────────────────────────── */
@keyframes rotate {
    50% {
        transform: translate(-50%, -73%) rotate(180deg);
    }

    100% {
        transform: translate(-50%, -70%) rotate(360deg);
    }
}

.loading-fade-leave-active {
    transition: opacity 0.8s ease;
}

.loading-fade-leave-to {
    opacity: 0;
}
</style>