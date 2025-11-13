<template>
  <!-- 顶部菜单 -->
  <div class="top-menu-container">
    <div class="top-menu-icon-container">
      <div class="top-menu-icon-item-container">
        <div class="top-menu-icon-item" @click="$router.push('/twin?panel=drainage&action=drainage')">
          <svg
            t="1760610281201"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="100788"
            width="30"
            height="30"
          >
            <path
              d="M436.096 64h-84.48a25.6 25.6 0 0 0-25.344 25.984v73.536H61.568a29.44 29.44 0 0 0-29.568 29.568v344.704c0 15.872 13.376 28.8 29.568 28.8h264.704v75.072c0 6.848 2.56 13.44 7.36 18.304 4.736 4.928 11.264 7.68 17.984 7.68h84.48a25.6 25.6 0 0 0 25.344-25.984v-551.68A25.984 25.984 0 0 0 436.096 64z m25.6 209.408S576 284.16 688.512 382.848c85.056 68.48 177.664 197.376 200.32 439.552a220.16 220.16 0 0 0 103.232-70.976v114.688s-59.52 93.76-238.08 93.76a333.12 333.12 0 0 1-178.752-46.912 332.864 332.864 0 0 0-178.688-46.848c-178.56 0-238.208 93.76-238.208 93.76v-114.688a457.792 457.792 0 0 1 238.208-93.76 331.136 331.136 0 0 1 177.536 46.4c0.128-86.848-26.944-197.504-77.312-267.84-33.92-41.152-34.56-40.832-34.944-40.832V273.408z m-194.56-16.128c7.744 0 14.08 6.464 14.08 14.4v187.52a14.272 14.272 0 0 1-14.08 14.4H257.28a14.272 14.272 0 0 1-14.08-14.4v-187.52c0-7.936 6.4-14.4 14.08-14.4h9.856z"
              p-id="100789"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
        <div class="top-menu-icon-label">排水设施</div>
      </div>

      <div class="top-menu-icon-item-container">
        <div class="top-menu-icon-item" @click="$router.push('/twin?panel=moni&action=moni')">
          <svg
            t="1760610746390"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="101861"
            width="30"
            height="30"
          >
            <path
              d="M705.8 844.3c-19.3 0-34.9-15.6-34.9-34.9V510.5c0-87.6-71.3-158.9-158.9-158.9-87.6 0-158.9 71.3-158.9 158.9v298.9c0 19.3-15.6 34.9-34.9 34.9s-34.9-15.6-34.9-34.9V510.5c0-126.1 102.6-228.6 228.6-228.6s228.6 102.6 228.6 228.6v298.9c0.1 19.3-15.5 34.9-34.7 34.9z"
              fill="#ffffff"
              p-id="101862"
            ></path>
            <path
              d="M832.8 844.3H191.2c-19.3 0-34.9-15.6-34.9-34.9s15.6-34.9 34.9-34.9h641.5c19.3 0 34.9 15.6 34.9 34.9s-15.6 34.9-34.8 34.9z"
              fill="#ffffff"
              p-id="101863"
            ></path>
            <path
              d="M469.4 766.4c-6.2 0-12.5-1.7-18.2-5.1-16.4-10.1-21.6-31.5-11.5-48l73.8-120.6h-65.3c-12.6 0-24.3-6.8-30.5-17.9-6.2-11-5.9-24.6 0.8-35.3l80.9-131.1c10.1-16.4 31.6-21.5 48-11.4s21.5 31.6 11.4 48l-48.1 77.9h65.1c12.6 0 24.3 6.8 30.4 17.8 6.2 11 5.9 24.5-0.7 35.3L499.2 749.7c-6.6 10.7-18 16.7-29.8 16.7z"
              fill="#5AC0F9"
              p-id="101864"
            ></path>
            <path
              d="M515 240.4c-19.3 0-34.9-15.6-34.9-34.9v-88.6c0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9v88.6c0 19.3-15.6 34.9-34.9 34.9zM329.4 288.5c-12.1 0-23.8-6.3-30.2-17.4l-44.3-76.7c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.6 12.8l44.3 76.7c9.6 16.7 3.9 38-12.8 47.7-5.5 3.1-11.5 4.6-17.4 4.6zM192.6 423c-5.9 0-11.9-1.5-17.4-4.7L98.5 374c-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.6-12.8l76.7 44.3c16.7 9.6 22.4 31 12.8 47.7-6.4 11.2-18.1 17.5-30.2 17.5zM141.5 607.8H52.9C33.6 607.8 18 592.2 18 573s15.6-34.9 34.9-34.9h88.6c19.3 0 34.9 15.6 34.9 34.9s-15.7 34.8-34.9 34.8zM971.1 613.9h-88.6c-19.3 0-34.9-15.6-34.9-34.9s15.6-34.9 34.9-34.9h88.6c19.3 0 34.9 15.6 34.9 34.9s-15.6 34.9-34.9 34.9zM834.4 428.3c-12.1 0-23.8-6.3-30.2-17.4-9.6-16.7-3.9-38 12.8-47.6l76.7-44.3c16.7-9.7 38-3.9 47.6 12.8 9.6 16.7 3.9 38-12.8 47.6l-76.7 44.3c-5.5 3.1-11.4 4.6-17.4 4.6zM699.9 291.5c-5.9 0-11.9-1.5-17.4-4.7-16.7-9.6-22.4-31-12.8-47.7l44.3-76.7c9.6-16.7 31-22.4 47.6-12.8 16.7 9.6 22.4 31 12.8 47.7L730.1 274c-6.5 11.3-18.2 17.5-30.2 17.5z"
              fill="#ffffff"
              p-id="101865"
            ></path>
          </svg>
        </div>
        <div class="top-menu-icon-label">监测预警</div>
      </div>

      <div class="top-menu-icon-item-container">
        <div class="top-menu-icon-item" @click="$router.push('/twin?panel=sim&action=sim')">
          <svg
            t="1760610812010"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="103906"
            width="30"
            height="30"
          >
            <path
              d="M938.667 352v448c0 17.707-14.294 32-32 32H194.56l52.053 52.053a32 32 0 0 1 0 45.227c-6.186 6.293-14.4 9.387-22.613 9.387s-16.427-3.094-22.613-9.387L94.72 822.613c-0.853-0.746-1.6-1.6-2.133-2.453a31.043 31.043 0 0 1-3.414-4.907 33.405 33.405 0 0 1-2.56-6.4c-0.32-0.96-0.533-1.813-0.64-2.773-0.106-0.427-0.213-0.853-0.213-1.28-0.32-1.6-0.427-3.2-0.427-4.8s0.107-3.2 0.427-4.8c0-0.427 0.107-0.853 0.213-1.28 0.107-0.96 0.32-1.813 0.64-2.773 0.534-2.134 1.387-4.16 2.454-6.08 0.426-0.854 0.96-1.814 1.6-2.667a11.483 11.483 0 0 1 1.92-2.56 23.357 23.357 0 0 1 4.586-4.587c0.747-0.746 1.6-1.386 2.56-1.92 0.854-0.64 1.814-1.173 2.667-1.6 1.92-1.066 3.947-1.92 6.08-2.453 0.96-0.32 1.813-0.533 2.773-0.64 0.427-0.107 0.854-0.213 1.28-0.213 1.6-0.32 3.2-0.427 4.8-0.427h757.334V352c0-17.707 14.293-32 32-32s32 14.293 32 32z m0-128c0 1.6-0.107 3.2-0.427 4.8 0 0.427-0.107 0.853-0.213 1.28-0.107 0.96-0.32 1.813-0.64 2.773a33.405 33.405 0 0 1-2.56 6.4 31.043 31.043 0 0 1-3.414 4.907c-3.2 4.16-7.68 7.467-12.693 9.493-1.813 0.747-3.627 1.28-5.547 1.707-0.213 0-0.32 0-0.426 0.107-2.027 0.32-4.054 0.533-6.08 0.533H149.333v416c0 17.707-14.293 32-32 32s-32-14.293-32-32V224c0-17.707 14.294-32 32-32H829.44l-52.053-52.053a32 32 0 0 1 0-45.227 32 32 0 0 1 45.226 0L929.28 201.387c0.853 0.746 1.6 1.6 2.133 2.453 0.747 0.747 1.387 1.6 1.92 2.56 0.64 0.853 1.174 1.813 1.6 2.667 1.067 1.92 1.92 3.946 2.454 6.08 0.32 0.96 0.533 1.813 0.64 2.773 0.106 0.427 0.213 0.853 0.213 1.28 0.32 1.6 0.427 3.2 0.427 4.8z"
              p-id="103907"
              fill="#ffffff"
            ></path>
            <path
              d="M810.667 650.667c0 17.706-14.294 32-32 32H245.333c-17.706 0-32-14.294-32-32s14.294-32 32-32h53.334V373.333c0-17.706 14.293-32 32-32s32 14.294 32 32v245.334h106.666V373.333c0-17.706 14.294-32 32-32s32 14.294 32 32v245.334h128V373.333c0-17.706 14.294-32 32-32s32 14.294 32 32v245.334h53.334c17.706 0 32 14.293 32 32z"
              p-id="103908"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
        <div class="top-menu-icon-label">模拟调度</div>
      </div>
    </div>

    <div class="top-menu-scalebar-container">
      <!-- 生成50个刻度条 -->
      <div
        v-for="i in 50"
        :key="i"
        :class="['scalebar-item', i % 10 === 0 || i === 1 ? 'tall' : 'short']"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* 头部样式 */
