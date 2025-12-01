<template>
  <div class="twin-container">
    <!-- 渲染窗口 -->
    <div id="player" class="player"></div>

    <!-- 面板组件 -->
    <div class="panel-container">
      <DrainagePanel
        v-if="activePanel === 'drainage'"
        :is-dra-card2-close-button-visible="isDraCard2CloseButtonVisible"
        :is-dra-card3-close-button-visible="isDraCard3CloseButtonVisible"
        :is-dra-card4-close-button-visible="isDraCard4CloseButtonVisible"
        @update:isDraCard2CloseButtonVisible="handleDraCard2Visible"
        @update:isDraCard3CloseButtonVisible="
          isDraCard3CloseButtonVisible = $event
        "
        @update:isDraCard4CloseButtonVisible="
          isDraCard4CloseButtonVisible = $event
        "
        @create-sewage-tp="handleCreateSewageTP"
        @create-poi="handleCreatePumpPoi"
        @delete-poi="handleDeletePumpPoi"
        @create-shp-area="handleCreateShpArea"
        @delete-shp-area="handleDeleteShpArea"
        @create-pipeline="handleCreatePipeline"
        @clear-pipeline="handleClearPipeline"
        @dra-defect-row-click="handleDraDefectRowClick"
        @digClicked="handleDigClicked"
        @digcutClicked="handleDigCutClicked"
        @resetdigcutClicked="handleResetDigCutClicked"
        @pipeliftClicked="handlePipeliftClicked"
        @resetpipeliftClicked="handleResetPipeliftClicked"
        @pipelightClicked="handlePipelightClicked"
        @resetpipelightClicked="handleResetPipelightClicked"
        @liquidlevelClicked="handleLiquidlevelClicked"
        @resetliquidlevelClicked="handleResetLiquidlevelClicked"
        @flowdirectionClicked="handleFlowdirectionClicked"
        @resetflowdirectionClicked="handleResetFlowdirectionClicked"
        @pipevisibilityToggled="handlePipeVisibilityToggled"
        @pipeLabelToggled="handlePipeLabelToggled"
        @pipSpeEffectClicked="handlePipSpeEffectClicked"
        @resetSpeEffectClicked="handleResetSpeEffectClicked"
      />
      <MoniPanel
        v-else-if="activePanel === 'moni'"
        :is-moni-card2-close-button-visible="isMoniCard2CloseButtonVisible"
        :is-moni-card3-close-button-visible="isMoniCard3CloseButtonVisible"
        :is-moni-card4-close-button-visible="isMoniCard4CloseButtonVisible"
        @update:isMoniCard4CloseButtonVisible="handleMoniCard4Visible"
        @update:isMoniCard3CloseButtonVisible="handleMoniCard3Visible"
        @update:isMoniCard2CloseButtonVisible="handleMoniCard2Visible"
        @create-poi="handleCreateRainPoi"
        @delete-poi="handleDeleteRainPoi"
        @create-equal-rain="handleCreateEqualRain"
        @water-logging-row-click="handleWaterLoggingRowClick"
        @create-water-logging="handleCreateWaterLogging"
        @delete-water-logging="handleDeleteWaterLogging"
        @river-level-moni-clicked="handleRiverLevelMoniClicked"
        @river-level-updated="handleRiverLevelUpdated"
        @pipeline-level-click="handlePipelineLevelClick"
        @delete-pipe-liquidlevel="handleDeletePipeLiquidlevel"
      />
      <SimPanel
        v-else-if="activePanel === 'sim'"
        :is-sim-card4-close-button-visible="isSimCard4CloseButtonVisible"
        @update:isSimCard4CloseButtonVisible="handleSimCard4Visible"
        @onRoadIconClick="handleOnRoadIconClick"
        @create-poi="handleCreateFloodPumpCar"
        @delete-poi="handleDeleteFloodPumpCar"
        @onDispatchPlanClicked="handleDispatchPlanClicked"
        @downDispatchPlanClicked="handleDownDispatchPlanClicked"
        @onSmartDispatchClicked="handleSmartDispatchClicked"
        @onCloseRoadFloodAlert="handleCloseRoadFloodAlert"
        @onDispatchExecutionClicked="handleDispatchExecutionClicked"
      />
    </div>

    <!-- Menu -->
    <Menu
      @menu-inundation-execute-plan="handleMenuInundationExecutePlan"
      @menu-inundation-reset-plan="handleMenuInundationClear"
    />

    <!-- Legend Card -->
    <LegendCard
      v-show="showLegendCard"
      :legend-type="currentLegendType"
      @selection-change="handleLegendSelectionChange"
    />

    <div v-if="showChart" class="chart-panel">
      <h3>{{ currentStation }} - 曲线监测</h3>
      <iframe
        :src="chartUrl"
        width="420"
        height="320"
        frameborder="0"
        style="border-radius: 6px; overflow: hidden"
      ></iframe>
    </div>

    <!-- 水体生成控制按钮 -->
    <div class="inundation-controls">
      <!-- <button
        class="control-btn generate-btn"
        :class="{ loading: isLoading }"
        @click="generateInundation"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">生成水体</span>
        <span v-else>生成中...</span>
      </button>

      <button class="control-btn clear-btn" @click="clearInundation">
        清除水体
      </button> -->
      <button
        class="control-btn material-btn"
        :class="{ loading: isLoading }"
        @click="handleUpdateCamera"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">更新相机</span>
      </button>

      <button @click="handleUpdateWeather">
        <span v-if="!isLoading">切换天气</span>
      </button>

      <!-- <button @click="handleGetPrecision">
        <span v-if="!isLoading">获取精度</span>
      </button>

      <button @click="handleSetPrecision">
        <span v-if="!isLoading">设置精度150</span>
      </button> -->
      <!-- <button @click="showInfo = true">打开内涝卡片</button> -->
    </div>

    <InuClickInfoCard
      :visible="showInfo"
      :title="clickedGridID"
      :Inuvalue="currentInuValue"
      :historyValues="historyData"
      @close="showInfo = false"
    >
    </InuClickInfoCard>

    <!-- 加载遮罩 -->
    <div v-if="showLoadingOverlay" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">初始化中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  defineAsyncComponent,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import {
  createCircleRange,
  setCircleRangeVisible,
} from "@/utils/CreateCircleRange";
import WdpApi from "wdpapi";
import WimApi from "@wdp-api/wim-api";
import { InundationGenerator } from "@/utils/Inund_Gen";
import { createPois } from "@/utils/createPois";
import { handleDeleteAllPois } from "@/utils/deletePois";
import { createShpArea } from "@/utils/createShpArea";
import { deleteShpArea } from "@/utils/deleteShpArea";
import {
  createAndRunHeatmap,
  deleteHeatmapAlgorithm,
  enableHeatmapInteract,
  registerHeatmapClickCallback,
  extractHeatmapClickInfo,
} from "@/utils/CreateHeatmap";
import {
  createMovePath,
  createMultiMovePath,
  deleteMovePath,
  deleteAllMovePaths,
  createMoveVehicle,
  deleteVehicle,
  startVehicleMove,
  assignEidEntity,
  createEntityMovePath,
} from "@/utils/CreateMovePath";
import {
  startPickPoint,
  endPickPoint,
  getPickedPoints,
} from "@/utils/StartPickPoint";
import {
  startDigTerrainAnalysis,
  endDigTerrainAnalysis,
} from "@/utils/CreateSection";
import {
  createAndRunInundation,
  deleteInundationAlgorithm,
  enableInundationInteract,
  registerFloodClickCallback,
  extractFloodClickInfo,
} from "@/utils/CreateInundation";
import {
  createPipeline,
  setPipelineHeight,
  setPipelineHighlight,
  setPipelineVisible,
  setPipeLiquidLevel,
  setPipeFlowState,
  enablePipelineClick,
  registerPipelineClickEvent,
  extractPipelineClickInfo,
  focusPipelineSegment,
  addPipelineLabel,
  deletePipelineLabel,
} from "@/utils/CreatePipeline";
import { createEffect, deleteEffect } from "@/utils/CreateSpecialEffect";
import { updateCamera, updateCamerabycustomId } from "@/utils/updateCamera";
import DrainagePanel from "@/components/Drainage";
import MoniPanel from "@/components/Moni";
import SimPanel from "@/components/Sim";
import Menu from "@/components/Menu";
import { setStationVisibility } from "@/utils/setStationVisibility";
const LegendCard = defineAsyncComponent(
  () => import("@/components/Twin/legend-card.vue")
);
const InuClickInfoCard = defineAsyncComponent(
  () => import("@/components/Twin/InuClickInfo-card.vue")
);