.header {
  width: 100%;
  height: 7vh;
  position: relative;
}

.top-image {
  width: 100%;
  height: 7vh;
  display: block;
}

.header-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2vw;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
}
.top-menu-container {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 100;
}

.top-menu-icon-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  border-radius: 10px 10px 0 0;
}

.top-menu-icon-item-container {
  position: relative;
  display: flex;
  align-items: center;
}

.top-menu-icon-item {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #053242, #00d4ff);

  border: 2px solid rgba(248, 248, 248, 0.8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.top-menu-icon-item:hover {
  background: radial-gradient(
    circle at 0% 60%,
    #1a918b 0%,
    #0099c8 60%,
    #00e5ff 100%
  );
  border: 2px solid rgba(248, 248, 248, 0.6);
  box-shadow: inset 3px 3px 8px rgba(255, 255, 255, 0.4),
    inset -4px -4px 10px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 255, 255, 0.4);
  transform: scale(1.15);
  animation: pulseGlow 1s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  from {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(0, 255, 255, 1);
  }
}

.top-menu-scalebar-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 10px;
  border-radius: 0 0 10px 10px;
}

.scalebar-item {
  width: 4px;
  background-color: rgba(7, 74, 97, 0.7);
  border-radius: 2px;
}

.scalebar-item.short {
  height: 10px;
}

.scalebar-item.tall {
  height: 20px;
  background-color: rgba(7, 74, 97, 0.7);
}

.top-menu-icon-label {
  height: 40px;
  border-radius: 0 20px 20px 0;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(5, 50, 66, 0.5),
    rgba(0, 212, 255, 0.5)
  );
  border: 1px solid rgba(248, 248, 248, 0.8);
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  color: #ffffff;
  font-size: 18px;
  font-family: "SHJGSK";
  font-weight: bold;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
  left: 90%;
  top: 50%;
  transform: translateY(-50%);
}

.top-menu-icon-item:hover + .top-menu-icon-label {
  opacity: 1;
}
</style>