const showInfo = ref(false);
const clickedGridID = ref<string>("359");
const currentInuValue = ref<number>(51);
const historyData = ref<number[]>([2, 1.2, 2.31, 1.34, 1.9, 2.3, 1.2]);
const isLoading = ref(false);
const showLoadingOverlay = ref(false);

const currentLegendType = ref<"pump" | "rain" | "waterlog" | "pipe" | null>(
  null
);
const PumpPoiRegistry = ref<{ customId: string; stationType: string }[]>([]);
const RainPoiRegistry = ref<{ customId: string; stationType: string }[]>([]);
const WaterLoggingPoiRegistry = ref<
  { customId: string; stationType: string }[]
>([]);
const FloodPumpCarRegistry = ref<{ customId: string; stationType: string }[]>(
  []
);
const PipeLiquidlevelPoiRegistry = ref<
  { customId: string; stationType: string }[]
>([]);

const shpAreaRegistry = ref<string[]>([]);

let App: any = null;
let inundationGenerator: InundationGenerator | null = null;
let vehicleDirection: "forward" | "backward" = "forward";
let isVehicleCar: boolean = false;

const loading = ref(true);
const loadingText = ref("场景初始化中...");

const currentStation = ref<string | null>(null);
const showChart = ref(false);
const chartUrl = ref("");

// 控制LegendCard的显示状态，默认隐藏
const showLegendCard = ref(false);

// 控制DrainagePanel中按钮的显示状态
const isDraCard2CloseButtonVisible = ref(false);
const isDraCard3CloseButtonVisible = ref(false);
const isDraCard4CloseButtonVisible = ref(false);

// 控制MoniPanel中按钮的显示状态
const isMoniCard2CloseButtonVisible = ref(false);
const isMoniCard3CloseButtonVisible = ref(false);
const isMoniCard4CloseButtonVisible = ref(false);

// 控制SimPanel中按钮的显示状态
const isSimCard4CloseButtonVisible = ref(false);

// 液位设置状态跟踪
const isLiquidLevelSet = ref(false);

// 路由参数
const route = useRoute();
const activePanel = computed(() => route.query.panel || "drainage");
const routeAction = computed(() => route.query.action || "");

// 监听路由参数变化
watch(routeAction, async (newAction) => {
  if (newAction === "moni") {
    console.log("📢 点击了模拟");
    App.Environment.SetSceneWeather("ModerateRain", 3, false);
    // const position: [number, number, number] = [
    //   120.97118575059994, 31.337138265349967, 3207.6395784932447,
    // ];
    // const rotation = { pitch: -34.0119743347168, yaw: -111.73487091064453 };
    // await updateCamera(App, position, rotation, 1);
    // 如果RainPoiRegistry不为空，显示LegendCard
    if (RainPoiRegistry.value && RainPoiRegistry.value.length > 0) {
      showLegendCard.value = true;
    }
  } else if (newAction === "drainage") {
    App.Environment.SetSceneWeather("Overcast", 3, false);
    // 如果PumpPoiRegistry不为空，显示LegendCard
    if (PumpPoiRegistry.value && PumpPoiRegistry.value.length > 0) {
      showLegendCard.value = true;
    }
  } else if (newAction === "sim") {
    App.Environment.SetSceneWeather("Overcast", 3, false);
    showLegendCard.value = false;
  }
});

function handleMoniCard2Visible(val: boolean) {
  isMoniCard2CloseButtonVisible.value = val;
  if (val) {
    currentLegendType.value = "rain";
    showLegendCard.value = true;
  }
}

function handleMoniCard3Visible(val: boolean) {
  isMoniCard3CloseButtonVisible.value = val;
  if (val) {
    currentLegendType.value = "pipe";
    showLegendCard.value = true;
  }
}

function handleMoniCard4Visible(val: boolean) {
  isMoniCard4CloseButtonVisible.value = val;
  if (val) {
    currentLegendType.value = "waterlog";
    showLegendCard.value = true;
  }
}

function handleDraCard2Visible(val: boolean) {
  isDraCard2CloseButtonVisible.value = val;
  if (val) {
    currentLegendType.value = "pump";
    showLegendCard.value = true;
  }
}

function handleSimCard4Visible(val: boolean) {
  isSimCard4CloseButtonVisible.value = val;
  if (val) {
    currentLegendType.value = "pump";
    showLegendCard.value = true;
  }
}

onMounted(() => {
  App = new WdpApi({
    id: "player",
    order: "233222b445716d9338b92997676e1f9d",
    url: "https://dtp-api.51aes.com",
    resolution: [3824, 1924],
    debugMode: "normal",
    keyboard: { normal: false, func: false },
  });

  App.Plugin.Install(WimApi);

  // 启动云渲染
  App.Renderer.Start()
    .then((res) => {
      if (res.success) {
        console.log("✅ WebRTC 连接成功，等待场景加载...");
        loadingText.value = "正在加载场景...";
        registerRenderEvents();
      } else {
        loading.value = false;
      }
    })
    .catch((err) => {
      loading.value = false;
    });
});

/** 修复点击弹窗页面上移问题 */
function fixWdpInputBug() {
  const fix = () => {
    const input = document.getElementById("playerInput");
    if (input) {
      input.style.position = "fixed";
    }
  };
  fix();
  const observer = new MutationObserver(fix);
  observer.observe(document.body, { childList: true, subtree: true });
}

/** 注册事件 */
function registerRenderEvents() {
  if (!App?.Renderer?.RegisterEvent) {
    console.warn("⚠️ 当前 SDK 不支持 RegisterEvent，请确认版本");
    return;
  }

  App.Renderer.RegisterEvent([
    {
      name: "onVideoReady",
      func: async function () {
        console.log("🎬 视频流连接成功，场景已渲染！");
        inundationGenerator = new InundationGenerator(App);

        // 设置天气为 LightRain
        try {
          await App.Environment.GetSceneWeather();
          await App.Environment.SetSceneWeather("PartlyCloudy", 3, false);
          console.log("🌤️ 天气已设置为阴天");
        } catch (error) {
          console.error("❌ 设置天气失败:", error);
        }

        loadingText.value = "场景加载完成！";
        setTimeout(() => (loading.value = false), 800);

        await new Promise((resolve) => setTimeout(resolve, 10000));

        // 创建管线
        await createPipeline(
          App,
          "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
          "rain"
        );

        await new Promise((resolve) => setTimeout(resolve, 10000));
        // 创建管线
        await createPipeline(
          App,
          "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
          "sewage"
        );

        await setPipelineHeight(App, 2, "rain");
      },
    },
    {
      name: "onStopedRenderCloud",
      func: function (res: any) {
        loadingText.value = "渲染中断，请刷新重试。";
        loading.value = true;
      },
    },
  ]);

  App.Renderer.RegisterSceneEvent([
    {
      name: "OnMoveAlongPathEndEvent",
      func: async function (res: any) {
        console.log("🚗💨 覆盖物路径移动结束：", res);

        if (vehicleDirection === "forward" && isVehicleCar) {
          await onArriveWaterPoint(); // 到达 B
        } else {
          await onArriveBackStart(); // 返回 A
        }
      },
    },
    {
      name: "OnWdpSceneIsReady",
      func: async function () {
        // { "event_name": "OnWdpSceneIsReady", "result": { "progress": 100 } }
        // 场景加载完成
      },
    },
  ]);
}

/** 生成水体 */
async function generateInundation() {
  if (!inundationGenerator) {
    console.error("⚠️ 水体生成器未初始化");
    return;
  }

  try {
    const result = await inundationGenerator.generateInundation();

    if (result.success) {
      console.log("✅ 水体生成完成:", result);
    } else {
      throw new Error(result.error || "水体生成失败");
    }
  } catch (error) {
    console.error("❌ 水体生成失败:", error);
  }
}

/** 清除水体 */
async function clearInundation() {
  await deleteMovePath(App);
  await deleteVehicle(App);
}

async function handleUpdateCamera() {
  const res = await App.CameraControl.GetCameraInfo();
  console.log(res);

  const points = await getPickedPoints(App, "surface");

  if (points.length > 0) {
    console.log("📍 用户取到的点坐标：", points);
  }
}

// const weatherList = ["auto","Sunny", "Cloudy", "PartlyCloudy", "Overcast", "LightRain","ModerateRain", "HeavyRain","lightSnow","ModerateSnow","HeavySnow", "Foggy", "Sand", "Haze"];
const weatherList = ["Sunny", "Cloudy", "PartlyCloudy", "Overcast"];
let weatherIndex = 0;

async function handleUpdateWeather() {
  const currentWeather = await App.Environment.GetSceneWeather();
  console.log(currentWeather);

  weatherIndex = (weatherIndex + 1) % weatherList.length;

  const nextWeather = weatherList[weatherIndex];

  // 设置天气
  await App.Environment.SetSceneWeather(nextWeather);

  console.log("设置为新天气：", nextWeather);
}

async function handleGetPrecision() {
  const res = await App.Setting.GetScreenPercentage();
  console.log(res);
}

async function handleSetPrecision() {
  const res = await App.Setting.SetScreenPercentage(150);
  console.log(res);
}

async function handleCreatePumpPoi() {
  const position: [number, number, number] = [
    120.93097610875282, 31.377814253101636, 335.74830889574747,
  ];
  const rotation = { pitch: -4.290104866027832, yaw: 51.65932083129883 };
  await updateCamera(App, position, rotation, 2);

  console.log("📩 收到泵站监测按钮点击事件");

  const coords: [number, number, number?][] = [
    [120.97755387402134, 31.31731400001077, 71],
    [120.94278484970378, 31.370710684920795, 71],
  ];

  const stationTypes = ["雨水泵站", "污水泵站"];

  const infoUrls = [
    "http://10.100.10.124:8090/inundation/html/pump1.html",
    "http://10.100.10.124:8090/inundation/html/pump2.html",
  ];

  const curveUrls = [
    "http://10.100.10.124:8090/inundation/html/pump1_curve.html",
    "http://10.100.10.124:8090/inundation/html/pump2_curve.html",
  ];

  PumpPoiRegistry.value = await createPois(
    App,
    coords,
    undefined,
    undefined,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [450, 300]
  );

  console.log("📋 已记录的对象信息:", PumpPoiRegistry.value);

  // 显示LegendCard
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleDeletePumpPoi() {
  await handleDeleteAllPois(App, PumpPoiRegistry.value);

  // 隐藏LegendCard
  showLegendCard.value = false;
}

async function handleCreateRainPoi() {
  const position: [number, number, number] = [
    121.14154703714782, 31.300770805083634, 331.514690278716,
  ];
  const rotation = { pitch: -5.135944843292236, yaw: 168.1057586669922 };
  await updateCamera(App, position, rotation, 2);

  console.log("📩 收到雨量监测按钮点击事件");

  const coords: [number, number, number?][] = [
    [121.0505133647897, 31.260351721475384, 71],
    [121.1283504344286, 31.30448758130633, 71],
  ];

  const stationTypes = ["60mm", "40mm"];

  const infoUrls = [
    "http://10.100.10.124:8090/inundation/html/rain1.html",
    "http://10.100.10.124:8090/inundation/html/rain2.html",
  ];

  const curveUrls = [
    "http://10.100.10.124:8090/inundation/html/rain1_curve.html",
    "http://10.100.10.124:8090/inundation/html/rain2_curve.html",
  ];

  RainPoiRegistry.value = await createPois(
    App,
    coords,
    undefined,
    undefined,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [450, 200]
  );

  console.log("📋 已记录的对象信息:", RainPoiRegistry.value);

  // 显示LegendCard
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleDeleteRainPoi() {
  await handleDeleteAllPois(App, RainPoiRegistry.value);

  // 隐藏LegendCard
  showLegendCard.value = false;
}

async function handleCreateWaterLogging() {
  const position: [number, number, number] = [
    120.99160942536444, 31.348677502854056, 304.65696434210344,
  ];
  const rotation = { pitch: -1.8512829542160034, yaw: -125.38239288330078 };
  await updateCamera(App, position, rotation, 2);
  console.log("📩 收到积水点监测按钮点击事件");

  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/config/Water_log.json"
  );

  await enableInundationInteract(App, true, true);
  await registerFloodClickCallback(App, (res: any) => {
    const info = extractFloodClickInfo(res);
    if (!info) return;

    console.log("🎯 点击网格 ID:", info.gridID);
    console.log("📏 当前水深:", info.value);
    console.log("📈 历史水深数组:", info.history);

    // 更新InuClickInfoCard组件的数据
    clickedGridID.value = info.gridID.toString();
    currentInuValue.value = info.value;
    historyData.value = info.history;
    showInfo.value = true;
  });

  const coords: [number, number, number?][] = [
    [120.98054103001719, 31.357674881322627, 0],
    [120.93862251117713, 31.403107643888227, 0],
    [120.95467504966746, 31.366524698908435, 0],
    [120.99046220502947, 31.39573707620424, 0],
  ];

  const stationTypes = ["0mm", "12mm", "24mm", "36mm"];

  const infoUrls = [
    "http://10.100.10.124:8090/inundation/html/water1.html",
    "http://10.100.10.124:8090/inundation/html/water2.html",
    "http://10.100.10.124:8090/inundation/html/water3.html",
    "http://10.100.10.124:8090/inundation/html/water4.html",
  ];

  const curveUrls: string[] = [];

  WaterLoggingPoiRegistry.value = await createPois(
    App,
    coords,
    undefined,
    undefined,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [450, 200]
  );

  console.log("📋 已记录的对象信息:", WaterLoggingPoiRegistry.value);

  // 显示LegendCard
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleDeleteWaterLogging() {
  await handleDeleteAllPois(App, WaterLoggingPoiRegistry.value);
  await deleteInundationAlgorithm();
  showLegendCard.value = false;
}

async function handlePipelineLevelClick() {
  console.log("📊 收到管道液位监测按钮点击事件");
  const position: [number, number, number] = [
    121.02740457338311, 31.319578935523527, 1708.6214824575459,
  ];
  const rotation = { pitch: -81.04249572753906, yaw: 75.2750015258789 };
  await updateCamera(App, position, rotation, 2);

  const coords: [number, number, number?][] = [
    [121.03120687625339, 31.31798575512674, 200],
    [121.02335571739293, 31.319388784695875, 200],
    [121.01775852191246, 31.317829698318537, 200],
    [121.02926870825598, 31.32434520332544, 200],
    [121.02241698194085, 31.31619352080823, 200],
  ];

  const stationTypes = ["<50%", "50%-100%", "100%", "液位异常", "离线"];

  const infoUrls = [""];

  const curveUrls = [""];

  PipeLiquidlevelPoiRegistry.value = await createPois(
    App,
    coords,
    undefined,
    undefined,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [450, 200]
  );
}

async function handleDeletePipeLiquidlevel() {
  await handleDeleteAllPois(App, PipeLiquidlevelPoiRegistry.value);
  showLegendCard.value = false;
}

async function handleRiverLevelMoniClicked() {
  console.log("📊 收到河道水位监测按钮点击事件");
  await assignEidEntity(App, "-9149062459682734585", "moni-river-id");
  await new Promise((r) => setTimeout(r, 300));
  await updateCamerabycustomId(App, "moni-river-id");
}

const pathRiver: [number, number, number][] = [
  [121.01783446872899, 31.381095073015935, 0.9],
  [121.01783446872899, 31.381096073015936, 10],
  [121.01783446872899, 31.381097073015935, 20],
  [121.01783446872899, 31.381098073015935, 30],
];

async function handleRiverLevelUpdated(level: number) {
  console.log("📊 收到河道水位更新事件:", level);
  const riverModel = await assignEidEntity(
    App,
    "-9149062459682734585",
    "moni-river-id"
  );
  const riverMovePath = await createMovePath(
    App,
    pathRiver,
    "#32CD32",
    "scan_line",
    true
  );
  await createEntityMovePath(App, riverModel, riverMovePath, 0, 90, 0, 5, true);
}

// 处理积水点点击事件
async function handleWaterLoggingRowClick(data: any) {
  console.log("📢 收到积水点点击事件:", data);
  // 使用updateCamera函数移动视角到积水点位置
  if (App && data.location && data.rotation) {
    await updateCamera(App, data.location, data.rotation, 2);
  }
}

async function handleOnRoadIconClick() {
  console.log("🚀 点击了道路图标");
  const position: [number, number, number] = [
    120.97434812649193, 31.394157759000386, 17.865765614339704,
  ];
  const rotation = { pitch: -8.252985000610352, yaw: 79.7743911743164 };
  await updateCamera(App, position, rotation, 2);
  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/config/Water_point_grid.json"
  );
  await enableInundationInteract(App, true, true);
  await registerFloodClickCallback(App, (res: any) => {
    const info = extractFloodClickInfo(res);
    if (!info) return;

    console.log("🎯 点击网格 ID:", info.gridID);
    console.log("📏 当前水深:", info.value);
    console.log("📈 历史水深数组:", info.history);

    // 更新InuClickInfoCard组件的数据
    clickedGridID.value = info.gridID.toString();
    currentInuValue.value = info.value;
    historyData.value = info.history;
    showInfo.value = true;
  });
}

async function handleCloseRoadFloodAlert() {
  console.log("🚫 关闭了积水告警");
  await deleteInundationAlgorithm();
}

async function handleCreateFloodPumpCar() {
  const position: [number, number, number] = [
    120.97479270189582, 31.39091652499695, 5335.463844791039,
  ];
  const rotation = { pitch: -85.71633911132812, yaw: -92.71320343017578 };
  await updateCamera(App, position, rotation, 2);
  console.log("📩 收到防汛泵车按钮点击事件");

  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/config/Water_point_grid.json"
  );

  await enableInundationInteract(App, true, true);
  await registerFloodClickCallback(App, (res) => {
    const info = extractFloodClickInfo(res);
    if (!info) return;

    console.log("🎯 点击网格 ID:", info.gridID);
    console.log("📏 当前水深:", info.value);
    console.log("📈 历史水深数组:", info.history);

    // 更新InuClickInfoCard组件的数据
    clickedGridID.value = info.gridID.toString();
    currentInuValue.value = info.value;
    historyData.value = info.history;
    showInfo.value = true;
  });

  const coords: [number, number, number?][] = [
    [120.99202039340129, 31.379904416883047, 0],
    [120.99161969865257, 31.389445567242284, 0],
    [120.97844439689983, 31.390520721894664, 0],
    [120.96073361823875, 31.393966725461677, 0],
    [120.97448527087013, 31.404281892638185, 0],
    [120.96481404364127, 31.38541157074577, 0],
    [120.97446402485654, 31.393557743050675, 0],
  ];

  const markerNormals = [
    "http://10.100.10.124:8090/inundation/assets/pngs/car1.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car2.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car3.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car4.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car1.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car3.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/water_notok.png",
  ];

  const markerActives = [
    "http://10.100.10.124:8090/inundation/assets/pngs/car1.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car2.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car3.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car4.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car1.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/car3.png",
    "http://10.100.10.124:8090/inundation/assets/pngs/water_notok.png",
  ];

  const infoUrls: string[] = [];
  const curveUrls: string[] = [];
  const stationTypes: string[] = [];

  FloodPumpCarRegistry.value = await createPois(
    App,
    coords,
    markerNormals,
    markerActives,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [450, 200]
  );

  console.log("📋 已记录的对象信息:", FloodPumpCarRegistry.value);
  showLegendCard.value = false;

  setTimeout(() => fixWdpInputBug(), 500);
}

const path0: [number, number, number][] = [
  [120.97845399909673, 31.3905175224146, 500],
  [120.97844266469784, 31.390569781567343, 500],
  [120.97476665448261, 31.39047151625851, 500],
  [120.97474750842821, 31.39074616850237, 500],
  [120.97459758080467, 31.39104486412353, 500],
  [120.97450811392741, 31.393439415479705, 500],
  [120.97446410197324, 31.39356135563207, 500],
];

async function handleDeleteFloodPumpCar() {
  await handleDeleteAllPois(App, FloodPumpCarRegistry.value);
  await deleteInundationAlgorithm();
  await deleteVehicle(App);
  await deleteAllMovePaths(App);
  await deleteMovePath(App);
  isVehicleCar = false;
  showLegendCard.value = false;
}

const path1: [number, number, number][] = [
  [120.97448647330071, 31.40429533188626, 0],
  [120.97435029085588, 31.40428548039317, 0],
  [120.97425662902775, 31.40419967903733, 0],
  [120.9744649769879, 31.393563256982386, 0],
];

const path2: [number, number, number][] = [
  [120.96071034414982, 31.393965308805534, 0],
  [120.96064762516181, 31.393396971223115, 0],
  [120.96167826449359, 31.393194810581328, 0],
  [120.96211397461386, 31.393156094842936, 0],
  [120.97447549337758, 31.393611108146644, 0],
  [120.9744820996931, 31.3935638409912, 0],
];

const path3: [number, number, number][] = [
  [120.96480345589895, 31.385378393309747, 0],
  [120.9673694359421, 31.385023719831718, 0],
  [120.97479771208626, 31.385107603694777, 0],
  [120.97475375326147, 31.386544822505623, 0],
  [120.9746649714015, 31.388335198692943, 0],
  [120.97453726641538, 31.393498702598215, 0],
  [120.97448195905646, 31.393524121890163, 0],
];

const path4: [number, number, number][] = [
  [120.9920088416189, 31.37992965409778, 0],
  [120.99157799284427, 31.37990440444007, 0],
  [120.99153197751433, 31.380947762040837, 0],
  [120.98433740138303, 31.380550927991692, 0],
  [120.9784041263993, 31.380302657340394, 0],
  [120.97497994766306, 31.380217113768595, 0],
  [120.97477021504857, 31.3852641640656, 0],
  [120.97465524434654, 31.38836082527429, 0],
  [120.97451002792764, 31.39354561849163, 0],
  [120.97447766473432, 31.393554198390046, 0],
];

const path5: [number, number, number][] = [
  [120.99160359035702, 31.38945619252187, 0],
  [120.99090976148561, 31.389443363900618, 0],
  [120.99025079751432, 31.398421404468056, 0],
  [120.98973556086658, 31.39838260058787, 0],
  [120.98956725850803, 31.398329620646546, 0],
  [120.98939458845004, 31.398156460301347, 0],
  [120.9894989258012, 31.395676789203968, 0],
  [120.98376977988958, 31.395048883859587, 0],
  [120.98228872330067, 31.394832238839292, 0],
  [120.97899948315047, 31.39411409549756, 0],
  [120.97740904255357, 31.393744643816564, 0],
  [120.97453708738425, 31.393620554820615, 0],
  [120.97452393870238, 31.393576021676587, 0],
];

async function handleSmartDispatchClicked() {
  console.log("🚀 选择了智能调度");
}

async function handleDispatchPlanClicked() {
  const position: [number, number, number] = [
    120.97479270189582, 31.39091652499695, 5335.463844791039,
  ];
  const rotation = { pitch: -85.71633911132812, yaw: -92.71320343017578 };
  await updateCamera(App, position, rotation, 2);
  console.log("🚀 选择了调度方案");
  const position0: [number, number, number] = [
    120.97446402485654, 31.393557743050675, 0,
  ];
  await createCircleRange(App, position0, 2300, true);

  await createMultiMovePath(App, path0, "#32CD32", "scan_line");
  await createMultiMovePath(App, path1, "#00FFFF", "scan_line");
  await createMultiMovePath(App, path2, "#00FFFF", "scan_line");
  await createMultiMovePath(App, path3, "#00FFFF", "scan_line");
  await createMultiMovePath(App, path4, "#00FFFF", "scan_line");
  await createMultiMovePath(App, path5, "#00FFFF", "scan_line");

  await createMoveVehicle(App, path0[0]);
}

async function handleDownDispatchPlanClicked() {
  console.log("🚀 取消了调度方案");
  await deleteInundationAlgorithm();
  await deleteVehicle(App);
  await deleteAllMovePaths(App);
  await deleteMovePath(App);
  await setCircleRangeVisible(false);
}

async function handleDispatchExecutionClicked() {
  const position: [number, number, number] = [
    120.97595042775713, 31.390777623763363, 905.1810781739052,
  ];
  const rotation = { pitch: -80.49603271484375, yaw: -93.47093200683594 };
  await updateCamera(App, position, rotation, 2);
  await deleteAllMovePaths(App);

  vehicleDirection = "forward";
  isVehicleCar = true;
  await createMovePath(App, path0, "#32CD32", "scan_line");
  await createMoveVehicle(App, path0[0]);
  await startVehicleMove(App, undefined, undefined, 5, false, "play");
}

async function onArriveWaterPoint() {
  console.log("🚗💨 到达水体点");
  setTimeout(async () => {
    await createMovePath(App, path0, "#32CD32", "scan_line");
    await createMoveVehicle(App, path0[0]);
    await startVehicleMove(App, undefined, undefined, 5, true, "play");
  }, 1200);
  vehicleDirection = "backward";
}

async function onArriveBackStart() {
  console.log("🚗💨 返回起始点");
  await deleteVehicle(App);
  await deleteMovePath(App);
  isVehicleCar = false;
}

async function handleCreateEqualRain() {
  const position: [number, number, number] = [
    120.9742638131965, 31.377667838982788, 3419.1276897183343,
  ];
  const rotation = { pitch: -83.52790832519531, yaw: -89.51040649414062 };
  await updateCamera(App, position, rotation, 2);

  await createAndRunHeatmap(
    App,
    "http://10.100.10.124:8090/inundation/config/Heatmap_Gen.json"
  );
  await enableHeatmapInteract(App, true, true);
  await registerHeatmapClickCallback(App, (res: any) => {
    const info = extractHeatmapClickInfo(res);
    if (!info) return;

    console.log("🎯 点击网格 ID:", info.gridID);
    console.log("📏 当前热力值:", info.value);
    console.log("📈 历史热力值数组:", info.history);

    // 更新InuClickInfoCard组件的数据
    clickedGridID.value = info.gridID.toString();
    currentInuValue.value = info.value;
    historyData.value = info.history;
    showInfo.value = true;
  });
}

async function handleCreateSewageTP() {
  const position: [number, number, number] = [
    121.01438205273841, 31.37637133888531, 150.88803602211226,
  ];
  const rotation = { pitch: -29.386911392211914, yaw: -89.97541046142578 };
  await updateCamera(App, position, rotation, 2);
}

async function handleCreateShpArea() {
  const position: [number, number, number] = [
    120.85626238393874, 31.403795843683145, 3630.278610812755,
  ];
  const rotation = { pitch: -75.7804946899414, yaw: 93.45965576171875 };
  await updateCamera(App, position, rotation, 2);

  const shpUrls = [
    "http://10.100.10.124:8090/inundation/shp/water_area/poly1.shp",
    "http://10.100.10.124:8090/inundation/shp/water_area/poly2.shp",
    "http://10.100.10.124:8090/inundation/shp/water_area/poly3.shp",
    "http://10.100.10.124:8090/inundation/shp/water_area/poly4.shp",
  ];

  const colors = ["FFE4B5", "87CEFA", "1E90FF", "FF7F50"];

  shpAreaRegistry.value = await createShpArea(App, shpUrls, colors);
  console.log("📋 已记录的SHP区域信息:", shpAreaRegistry.value);
}

/**
 * 删除所有已创建的 SHP 区域
 */
async function handleDeleteShpArea() {
  console.log("🧹 准备删除所有 SHP 区域:", shpAreaRegistry.value);

  try {
    await deleteShpArea(App, shpAreaRegistry.value);
    shpAreaRegistry.value = [];
  } catch (err) {
    console.error("❌ 删除 SHP 区域失败:", err);
  }
}

async function handleCreatePipeline() {
  const position: [number, number, number] = [
    121.02740457338311, 31.319578935523527, 1708.6214824575459,
  ];
  const rotation = { pitch: -81.04249572753906, yaw: 75.2750015258789 };
  await updateCamera(App, position, rotation, 2);

  await createPipeline(
    App,
    "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
    "rain"
  );
  App.Environment.SetSceneWeather("ModerateRain", 3, false);
  await setPipelineHeight(App, 200, "rain");

  await setPipelineHighlight(
    App,
    true,
    "#ed1941",
    100,
    ["SN", "SL", "ZT"],
    "rain"
  );

  const fids1 = ["6603a9a6", "33cd68b6", "6145cd43", "f790a225", "5c16b0ae"];
  const fids2 = [
    "d4a384ac",
    "022fdead",
    "e27aa883",
    "20f67f62",
    "66cad8af",
    "43c45d5e",
  ];
  await setPipelineHighlight(App, true, "#0000FF", 100, [""], "rain", fids1);

  await setPipelineHighlight(App, true, "#FFD700", 100, [""], "rain", fids2);

  await createPipeline(
    App,
    "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
    "sewage"
  );
  await setPipelineHeight(App, 150, "sewage");
  await setPipelineHighlight(
    App,
    true,
    "#ed1941",
    100,
    ["SN", "SL", "ZT"],
    "sewage"
  );
}

async function handleClearPipeline() {
  App.Environment.SetSceneWeather("Overcast", 3, false);
  await setPipelineHeight(App, 0, "rain");
  await setPipelineHeight(App, -20, "sewage");
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "rain"
  );
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "sewage"
  );
}

let DigCameraUpdated = false;

async function handleDigClicked() {
  if (!DigCameraUpdated) {
    const position: [number, number, number] = [
      121.03948586577572, 31.31394473483386, 11.504332372697972,
    ];
    const rotation = { pitch: -9.464871406555176, yaw: -29.764591217041016 };
    await updateCamera(App, position, rotation, 2);
    DigCameraUpdated = true; // 标记为已调用
  }

  await startPickPoint(App, false, true, "surface");

  // await createPipeline(
  //   App,
  //   "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
  //   "sewage"
  // );

  // App.Environment.SetSceneWeather("ModerateRain", 3, false);
}

async function handleDigCutClicked() {
  const coordinates = await getPickedPoints(App, "surface");

  if (!coordinates || coordinates.length < 3) {
    console.warn("⚠️ 取点数量不足，至少需要 3 个点才能进行剖切分析！");
    return;
  }
  console.log(`📍 共获取到 ${coordinates.length} 个点：`, coordinates);

  await endPickPoint(App);
  await startDigTerrainAnalysis(App, 20, coordinates);
  await startPickPoint(App, false, true, "surface");
}

async function handleResetDigCutClicked() {
  await endDigTerrainAnalysis(App);
  await endPickPoint(App);
}

async function handlePipeliftClicked(type: string, height: string) {
  await setPipelineHeight(App, parseFloat(height), type);
}

async function handleResetPipeliftClicked() {
  await setPipelineHeight(App, 2, "rain");
  await setPipelineHeight(App, 0, "sewage");
}

async function handlePipelightClicked(
  type: string,
  intensity: number,
  color: string
) {
  await setPipelineHighlight(
    App,
    true,
    color,
    intensity,
    ["SN", "SL", "ZT"],
    type
  );
}

async function handleResetPipelightClicked() {
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "rain"
  );
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "sewage"
  );
}

async function handlePipeVisibilityToggled(visible: boolean, pipeType?: string, pipeIds?: string[]) {
  // 如果pipeType和pipeIds都存在，则设置特定管段的可见性
  if (pipeType && pipeIds && pipeIds.length > 0) {
    await setPipelineVisible(App, visible, pipeType, [], pipeIds);
  } 
  // 如果只有pipeType，则设置该类型管网的可见性
  else if (pipeType) {
    await setPipelineVisible(App, visible, pipeType, ["SN", "SL", "ZT"]);
  }
  // 如果都没有，则默认设置所有管网的可见性
  else {
    await setPipelineVisible(App, visible, "rain", ["SN", "SL", "ZT"]);
    await setPipelineVisible(App, visible, "sewage", ["SN", "SL", "ZT"]);
  }
}

async function handlePipeLabelToggled(visible: boolean) {
  if (visible) {
    await enablePipelineClick(App, true);
    await registerPipelineClickEvent(App, async (res) => {
      const info = extractPipelineClickInfo(res);
      if (!info) return;

      currentPipeEid.value = info.eid;
      currentPipeFid.value = info.fId;

      await focusPipelineSegment(App, info.eid, info.fId, 150);
      await addPipelineLabel(App, info.eid, info.fId, "PipeInfo");
      await addPipelineLabel(App, info.eid, info.fId, "Fluid");
      if (isLiquidLevelSet.value) {
        console.log("isLiquidLevelSet.value", isLiquidLevelSet.value);
        await addPipelineLabel(App, info.eid, info.fId, "Fluid");
      } else {
        console.log("isLiquidLevelSet.value", isLiquidLevelSet.value);
        await deletePipelineLabel(App, "Fluid");
        currentPipeEid.value = info.eid;
        currentPipeFid.value = info.fId;
      }
    });
  } else {
    await enablePipelineClick(App, false);
    await deletePipelineLabel(App, "PipeInfo");
    await deletePipelineLabel(App, "WellInfo");
    await deletePipelineLabel(App, "Fluid");
    currentPipeEid.value = null;
    currentPipeFid.value = null;
  }
}

let PipSpeEffectUpdated = false;
async function handlePipSpeEffectClicked() {
  if (!PipSpeEffectUpdated) {
    const position: [number, number, number] = [
      120.97430329540073, 31.39360901829823, 8.633172645532724,
    ];
    const rotation = { pitch: -11.957905769348145, yaw: -3.2465500831604004 };
    await updateCamera(App, position, rotation, 2);
    PipSpeEffectUpdated = true; // 标记为已调用
  }

  const location: [number, number, number] = [
    120.97441177481612, 31.3936132367833, 0,
  ];
  await createEffect(
    App,
    location, // 位置
    [2, 2, 0.11], // 缩放
    true, // 是否可见
    "66e520631a7046c139881a9a379a2063" // seedId
  );
}

async function handleResetSpeEffectClicked() {
  await deleteEffect(App);
}

async function handleLiquidlevelClicked(
  pipeType: string,
  pipeLiquidLevel: number,
  color: string
) {
  await setPipeLiquidLevel(App, pipeLiquidLevel, color, pipeType);
  isLiquidLevelSet.value = true;

  if (currentPipeEid.value && currentPipeFid.value) {
    await addPipelineLabel(
      App,
      currentPipeEid.value,
      currentPipeFid.value,
      "Fluid"
    );
  }
  console.log("isLiquidLevelSet.value", isLiquidLevelSet.value);
}

const currentPipeEid = ref<string | null>(null);
const currentPipeFid = ref<string | null>(null);

async function handleResetLiquidlevelClicked() {
  await setPipeLiquidLevel(App, 0, "#000000", "rain");
  await setPipeLiquidLevel(App, 0, "#000000", "sewage");
  isLiquidLevelSet.value = false;
  console.log("isLiquidLevelSet.value", isLiquidLevelSet.value);
}

async function handleFlowdirectionClicked(
  pipeType: string,
  direction: string,
  style: string,
  color: string
) {
  await setPipeFlowState(
    App,
    parseInt(direction),
    parseInt(style),
    color,
    true,
    pipeType
  );
}

async function handleResetFlowdirectionClicked() {
  await setPipeFlowState(App, 0, 0, "#000000", false, "rain");
  await setPipeFlowState(App, 0, 0, "#000000", false, "sewage");
}

function classifyRainStation(stationType: string, selected: string[]) {
  // stationType 如 "60mm" 或 "40mm"
  const value = parseFloat(stationType);
  if (isNaN(value)) return false;

  if (selected.includes(">50mm") && value > 50) return true;
  if (selected.includes("<50mm") && value <= 50) return true;

  return false;
}

function classifyWaterlogStation(stationType: string, selected: string[]) {
  // stationType 如 "0mm", "12mm", "24mm", "36mm"
  const value = parseFloat(stationType);
  if (isNaN(value)) return false;

  if (selected.includes("0mm") && value === 0) return true;
  if (selected.includes("1-15mm") && value > 0 && value <= 15) return true;
  if (selected.includes("16-30mm") && value >= 16 && value <= 30) return true;
  if (selected.includes("30-50mm") && value > 30 && value <= 50) return true;

  return false;
}

// 处理 LegendCard 选中状态变化
async function handleLegendSelectionChange(selected: string[]) {
  console.log("📋 LegendCard 选中状态变化:", selected);

  // 定义泵站和雨量监测类型
  const PumpTypes = ["雨水泵站", "污水泵站"];

  // 根据当前面板类型分别处理
  if (currentLegendType.value === "rain") {
    // 只处理雨量监测
    for (const poi of RainPoiRegistry.value) {
      const match = classifyRainStation(poi.stationType, selected);
      await setStationVisibility(App, [poi], poi.stationType, match);
    }
  } else if (currentLegendType.value === "waterlog") {
    // 只处理积水点监测
    for (const poi of WaterLoggingPoiRegistry.value) {
      const match = classifyWaterlogStation(poi.stationType, selected);
      await setStationVisibility(App, [poi], poi.stationType, match);
    }
  } else if (currentLegendType.value === "pump") {
    // 只处理泵站
    for (const type of PumpTypes) {
      const shouldShow = selected.includes(type);
      await setStationVisibility(App, PumpPoiRegistry.value, type, shouldShow);
    }
  }
}

async function openStationCurve(station: string, action?: string) {
  console.log("🎯 openStationCurve 被触发:", station, action);

  // 这里你也可以更新右侧面板或状态
  if (action === "open") {
    console.log(`📈 ${station} 曲线弹窗已打开`);
    let position: [number, number, number];
    let rotation: { pitch: number; yaw: number };

    switch (station) {
      case "pump1":
        position = [120.97734909382876, 31.316507687253115, 23.362653086556417];
        rotation = { pitch: -1.7691400051116943, yaw: -72.36478424072266 };
        break;

      case "pump2":
        position = [120.9428333710595, 31.371650716301655, 25.20759203956954];
        rotation = { pitch: -0.7572699785232544, yaw: 95.45074462890625 };
        break;
    }

    await updateCamera(App, position, rotation, 2);
  } else if (action === "close") {
    console.log(`❎ ${station} 曲线弹窗已关闭`);
  }
}

async function handleMenuInundationExecutePlan(plan: string, radio: string) {
  const position: [number, number, number] = [
    120.97674707972008, 31.37579600061361, 3801.609975676696,
  ];
  const rotation = { pitch: -82.7701644897461, yaw: -87.65797424316406 };
  await updateCamera(App, position, rotation, 2);

  if (radio === "heat") {
    await createAndRunHeatmap(
      App,
      "http://10.100.10.124:8090/inundation/config/Heatmap_Gen.json"
    );
    await enableHeatmapInteract(App, true, true);
    await registerHeatmapClickCallback(App, (res: any) => {
      const info = extractHeatmapClickInfo(res);
      if (!info) return;

      console.log("🎯 点击网格 ID:", info.gridID);
      console.log("📏 当前热力值:", info.value);
      console.log("📈 历史热力值数组:", info.history);

      // 更新InuClickInfoCard组件的数据
      clickedGridID.value = info.gridID.toString();
      currentInuValue.value = info.value;
      historyData.value = info.history;
      showInfo.value = true;
    });
  } else if (radio === "water") {
    // await createAndRunInundation(
    //   App,
    //   "http://10.100.10.124:8090/inundation/config/Inud_Gen.json"
    // );
    await createAndRunInundation(
      App,
      "http://10.100.10.124:8090/inundation/config/hugeArea_Test/Grid_1990/Inud_Gen_1990.json"
    );
    await enableInundationInteract(App, true, true);
    await registerFloodClickCallback(App, (res) => {
      const info = extractFloodClickInfo(res);
      if (!info) return;

      console.log("🎯 点击网格 ID:", info.gridID);
      console.log("📏 当前水深:", info.value);
      console.log("📈 历史水深数组:", info.history);

      // 更新InuClickInfoCard组件的数据
      clickedGridID.value = info.gridID.toString();
      currentInuValue.value = info.value;
      historyData.value = info.history;
      showInfo.value = true;
    });
  }
}

async function handleMenuInundationClear() {
  await deleteInundationAlgorithm(true);
  await deleteHeatmapAlgorithm(true);
}

onBeforeUnmount(() => {
  if (App?.Renderer?.UnRegisterEvent) {
    App.Renderer.UnRegisterEvent(["onVideoReady", "onStopedRenderCloud"]);
  }
  App?.Renderer?.Stop?.();
});
</script>

<style scoped>
.twin-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.player {
  width: 100%;
  height: 100%;
}

/* 面板容器样式 */
.panel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* 水体生成控制按钮 */
.inundation-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-button {
  padding: 10px 15px;
  background: rgba(0, 191, 255, 0.8);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.control-button:hover {
  background: rgba(0, 191, 255, 1);
  transform: translateY(-2px);
}

.control-button.clear {
  background: rgba(255, 69, 0, 0.8);
}

.control-button.clear:hover {
  background: rgba(255, 69, 0, 1);
}

.control-button.material {
  background: rgba(50, 205, 50, 0.8);
}

.control-button.material:hover {
  background: rgba(50, 205, 50, 1);
}

/* Loading 遮罩层 */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.95)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  z-index: 1000;
  font-size: 16px;
  backdrop-filter: blur(5px);
}

.loading-box {
  text-align: center;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #00bfff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.chart-panel {
  position: absolute;
  top: 100px;
  right: 40px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  z-index: 500;
}
</style>