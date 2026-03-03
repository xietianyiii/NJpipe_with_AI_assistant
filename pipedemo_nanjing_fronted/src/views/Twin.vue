<template>
  <div class="twin-container">
    <!-- 渲染窗口 -->
    <div id="player" class="player"></div>

    <!-- 面板组件 -->
    <div class="panel-container">
      <Header />
      <PullCord v-model="isSidebarVisible" />
      <DrainagePanel v-if="activePanel === 'drainage'" :sidebarVisible="isSidebarVisible"
        @open-pipe-overview="handleOpenPipeOverview" @close-pipe-overview="handleClosePipeOverview"
        @create-pump-poi="handleCreatePumpPoi" @close-pump-poi="handleDeletePumpPoi"
        @open-sewage-plant="handleOpenSewagePlant" @close-sewage-plant="handleCloseSewagePlant"
        @open-water-zone="handleOpenWaterZone" @close-water-zone="handleCloseWaterZone"
        @open-struc-defect="handleOpenStrucDefect" @close-struc-defect="handleCloseStrucDefect"
        @open-func-defect="handleOpenFuncDefect" @open-defect-detection="handleButtonAnalysis"
        @open-defect-repair="handleButtonRepair" @close-func-defect="handleCloseFuncDefect" />
      <MonitorPanel v-if="activePanel === 'monitor'" :sidebarVisible="isSidebarVisible"
        @create-rain-poi="handleCreateRainPoi" @close-rain-poi="handleDeleteRainPoi"
        @open-pipe-liquid="handleOpenPipeLiquid" @open-lake-moni="handleOpenLakeMoni"
        @close-water-moni="handleCloseWaterMoni" @create-waterlog-poi="handleCreateWaterlogPoi"
        @close-waterlog-poi="handleDeleteWaterlogPoi" @wtlog-click="handleWaterlogClick" />
      <SimPanel v-if="activePanel === 'sim'" :sidebarVisible="isSidebarVisible" @open-pump-car="handleOpenPumpCar"
        @close-pump-car="handleClosePumpCar" @open-dispatch-plan="handleOpenDispatchPlan"
        @close-dispatch-plan="handleCloseDispatchPlan" @open-dispatch-execute="handleOpenDispatchExecute" />

      <LegendCard v-show="showLegendCard" :legend-type="currentLegendType"
        @selection-change="handleLegendSelectionChange" />

      <LakeMoniCard :visible="lakeMoniVisible" @close="lakeMoniVisible = false"
        @river-level-updated="handleLakeLevelUpdated" />

      <InundationCard v-show="showInudationCard" :visible="showInudationCard" @close="showInudationCard = false"
        @inundation-execute="handleInundationExecute" @inundation-reset="handleInundationReset" />

      <InuClickInfoCard :visible="showInfo" :title="clickedGridID" :Inuvalue="currentInuValue"
        :historyValues="historyData" @close="showInfo = false">
      </InuClickInfoCard>

      <AIQwenCard v-show="showAIQwenCard" :chat="chat" @close="showAIQwenCard = false" />

      <PipeAttriInfoCard v-show="showPipeAttriInfo" :PipeFID="PipeAttriFID" :PipeEID="PipeAttriEID"
        :pipeData="pipeDetailAttriInfo" :aiAnalysisTrigger="aiAnalysisTrigger" :aiRepairTrigger="aiRepairTrigger"
        @close="showPipeAttriInfo = false" @ai-analysis="handleAIAnalysis" @ai-repair="handleAIRepair" />

      <PipeProblemCard v-show="showPipeProblemCard" :PipeProblemFID="PipeProblemFID"
        v-model:repairButtonVisible="RepairButtonVisible" @open-defect-repair="handleButtonRepair"
        :pipeProblemData="pipeDetailProblemInfo" @row-click="handleRowClick" @close="showPipeProblemCard = false" />

      <PipeUploadCard v-show="showPipeUploadCard" v-model:pipe-upload-step-active="pipeUploadStepActive"
        @close="showPipeUploadCard = false" />

      <PipeToolBar v-model:show-pipe-upload-card="showPipeUploadCard" v-model:show-AI-qwen-card="showAIQwenCard"
        v-model:show-Inudation-card="showInudationCard" @create-pipeline="handleCreatePipeline"
        @clear-pipeline="handleClearPipeline" @digClicked="handleDigClicked" @digcutClicked="handleDigCutClicked"
        @resetdigcutClicked="handleResetDigCutClicked" @pipeliftClicked="handlePipeliftClicked"
        @resetpipeliftClicked="handleResetPipeliftClicked" @pipelightClicked="handlePipelightClicked"
        @resetpipelightClicked="handleResetPipelightClicked" @liquidlevelClicked="handleLiquidlevelClicked"
        @resetliquidlevelClicked="handleResetLiquidlevelClicked" @flowdirectionClicked="handleFlowdirectionClicked"
        @resetflowdirectionClicked="handleResetFlowdirectionClicked" @sceneStyleClicked="handleSceneStyleClicked"
        @resetSceneStyleClicked="handleResetSceneStyleClicked" @pipevisibilityToggled="handlePipeVisibilityToggled"
        @pipeLabelToggled="handlePipeLabelToggled" @pipeEditorToggled="handlePipeEditorToggled"
        @pipSpeEffectClicked="handlePipSpeEffectClicked" @resetSpeEffectClicked="handleResetSpeEffectClicked"
        @resetPipeUploadClicked="handleResetPipeUploadClicked" @AICardToggled="handleAICardToggled"
        @InudationCardToggled="handleInudationCardToggled" />

      <div class="test-btn-container">
        <!-- <div class="camera-input-container">
          <label for="camera-location">位置:</label>
          <input id="camera-location" v-model="cameraLocation" placeholder="输入位置坐标 (x,y,z)" class="camera-input" />
        </div>
        <div class="camera-input-container">
          <label for="camera-rotation">旋转:</label>
          <input id="camera-rotation" v-model="cameraRotation" placeholder="输入旋转角度 (pitch,yaw)" class="camera-input" />
        </div>

        <button class="control-btn" @click="handleUpdateCamera">
          <span>更新相机</span>
        </button>  -->
        <!-- <button class="control-btn" @click="handleGetCameraInfo">
          <span>获取相机信息</span>
        </button>
        <div class="path-builder">
          <button @click="temstartPick">开始取点</button>
          <button @click="temendPick">绘制路径</button>

          <label>
            颜色：
            <input type="color" v-model="temcolor" />
          </label>

          <label>
            样式：
            <select v-model="temstyle">
              <option v-for="item in temstyles" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>

          <label>
            宽度：
            <input type="number" v-model.number="temwidth" min="1" max="2000" step="1" />
          </label>

          <label>
            路过颜色：
            <input type="color" v-model="tempasscolor" />
          </label>

          <label>
            速度：
            <input type="number" v-model.number="temspeed" min="0" max="1" step="0.1" />
          </label>

          <label>
            高度参考模式：
            <select v-model="temcoordZRef">
              <option v-for="item in temcoordZRefs" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>

          <label>
            高度偏移量：
            <input type="number" v-model.number="temcoordZOffset" min="0" max="1000" step="1" />
          </label>

          <button @click="temexportPath">导出路径</button>
          <button @click="temclearPath">删除路径</button>
        </div> -->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
  defineAsyncComponent,
  watch,
  toRaw,
} from "vue";
import { useRoute } from "vue-router";
import WdpApi from "wdpapi";
import WimApi from "@wdp-api/wim-api";
import { FloodPumpCarMovePaths, WaterZone1PipePaths, WaterZone2PipePaths, WaterZone3PipePaths, WaterZone4PipePaths, SewageBlueMovePaths, SewageRedMovePaths } from "@/configs/Path/movePath";
import { InundationGenerator } from "@/utils/Inund_Gen";
import { createPois } from "@/utils/createPois";
import { handleDeleteAllPois } from "@/utils/deletePois";
import { createShpArea } from "@/utils/createShpArea";
import { deleteShpArea } from "@/utils/deleteShpArea";
import { createCircleRange, setCircleRangeVisible } from "@/utils/CreateCircleRange";
import { sendAIFeedback } from "@/api/aiQwen";
import type { AIAction } from "@/ai-action/index";
import { useChat } from "@/composables/useChat";
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
  createMovePathsFromRecord,
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
import { setSceneStyle, setSceneOpacity } from "@/utils/SetScenePara";
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
  getPipelineByKey,
} from "@/utils/CreatePipeline";
import {
  createPipenode,
  setPipeNodeHeight,
  setPipeNodeHighlight,
  setPipeNodeVisible,
  setPipeNodeLiquidLevel,
  getPipeNodeByKey,
} from "@/utils/CreatePipenode";
import { setEntityCustomId, setEntityVisible } from "@/utils/SetEidEntityVisible";
import { createEffect, deleteEffect } from "@/utils/CreateSpecialEffect";
import { updateCamera, updateCamerabycustomId } from "@/utils/updateCamera";
import DrainagePanel from "@/components/Drainage";
import MonitorPanel from "@/components/Moni";
import SimPanel from "@/components/Sim";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { setStationVisibility } from "@/utils/SetStationVisibility";

const RepairButtonVisible = ref(false);

const temstyles = ref(["arrow",
  "round_pipe",
  "square_pipe",
  "railway",
  "brimless_arrow",
  "dashed_line",
  "arrow_dot",
  "arrow_dashed",
  "dashed_dot",
  "flash",
  "scan_line",]);
const temstyle = ref(temstyles.value[10]);

const temcolor = ref("#0000FF");
const tempasscolor = ref("#0000FF");
const tempickedPoints = ref<Record<string, [number, number, number][]>>({});
const tempathIndex = ref(0);
const temwidth = ref(10);
const temspeed = ref(5);
const temcoordZRefs = ref(["altitude", "ground", "surface"]);
const temcoordZRef = ref(temcoordZRefs.value[2]);
const temcoordZOffset = ref(2);
const isSidebarVisible = ref(true)

async function temstartPick() {
  await startPickPoint(App, false, true, "surface");
}
async function temclearPath() {
  await deleteAllMovePaths(App);
  tempickedPoints.value = {};
  tempathIndex.value = 0;
}

async function temendPick() {
  const coordinates = await getPickedPoints(App, "surface");
  if (coordinates.length > 0) {
    console.log("📍 用户取到的点坐标：", coordinates);
  }

  if (!coordinates || coordinates.length < 2) {
    console.warn("至少需要两个点才能生成路径");
    return;
  }
  const pathKey = `path${tempathIndex.value}`;
  // ✅ 存入多路径容器
  tempickedPoints.value[pathKey] = coordinates;

  console.log(`📍 保存 ${pathKey}:`, coordinates);

  await createMultiMovePath(
    App,
    coordinates,
    temcolor.value,
    temstyle.value,
    temwidth.value,
    temspeed.value,
    tempasscolor.value,
    temcoordZRef.value,
    temcoordZOffset.value,
  );

  tempathIndex.value++;

  await endPickPoint(App);
}

const temexportPath = () => {
  const entries = Object.entries(tempickedPoints.value);

  if (entries.length === 0) return;

  const blocks = entries.map(([key, points]) => {
    const body = points
      .map(([x, y, z]) => `[${x}, ${y}, ${z}]`)
      .join(",\n    ");

    return `${key}: [
    ${body}
  ]`;
  });

  const code = `const movePaths = {
  ${blocks.join(",\n\n  ")}
};`;

  console.log("📦 复制以下路径代码：\n" + code);
};

const LegendCard = defineAsyncComponent(
  () => import("@/components/Twin/legend-card.vue")
);
const PullCord = defineAsyncComponent(
  () => import("@/components/Twin/PullCord.vue")
);
const InuClickInfoCard = defineAsyncComponent(
  () => import("@/components/Twin/InuClickInfo-card.vue")
);
const LakeMoniCard = defineAsyncComponent(
  () => import("@/components/Twin/LakeMoniCard.vue")
);
const InundationCard = defineAsyncComponent(
  () => import("@/components/Twin/InundationCard.vue")
);
const PipeAttriInfoCard = defineAsyncComponent(
  () => import("@/components/Twin/PipeClickInfo-card.vue")
);
const PipeProblemCard = defineAsyncComponent(
  () => import("@/components/Twin/PipeProblem-card.vue")
);
const PipeUploadCard = defineAsyncComponent(
  () => import("@/components/Twin/PipeUpload-card.vue")
);
const PipeToolBar = defineAsyncComponent(
  () => import("@/components/Twin/PipeToolBar.vue")
);
const AIQwenCard = defineAsyncComponent(
  () => import("@/components/AIQwen/AICard.vue")
);

const chat = useChat();
const { startWaitingAction, finishWaitingAction, continueWithFeedback, addAssistantMessage } = chat;

const showPipeAttriInfo = ref(false);
const showPipeProblemCard = ref(false);
const showPipeUploadCard = ref(false);
const showAIQwenCard = ref(false);
const showInudationCard = ref(false);
const lakeMoniVisible = ref(false);

const pipeUploadStepActive = ref(0);
const aiAnalysisTrigger = ref(false);
const aiRepairTrigger = ref(false);
const cameraLocation = ref("");
const cameraRotation = ref("");
const plainProblems = ref<PipeDetailProblemItem[]>([]);

// 监听pipeUploadStepActive的变化
watch(pipeUploadStepActive, async (newVal) => {
  if (newVal === 3) {
    console.log("上传完成");
    await setPipelineVisible(App, true, "sewage_line", ["SN", "SL", "ZT"]);
    await setPipeNodeVisible(App, true, "sewage_node", ["HNT"]);
    await setPipelineHeight(App, 15, "sewage_line");
    await setPipeNodeHeight(App, 16.7, "sewage_node");
  }
});

const PipeAttriFID = ref<string>("");
const PipeAttriEID = ref<string>("");
const pipeDetailAttriInfo = ref<object>({});

const PipeProblemFID = ref<string[]>([]);
interface PipeDetailProblemItem {
  fid: string;
  position: string;
  defectName: string;
  color: string;
}
const pipeDetailProblemInfo = ref<PipeDetailProblemItem[]>([]);

// 定义存储管线和管井EID的变量
interface PipeEntity {
  eid: string;
  key: string;
}
const PipeLineEid = ref<PipeEntity[]>([]);
const PipeNodeEid = ref<PipeEntity[]>([]);

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
const WtZoneWaterPlantRegistry = ref<{ customId: string; stationType: string }[]>(
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

// 液位设置状态跟踪
const isLiquidLevelSet = ref(false);

// 路由参数
const route = useRoute();
const activePanel = computed(() => route.query.panel || "drainage");
const routeAction = computed(() => route.query.action || "");

/** 切换属性编辑卡显示状态 */
function toggleAttriCard() {
  showPipeAttriInfo.value = !showPipeAttriInfo.value;
}

/** 查看问题 */
function handlePipeProblemClicked() {
  showPipeProblemCard.value = !showPipeProblemCard.value;
}

function handlePipeUploadClicked() {
  showPipeUploadCard.value = !showPipeUploadCard.value;
}

function handleAICardToggled(visible: boolean) {
  showAIQwenCard.value = visible;
}

function handleInudationCardToggled(visible: boolean) {
  showInudationCard.value = visible;
}

onMounted(() => {
  App = new WdpApi({
    id: "player",
    order: "50521d49202684083a92ea36f5efac41",
    url: "https://dtp-api.51aes.com",
    // resolution: [3824, 1924],
    debugMode: "normal",
    keyboard: { normal: false, func: false },
  });

  App.Plugin.Install(WimApi);

  // 启动云渲染
  App.Renderer.Start()
    .then((res: any) => {
      if (res.success) {
        console.log("✅ WebRTC 连接成功，等待场景加载...");
        loadingText.value = "正在加载场景...";
        registerRenderEvents();
      } else {
        loading.value = false;
      }
    })
    .catch((err: any) => {
      loading.value = false;
    });

  window.addEventListener("ai-action", onAIAction);
});

onUnmounted(() => {
  window.removeEventListener("ai-action", onAIAction);
});

function hasAnalysisResult(): boolean {
  return pipeDetailProblemInfo.value.length > 0;
}

function canExecute(action: AIAction): boolean {
  if (action.name === "AI_REPAIR" && !hasAnalysisResult()) {
    console.warn("尚未分析，拒绝修复");
    return false;
  }
  return true;
}

function onAIAction(e: Event) {
  const action = (e as CustomEvent).detail;

  if (!action || action.type !== "action") return;

  if (action.source !== "ai") {
    console.warn("非 AI 来源的 action，被忽略:", action);
    return;
  }

  switch (action.name) {
    case "AI_ANALYSIS":
      addAssistantMessage("正在进行管网智能分析，请稍候…");
      handleAIAnalysis();
      break;

    case "AI_REPAIR":
      addAssistantMessage("正在进行管网智能修复，请稍候…");
      handleAIRepair();
      break;

    case "PIPE_LIFT":
      if (action.args?.type && action.args?.height) {
        console.log("PIPE_LIFT 参数:", action.args);
        addAssistantMessage(
          `正在将${action.args.type}提升${action.args.height}米，请稍候…`
        );
        handlePipeliftClicked(action.args.type, action.args.height);
      }
      break;

    default:
      console.warn("未知 AI action:", action.name);
  }
}

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

        // // 设置天气为 LightRain
        // try {
        //   await App.Environment.GetSceneWeather();
        //   await App.Environment.SetSceneWeather("Overcast", 3, false);
        //   console.log("🌤️ 天气已设置为阴天");
        // } catch (error) {
        //   console.error("❌ 设置天气失败:", error);
        // }

        loadingText.value = "场景加载完成！";
        setTimeout(() => (loading.value = false), 800);

        const position: [number, number, number] = [
          118.77865852174354, 32.04322893874825, 34.52940467867208,
        ];
        const rotation = { pitch: -8.504061698913574, yaw: -87.82658386230469 };
        await updateCamera(App, position, rotation, 2);

        await new Promise((resolve) => setTimeout(resolve, 10000));

        // 创建管线
        await createPipeline(
          App,
          "//10.66.12.53/x.public/exchange/TMP_XTY/WIM/nanjing/pipeline_NJXJK_test.shp",
          "rain_line"
        );
        // 记录管线EID和key
        const rainLinePipeline = getPipelineByKey("rain_line");
        if (rainLinePipeline) {
          PipeLineEid.value.push({
            eid: rainLinePipeline.eid,
            key: "rain_line",
          });
        }
        console.log("rain_line", rainLinePipeline);

        // 创建管井
        await createPipenode(
          App,
          "//10.66.12.53/x.public/exchange/TMP_XTY/WIM/nanjing/pipenode_NJXJK_modify.shp",
          "rain_node"
        );
        // 记录管井EID和key
        const rainNodePipenode = getPipeNodeByKey("rain_node");
        if (rainNodePipenode) {
          PipeNodeEid.value.push({
            eid: rainNodePipenode.eid,
            key: "rain_node",
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 10000));
        // 创建管线
        await createPipeline(
          App,
          "//10.66.12.53/x.public/exchange/TMP_XTY/WIM/nanjing/pipeline_NJXJK_problem.shp",
          "sewage_line"
        );
        // 记录管线EID和key
        const sewageLinePipeline = getPipelineByKey("sewage_line");
        if (sewageLinePipeline) {
          PipeLineEid.value.push({
            eid: sewageLinePipeline.eid,
            key: "sewage_line",
          });
        }

        // 创建管井
        await createPipenode(
          App,
          "//10.66.12.53/x.public/exchange/TMP_XTY/WIM/nanjing/pipenode_NJXJK_problem.shp",
          "sewage_node",
          1,
          1.5,
        );
        // 记录管井EID和key
        const sewageNodePipenode = getPipeNodeByKey("sewage_node");
        if (sewageNodePipenode) {
          PipeNodeEid.value.push({
            eid: sewageNodePipenode.eid,
            key: "sewage_node",
          });
        }

        console.log("sewage_node", sewageNodePipenode);

        await setPipelineHeight(App, 9.4, "rain_line");
        await setPipeNodeHeight(App, 11.4, "rain_node");
        await setPipelineHeight(App, 6.6, "sewage_line");
        await setPipeNodeHeight(App, 9.4, "sewage_node");

        await App.Setting.SetScreenPercentage(150);
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

async function handleGetCameraInfo() {
  const res = await App.CameraControl.GetCameraInfo();
  console.log("相机信息为:", res);

  const points = await getPickedPoints(App, "surface");

  if (points.length > 0) {
    console.log("📍 用户取到的点坐标：", points);
  }
}

async function handleUpdateCamera() {
  // 解析位置参数
  let position: [number, number, number] = [0, 0, 0];
  if (cameraLocation.value) {
    const coords = cameraLocation.value
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (coords.length === 3 && coords.every((coord) => !isNaN(coord))) {
      position = [coords[0]!, coords[1]!, coords[2]!];
    } else {
      console.warn("位置参数格式不正确，使用默认值 [0, 0, 0]");
    }
  }

  // 解析旋转参数
  let rotation = { pitch: 0, yaw: 0 };
  if (cameraRotation.value) {
    const angles = cameraRotation.value
      .split(",")
      .map((angle) => parseFloat(angle.trim()));
    if (angles.length === 2 && angles.every((angle) => !isNaN(angle))) {
      rotation = { pitch: angles[0]!, yaw: angles[1]! };
    } else {
      console.warn("旋转参数格式不正确，使用默认值 { pitch: 0, yaw: 0 }");
    }
  }

  console.log("更新相机位置:", position, "旋转:", rotation);

  // 使用输入的参数更新相机
  await updateCamera(App, position, rotation, 2);
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

async function handleCreatePipeline() {
  const position: [number, number, number] = [
    121.02740457338311, 31.319578935523527, 1708.6214824575459,
  ];
  const rotation = { pitch: -81.04249572753906, yaw: 75.2750015258789 };
  await updateCamera(App, position, rotation, 2);

  await createPipeline(
    App,
    "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
    "rain_line"
  );
  // 记录管线EID和key
  const rainLinePipeline = getPipelineByKey("rain_line");
  if (rainLinePipeline) {
    PipeLineEid.value.push({ eid: rainLinePipeline.eid, key: "rain_line" });
  }

  App.Environment.SetSceneWeather("ModerateRain", 3, false);
  await setPipelineHeight(App, 200, "rain_line");

  await setPipelineHighlight(
    App,
    true,
    "#ed1941",
    100,
    ["SN", "SL", "ZT"],
    "rain_line"
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
  await setPipelineHighlight(
    App,
    true,
    "#0000FF",
    100,
    [""],
    "rain_line",
    fids1
  );

  await setPipelineHighlight(
    App,
    true,
    "#FFD700",
    100,
    [""],
    "rain_line",
    fids2
  );

  await createPipeline(
    App,
    "//10.66.12.53/x.public/exchange/TMP_THJ/WIM/kunshan/pipeline_network_20251021_110401.shp",
    "sewage_line"
  );
  // 记录管线EID和key
  const sewageLinePipeline = getPipelineByKey("sewage_line");
  if (sewageLinePipeline) {
    PipeLineEid.value.push({ eid: sewageLinePipeline.eid, key: "sewage_line" });
  }

  await setPipelineHeight(App, 150, "sewage_line");
  await setPipelineHighlight(
    App,
    true,
    "#ed1941",
    100,
    ["SN", "SL", "ZT"],
    "sewage_line"
  );
}

async function handleClearPipeline() {
  App.Environment.SetSceneWeather("Overcast", 3, false);
  await setPipelineHeight(App, 0, "rain_line");
  await setPipelineHeight(App, -20, "sewage_line");
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "rain_line"
  );
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "sewage_line"
  );
}

let DigCameraUpdated = false;

async function handleDigClicked() {
  // if (!DigCameraUpdated) {
  //   const position: [number, number, number] = [
  //     118.77865852174354, 32.04322893874825, 34.52940467867208,
  //   ];
  //   const rotation = { pitch: -8.504061698913574, yaw: -87.82658386230469 };
  //   await updateCamera(App, position, rotation, 2);
  //   DigCameraUpdated = true; // 标记为已调用
  // }
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

// async function handlePipeliftClicked(type: string, height: string) {
//   const heightValue = parseFloat(height);

//   // 根据 type 判断是管线还是管井
//   if (type.endsWith("_line")) {
//     await setPipelineHeight(App, heightValue, type);
//   } else if (type.endsWith("_node")) {
//     await setPipeNodeHeight(App, heightValue, type);
//   }
// }

async function handlePipeliftClicked(type: string, height: string) {
  const heightValue = parseFloat(height);
  const prefix = type.split("_")[0]; // 提取类型前缀，例如 "rain" 或 "sewage"

  // 根据前缀选择对应的管线和管井操作
  if (prefix === "rain" || prefix === "sewage") {
    // 根据 prefix 调整管井的高度
    let adjustedHeightValue = heightValue;

    if (prefix === "rain") {
      adjustedHeightValue += 2; // 如果是 rain，heightValue 加 2
    } else if (prefix === "sewage") {
      adjustedHeightValue += 3; // 如果是 sewage，heightValue 加 3
    }

    // 调用设置管线和管井高度
    await setPipelineHeight(App, heightValue, `${prefix}_line`);
    await setPipeNodeHeight(App, adjustedHeightValue, `${prefix}_node`);
  } else {
    console.warn("⚠️ 无效的管网类型:", type);
  }
}

async function handleResetPipeliftClicked() {
  await setPipelineHeight(App, 9.4, "rain_line");
  await setPipeNodeHeight(App, 11.4, "rain_node");
  await setPipelineHeight(App, 6.6, "sewage_line");
  await setPipeNodeHeight(App, 9.4, "sewage_node");
}

async function handlePipelightClicked(
  type: string,
  intensity: number,
  color: string
) {
  // 根据 type 判断是管线还是管井
  if (type.endsWith("_line")) {
    // 管线类型，调用 setPipelineHighlight
    await setPipelineHighlight(
      App,
      true,
      color,
      intensity,
      ["SN", "SL", "ZT"],
      type
    );
  } else if (type.endsWith("_node")) {
    // 管井类型，调用 setPipeNodeHighlight
    await setPipeNodeHighlight(App, true, color, intensity, ["HNT"], type);
  }
}

async function handleResetPipelightClicked() {
  // 重置管线高亮
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "rain_line"
  );
  await setPipelineHighlight(
    App,
    false,
    "#ffe600",
    15,
    ["SN", "SL", "ZT"],
    "sewage_line"
  );

  // 重置管井高亮
  await setPipeNodeHighlight(App, false, "#ffe600", 15, ["HNT"], "rain_node");
  await setPipeNodeHighlight(App, false, "#ffe600", 15, ["HNT"], "sewage_node");
}

async function handlePipeVisibilityToggled(
  visible: boolean,
  pipeType?: string,
  pipeIds?: string[]
) {
  // 如果pipeType和pipeIds都存在，则设置特定管段的可见性
  if (pipeType && pipeIds && pipeIds.length > 0) {
    if (pipeType.endsWith("_line")) {
      // 管线类型
      await setPipelineVisible(App, visible, pipeType, [], pipeIds);
    } else if (pipeType.endsWith("_node")) {
      // 管井类型
      await setPipeNodeVisible(App, visible, pipeType, [], pipeIds);
    }
  }
  // 如果只有pipeType，则设置该类型管网/管井的可见性
  else if (pipeType) {
    if (pipeType.endsWith("_line")) {
      // 管线类型
      await setPipelineVisible(App, visible, pipeType, ["SN", "SL", "ZT"]);
    } else if (pipeType.endsWith("_node")) {
      // 管井类型
      await setPipeNodeVisible(App, visible, pipeType, ["HNT"]);
    }
  }
  // 如果都没有，则默认设置所有管网和管井的可见性
  else {
    // 默认设置所有管线的可见性
    await setPipelineVisible(App, visible, "rain_line", ["SN", "SL", "ZT"]);
    await setPipelineVisible(App, visible, "sewage_line", ["SN", "SL", "ZT"]);
    // 默认设置所有管井的可见性
    await setPipeNodeVisible(App, visible, "rain_node", ["HNT"]);
    await setPipeNodeVisible(App, visible, "sewage_node", ["HNT"]);
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

      await focusPipelineSegment(App, info.eid, info.fId, 0.5);
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

async function handlePipeEditorToggled(enabled: boolean) {
  // if (enabled) {
  //   // const position: [number, number, number] = [
  //   //   118.77865852174354, 32.04322893874825, 34.52940467867208,
  //   // ];
  //   // const rotation = { pitch: -8.504061698913574, yaw: -87.82658386230469 };
  //   // await updateCamera(App, position, rotation, 2);

  //   await enablePipelineClick(App, true);
  //   await registerPipelineClickEvent(App, async (res) => {
  //     const info = extractPipelineClickInfo(res);
  //     if (!info) return;

  //     currentPipeEid.value = info.eid;
  //     currentPipeFid.value = info.fId;

  //     try {
  //       const response = await fetch(
  //         `/pipes/pipenet_nanjing/${info.fId}`
  //       );
  //       if (!response.ok) throw new Error("查询失败");

  //       const data = await response.json();
  //       pipeDetailAttriInfo.value = data;
  //       PipeAttriFID.value = info.fId;
  //       PipeAttriEID.value = info.eid;
  //       showPipeAttriInfo.value = true;
  //     } catch (err) {
  //       console.error(err);
  //       alert("无法获取管网详细属性！");
  //     }
  //   });

  //   // await setPipelineHeight(App, 2, "rain_line");
  //   const fids1 = ["c8c92f4e", "b50f7eb5"];
  //   await setPipelineHighlight(
  //     App,
  //     true,
  //     "#b53845ff",
  //     35,
  //     [""],
  //     "rain_line",
  //     fids1
  //   );
  // }
}

let PipSpeEffectUpdated = false;
async function handlePipSpeEffectClicked() {
  if (!PipSpeEffectUpdated) {
    const position: [number, number, number] = [
      118.7786088732545, 32.04022130942158, 28.691859970977863
    ];
    const rotation = { pitch: -15.06611442565918, yaw: 91.86712646484375 };
    await updateCamera(App, position, rotation, 2);
    PipSpeEffectUpdated = true; // 标记为已调用
  }

  await setEntityCustomId(App, "-9083760258375605252", "pipe_overflow");
  await new Promise(resolve => setTimeout(resolve, 1000));
  await setEntityVisible(App, "pipe_overflow", true);

  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/water_point_grid/nanjing/Inud_Gen_pipe-overflow.json",
    11
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

  // const location: [number, number, number] = [
  //   118.77859792288065, 32.040020624823136, 0,
  // ];
  // await createEffect(
  //   App,
  //   location, // 位置
  //   [2, 2, 0.11], // 缩放
  //   true, // 是否可见
  //   "66e520631a7046c139881a9a379a2063" // seedId
  // );
}

async function handleResetSpeEffectClicked() {
  await setEntityCustomId(App, "-9083760258375605252", "pipe_overflow");
  await setEntityVisible(App, "pipe_overflow", false);

  await deleteInundationAlgorithm();
}

async function handleResetPipeUploadClicked() {
  console.log("pipeUploadStepActive.value", pipeUploadStepActive.value);
  pipeUploadStepActive.value = 0;
}


async function handleLiquidlevelClicked(
  pipeType: string,
  pipeLiquidLevel: number,
  color: string
) {
  const prefix = pipeType.split("_")[0]; // rain / sewage

  if (prefix !== "rain" && prefix !== "sewage") {
    console.warn("⚠️ 无效的管网类型:", pipeType);
    return;
  }

  // 1️⃣ 管线液位
  await setPipeLiquidLevel(App, pipeLiquidLevel, color, `${prefix}_line`);

  // 2️⃣ 管井液位
  await setPipeNodeLiquidLevel(App, pipeLiquidLevel, color, `${prefix}_node`);
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
  // 重置管线液位
  await setPipeLiquidLevel(App, 0, "#000000", "rain_line");
  await setPipeLiquidLevel(App, 0, "#000000", "sewage_line");

  // 重置管井液位
  await setPipeNodeLiquidLevel(App, 0, "#000000", "rain_node");
  await setPipeNodeLiquidLevel(App, 0, "#000000", "sewage_node");

  isLiquidLevelSet.value = false;
  await deletePipelineLabel(App, "Fluid");
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
  await setPipeFlowState(App, 0, 0, "#000000", false, "rain_line");
  await setPipeFlowState(App, 0, 0, "#000000", false, "sewage_line");
}


async function handleOpenPipeOverview() {
  const position: [number, number, number] = [
    118.7787359290032, 32.04423322259233, 37.00904987825357
  ];
  const rotation = { pitch: -22.230609893798828, yaw: 89.97012329101562 };
  await updateCamera(App, position, rotation, 2);
  // await setSceneStyle(App, "dark");
  await setSceneOpacity(App, "水系", 0);
  await setSceneOpacity(App, "建筑", 0);
  await setSceneOpacity(App, "地形", 0);
  await setSceneOpacity(App, "道路", 0.4);
}

/** 关闭管网总览 */
async function handleClosePipeOverview() {
  const position: [number, number, number] = [
    118.77865852174354, 32.04322893874825, 34.52940467867208,
  ];
  const rotation = { pitch: -8.504061698913574, yaw: -87.82658386230469 };
  await updateCamera(App, position, rotation, 2);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await setSceneOpacity(App, "道路", 1);
}

async function handleSceneStyleClicked(style: string, weather: string, blurType: string, blurValue: number) {
  await setSceneStyle(App, style);
  await setSceneOpacity(App, blurType, blurValue);
  await App.Environment.SetSceneWeather(weather);
}

async function handleResetSceneStyleClicked() {
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "道路", 1);
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await App.Environment.SetSceneWeather("Sunny");
}

const getUEDebugLogs = async () => {
  console.log("📩 收到获取UE日志按钮点击事件", App);
  const res = await App.Debug.GetDebugLogs()
  const _result = res.result.logCaches
  const blob = new Blob([_result], { type: "text/plain" })
  const aElement = document.createElement("a")
  aElement.download = "uelog.log"
  const urlObject = window.URL || window.webkitURL || window
  aElement.href = urlObject.createObjectURL(blob)
  aElement.click()
  urlObject.revokeObjectURL
}

declare global {
  interface Window {
    getUEDebugLogs: () => Promise<void>
  }
}

window.getUEDebugLogs = getUEDebugLogs

async function handleInundationExecute(data: {
  moniType: string
  moniScheme: string
  material: string
}) {
  console.log("📩 收到淹没监测按钮点击事件", data)

  const { moniType, moniScheme, material } = data

  if (moniType === '管道模拟') {
    console.log("📩 收到管网流量监测按钮点击事件");
    const position: [number, number, number] = [
      118.77919005457976, 32.04765175885222, 31.797795526379925
    ];
    const rotation = { pitch: -12.15009593963623, yaw: -133.59109497070312 };
    await updateCamera(App, position, rotation, 2);

    isLiquidLevelSet.value = true;
    await handlePipeLabelToggled(true);
    await setPipelineVisible(App, false, "rain_line", ["SN", "SL", "ZT"]);
    await setPipeNodeVisible(App, false, "rain_node", ["HNT"]);
    await setPipeLiquidLevel(App, 0.8, "#00BFFF", "rain_line");
    await setPipeLiquidLevel(App, 0.8, "#00BFFF", "sewage_line");
    await setPipeNodeLiquidLevel(App, 0.8, "#00BFFF", "rain_node");
    await setPipeNodeLiquidLevel(App, 1.0, "#00BFFF", "sewage_node");
    await setSceneOpacity(App, "水系", 0);
    await setSceneOpacity(App, "建筑", 0);
    await setSceneOpacity(App, "地形", 0);
    await setSceneOpacity(App, "道路", 0);
    return
  }

  if (moniType !== '内涝模拟') {
    console.warn('⚠️ 当前不是内涝模拟，忽略执行')
    return
  }

  // 内涝 + 大范围
  if (moniScheme === 'area') {
    if (material === 'water') {
      const position: [number, number, number] = [
        118.78420101150327, 32.038812193756044, 1631.7945815634464
      ];
      const rotation = { pitch: -82.83757781982422, yaw: -177.7146453857422 };
      await updateCamera(App, position, rotation, 2);

      await createAndRunInundation(
        App,
        "http://10.100.10.124:8090/inundation/water_point_grid/nanjing/Inud_Gen_Grid-1968.json",
        4
      )
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
      return
    }

    if (material === 'heatmap') {
      const position: [number, number, number] = [
        118.78420101150327, 32.038812193756044, 1631.7945815634464
      ];
      const rotation = { pitch: -82.83757781982422, yaw: -177.7146453857422 };
      await updateCamera(App, position, rotation, 2);

      await createAndRunHeatmap(
        App,
        "http://10.100.10.124:8090/inundation/water_point_grid/nanjing/Inud_Gen_Grid-306.json",
      )
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
      return
    }
  }
  console.warn('⚠️ 未匹配到可执行的内涝方案', data)
}


async function handleInundationReset() {
  console.log("📩 收到淹没监测重置按钮点击事件");
  await deleteInundationAlgorithm();
  await deleteHeatmapAlgorithm();
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await setSceneOpacity(App, "道路", 1);
  await setPipelineVisible(App, true, "rain_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, true, "rain_node", ["HNT"]);
  await setPipeLiquidLevel(App, 0, "#ff4d00ff", "rain_line");
  await setPipeLiquidLevel(App, 0, "#ff4d00ff", "sewage_line");
  isLiquidLevelSet.value = false;
  await handlePipeLabelToggled(false);
}

async function handleCreatePumpPoi() {
  const position: [number, number, number] = [
    118.85075058795135, 32.025794180655396, 4152.196569062987
  ];
  const rotation = { pitch: -32.83012008666992, yaw: -160.41421508789062 };
  await updateCamera(App, position, rotation, 2);

  console.log("📩 收到泵站监测按钮点击事件");

  const markerNormal = "http://10.100.10.124:8090/inundation/poi/pumpsta_normal.png";
  const markerActive = "http://10.100.10.124:8090/inundation/poi/pumpsta_active.png";

  const coords: [number, number, number?][] = [
    [118.76954937107334, 32.03529536279262, 71],
  ];

  const stationTypes = ["雨水泵站"];

  const infoUrls = [
    "http://10.100.10.124:8090/inundation/poi/window/pump1.html",
  ];

  const curveUrls = [
    "http://10.100.10.124:8090/inundation/poi/window/pump1_curve.html",
  ];

  PumpPoiRegistry.value = await createPois(
    App,
    coords,
    markerNormal,
    markerActive,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [500, 320],
    ["吴家村泵站"]
  );

  console.log("📋 已记录的对象信息:", PumpPoiRegistry.value);

  // 显示LegendCard
  currentLegendType.value = "pump";
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleDeletePumpPoi() {
  await handleDeleteAllPois(App, PumpPoiRegistry.value);

  // 隐藏LegendCard
  showLegendCard.value = false;
}

async function handleOpenSewagePlant() {
  const position: [number, number, number] = [
    118.84968731513763, 31.905509168464253, 229.0067324774101
  ];
  const rotation = { pitch: -19.70302963256836, yaw: 33.881568908691406 };
  await updateCamera(App, position, rotation, 2);

  await createMovePathsFromRecord(
    App,
    SewageBlueMovePaths,
    {
      color: "#0000FF",
      pathType: "scan_line",
      width: 3,
      speedupFactor: 20,
      passColor: "#0000FF",
      coordZRef: "ground",
      coordZOffset: 2,
    }
  );

  await createMovePathsFromRecord(
    App,
    SewageRedMovePaths,
    {
      color: "#2F4F4F",
      pathType: "scan_line",
      width: 3,
      speedupFactor: 20,
      passColor: "#2F4F4F",
      coordZRef: "ground",
      coordZOffset: 2,
    }
  );
}

async function handleCloseSewagePlant() {
  console.log("📩 收到污水厂监测按钮关闭点击事件");
  await deleteAllMovePaths(App);
}

async function handleOpenWaterZone() {
  const position: [number, number, number] = [
    118.814569409625, 32.116919716118446, 38817.498705294434
  ];
  const rotation = { pitch: -75.19129180908203, yaw: 66.09073638916016 };
  await updateCamera(App, position, rotation, 2);

  const shpUrls = [
    "http://10.100.10.124:8090/inundation/shp/Nanjing/water-zone/NJ_Water_Zone5.shp",
    "http://10.100.10.124:8090/inundation/shp/Nanjing/water-zone/NJ_Water_Zone6.shp",
    "http://10.100.10.124:8090/inundation/shp/Nanjing/water-zone/NJ_Water_Zone7.shp",
    "http://10.100.10.124:8090/inundation/shp/Nanjing/water-zone/NJ_Water_Zone8.shp",
  ];

  const colors = ["FFE4B5", "87CEFA", "1E90FF", "FF7F50"];

  shpAreaRegistry.value = await createShpArea(App, shpUrls, colors);
  console.log("📋 已记录的SHP区域信息:", shpAreaRegistry.value);

  const coords: [number, number, number?][] = [
    [118.93504380489597, 32.12918390846368, 0],
    [118.75217201023786, 32.09804242577659, 0],
    [118.66886129329788, 31.97260178423661, 0],
    [118.8534162775199, 31.903254078186478, 0],
  ];

  const markerNormals = [
    "http://10.100.10.124:8090/inundation/poi/wtlevel_normal.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_normal.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_normal.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_normal.png",
  ];

  const markerActives = [
    "http://10.100.10.124:8090/inundation/poi/wtlevel_active.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_active.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_active.png",
    "http://10.100.10.124:8090/inundation/poi/wtlevel_active.png",
  ];

  const labelTexts = [
    "水厂-01",
    "水厂-02",
    "水厂-03",
    "水厂-04",
  ];

  const infoUrls: string[] = [];
  const curveUrls: string[] = [];
  const stationTypes: string[] = [];

  WtZoneWaterPlantRegistry.value = await createPois(
    App,
    coords,
    markerNormals,
    markerActives,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [500, 320],
    labelTexts
  );

  console.log("📋 已记录的对象信息:", WtZoneWaterPlantRegistry.value);
  showLegendCard.value = false;

  setTimeout(() => fixWdpInputBug(), 500);


  await createMovePathsFromRecord(
    App,
    WaterZone1PipePaths,
    {
      color: "#FFE4B5",
      pathType: "scan_line",
      width: 200,
      speedupFactor: 0.1,
      passColor: "#00BFFF",
    }
  );

  await createMovePathsFromRecord(
    App,
    WaterZone2PipePaths,
    {
      color: "#87CEFA",
      pathType: "scan_line",
      width: 200,
      speedupFactor: 0.1,
      passColor: "#00BFFF",
    }
  );

  await createMovePathsFromRecord(
    App,
    WaterZone3PipePaths,
    {
      color: "#1E90FF",
      pathType: "scan_line",
      width: 200,
      speedupFactor: 0.1,
      passColor: "#00BFFF",
    }
  );

  await createMovePathsFromRecord(
    App,
    WaterZone4PipePaths,
    {
      color: "#FF7F50",
      pathType: "scan_line",
      width: 200,
      speedupFactor: 0.1,
      passColor: "#00BFFF",
    }
  );

}

async function handleCloseWaterZone() {
  console.log("🧹 准备删除所有 SHP 区域:", shpAreaRegistry.value);

  await handleDeleteAllPois(App, WtZoneWaterPlantRegistry.value);

  try {
    await deleteShpArea(App, shpAreaRegistry.value);
    shpAreaRegistry.value = [];
  } catch (err) {
    console.error("❌ 删除 SHP 区域失败:", err);
  }

  await deleteAllMovePaths(App);
}

async function handleOpenStrucDefect() {
  console.log("📩 收到结构缺陷监测按钮开启点击事件");
  const position: [number, number, number] = [
    118.77960961528369, 32.02759256008273, 1608.1403079354598
  ];
  const rotation = { pitch: -49.33854675292969, yaw: -88.8377914428711 };
  await updateCamera(App, position, rotation, 2);
  await setSceneOpacity(App, "水系", 0);
  await setSceneOpacity(App, "建筑", 0);
  await setSceneOpacity(App, "地形", 0);
  await setSceneOpacity(App, "道路", 0);

  await setPipelineVisible(App, false, "sewage_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, false, "sewage_node", ["HNT"]);
  // await setPipeNodeVisible(App, false, "rain_node", ["HNT"]);

  // const fids1 = ["53393b07", "b50f7eb7", "b50f7eb8", "b50f7eb6", "b50f7eb5"];
  const fids1 = ["bfa19a5b", "053dfcd1", "c34e375f"];
  await setPipelineHighlight(
    App,
    true,
    "#ff0000ff",
    100,
    [""],
    "rain_line",
    fids1
  );

  // const fids2 = ["1694edc3", "a82f50b5"];
  const fids2 = ["1505ddc2", "3ee4bbea", "c78ace05"];
  await setPipelineHighlight(
    App,
    true,
    "#0d00ffff",
    100,
    [""],
    "rain_line",
    fids2
  );

  // const fids4 = ["b87625c6", "3084886c"];
  const fids4 = ["dfec7a4f", "27c096d7"];
  await setPipelineHighlight(
    App,
    true,
    "#04f8dfff",
    100,
    [""],
    "rain_line",
    fids4
  );

  // const fids5 = ["c8c92f4e"]; 黄色
  const fids5 = ["f08e5df5", "bf3da646", "c5ae61b7"];
  await setPipelineHighlight(
    App,
    true,
    "#fbff00ff",
    100,
    [""],
    "rain_line",
    fids5
  );
}

async function handleCloseStrucDefect() {
  console.log("📩 收到结构缺陷监测按钮关闭点击事件");
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await setSceneOpacity(App, "道路", 1);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await setPipelineVisible(App, true, "sewage_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, true, "sewage_node", ["HNT"]);
  await setPipelineHighlight(App, false, "#ffe600", 15, ["SN", "SL", "ZT"], "rain_line");
}

async function handleOpenFuncDefect() {
  console.log("📩 收到功能缺陷监测按钮开启点击事件");
  // const position: [number, number, number] = [
  //   118.77960961528369, 32.02759256008273, 1608.1403079354598
  // ];
  // const rotation = {pitch: -49.33854675292969, yaw: -88.8377914428711};
  // await updateCamera(App, position, rotation, 2);
  await setSceneOpacity(App, "水系", 0);
  await setSceneOpacity(App, "建筑", 0);
  await setSceneOpacity(App, "地形", 0);
  await setSceneOpacity(App, "道路", 0);

  await setPipelineVisible(App, false, "sewage_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, false, "sewage_node", ["HNT"]);
  // await setPipeNodeVisible(App, false, "rain_node", ["HNT"]);

  // const fids1 = ["53393b07", "b50f7eb7", "b50f7eb8", "b50f7eb6", "b50f7eb5"];
  const fids1 = ["bfa19a5b"];
  await setPipelineHighlight(
    App,
    true,
    "#ff0000ff",
    100,
    [""],
    "rain_line",
    fids1
  );

  // const fids2 = ["1694edc3", "a82f50b5"];
  const fids2 = ["1505ddc2"];
  await setPipelineHighlight(
    App,
    true,
    "#0d00ffff",
    100,
    [""],
    "rain_line",
    fids2
  );

  // const fids4 = ["b87625c6", "3084886c"];
  const fids4 = ["dfec7a4f"];
  await setPipelineHighlight(
    App,
    true,
    "#04f8dfff",
    100,
    [""],
    "rain_line",
    fids4
  );

  // const fids5 = ["c8c92f4e"];
  const fids5 = ["f08e5df5"];
  await setPipelineHighlight(
    App,
    true,
    "#fbff00ff",
    100,
    [""],
    "rain_line",
    fids5
  );
}

async function handleCloseFuncDefect() {
  console.log("📩 收到功能缺陷监测按钮关闭点击事件");
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await setSceneOpacity(App, "道路", 1);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await setPipelineVisible(App, true, "sewage_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, true, "sewage_node", ["HNT"]);
  await setPipelineHighlight(App, false, "#ffe600", 15, ["SN", "SL", "ZT"], "rain_line");
}

async function handleCreateRainPoi() {
  const position: [number, number, number] = [
    118.75719166278208, 32.12001381322293, 3765.5325827672123
  ];
  const rotation = { pitch: -31.742576599121094, yaw: 62.8891487121582 };
  await updateCamera(App, position, rotation, 2);

  console.log("📩 收到雨量监测按钮点击事件");

  const coords: [number, number, number?][] = [
    [118.80843298556519, 32.066624916989404, 71],
  ];

  const stationTypes = ["60mm"];

  const markerNormal = "http://10.100.10.124:8090/inundation/poi/rainsta_normal.png";
  const markerActive = "http://10.100.10.124:8090/inundation/poi/rainsta_active.png";


  const infoUrls = [
    "http://10.100.10.124:8090/inundation/poi/window/rain1.html",
  ];

  const curveUrls = [
    "http://10.100.10.124:8090/inundation/poi/window/rain1_curve.html",
  ];

  RainPoiRegistry.value = await createPois(
    App,
    coords,
    markerNormal,
    markerActive,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [500, 320],
    ["雨量站1"]
  );

  console.log("📋 已记录的对象信息:", RainPoiRegistry.value);

  // 显示LegendCard
  currentLegendType.value = "rain";
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleDeleteRainPoi() {
  await handleDeleteAllPois(App, RainPoiRegistry.value);
  showLegendCard.value = false;
}

async function handleOpenPipeLiquid() {
  console.log("📩 收到管网流量监测按钮点击事件");
  const position: [number, number, number] = [
    118.77919005457976, 32.04765175885222, 31.797795526379925
  ];
  const rotation = { pitch: -12.15009593963623, yaw: -133.59109497070312 };
  await updateCamera(App, position, rotation, 2);

  isLiquidLevelSet.value = true;
  await handlePipeLabelToggled(true);
  await setPipelineVisible(App, false, "rain_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, false, "rain_node", ["HNT"]);
  await setPipeLiquidLevel(App, 0.8, "#00BFFF", "rain_line");
  await setPipeLiquidLevel(App, 0.8, "#00BFFF", "sewage_line");
  await setPipeNodeLiquidLevel(App, 0.8, "#00BFFF", "rain_node");
  await setPipeNodeLiquidLevel(App, 1.0, "#00BFFF", "sewage_node");
  await setSceneOpacity(App, "水系", 0);
  await setSceneOpacity(App, "建筑", 0);
  await setSceneOpacity(App, "地形", 0);
  await setSceneOpacity(App, "道路", 0);
}

async function handleOpenLakeMoni() {
  const position: [number, number, number] = [
    118.80644195246121, 32.079864851948614, 2169.619468547759
  ];
  const rotation = { pitch: -59.44451904296875, yaw: 152.5664520263672 };
  await updateCamera(App, position, rotation, 2);

  lakeMoniVisible.value = true;
  console.log("📊 收到湖泊水位打开事件:", lakeMoniVisible.value);
}

// 缓存当前湖面高度（初始值可以按你的业务需要）
let currentLakeLevel = 5;

async function handleLakeLevelUpdated(level: number) {
  const coords: [number, number, number][] = [
    [118.795178359064, 32.07457512599733, currentLakeLevel],
    [118.795178359064, 32.07457512599733, level],
  ];

  const lakeEID = "-9151314252773446357";

  if (level >= currentLakeLevel) {
    await createEntityMovePath(App, lakeEID, coords, 90, 180, 180, 2, false);
  } else {
    await createEntityMovePath(App, lakeEID, coords, -90, 180, 180, 2, false);
  }
  currentLakeLevel = level;
}

async function handleCloseWaterMoni() {
  console.log("📩 收到水位监测按钮关闭点击事件");
  await setSceneStyle(App, "false");
  await setSceneOpacity(App, "水系", 1);
  await setSceneOpacity(App, "建筑", 1);
  await setSceneOpacity(App, "地形", 1);
  await setSceneOpacity(App, "道路", 1);
  await setPipelineVisible(App, true, "rain_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, true, "rain_node", ["HNT"]);
  await setPipeLiquidLevel(App, 0, "#ff4d00ff", "rain_line");
  await setPipeLiquidLevel(App, 0, "#ff4d00ff", "sewage_line");
  isLiquidLevelSet.value = false;
  await handlePipeLabelToggled(false);
}

async function handleCreateWaterlogPoi() {
  const position: [number, number, number] = [
    118.82889870455706, 32.0402373488539, 2864.4946268974477
  ];
  const rotation = { pitch: -31.23785972595215, yaw: -158.72247314453125 };
  await updateCamera(App, position, rotation, 2);

  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/water_point_grid/nanjing/Inud_Gen.json",
    5
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

  console.log("📩 收到积水点监测按钮点击事件");

  const coords: [number, number, number?][] = [
    [118.77879764299199, 32.06067457713681, 71],
  ];

  const markerNormal = "http://10.100.10.124:8090/inundation/poi/wtlog_normal.png";
  const markerActive = "http://10.100.10.124:8090/inundation/poi/wtlog_active.png";

  const stationTypes = ["36mm"];

  const infoUrls = [
    "http://10.100.10.124:8090/inundation/poi/window/water1.html",
  ];

  const curveUrls: string[] = [];

  WaterLoggingPoiRegistry.value = await createPois(
    App,
    coords,
    markerNormal,
    markerActive,
    infoUrls,
    curveUrls,
    stationTypes,
    openStationCurve,
    [500, 320],
    ["   积水点"]
  );

  console.log("📋 已记录的对象信息:", WaterLoggingPoiRegistry.value);

  // 显示LegendCard
  currentLegendType.value = "waterlog";
  showLegendCard.value = true;

  setTimeout(() => fixWdpInputBug(), 500);


}

async function handleDeleteWaterlogPoi() {
  await handleDeleteAllPois(App, WaterLoggingPoiRegistry.value);
  await deleteInundationAlgorithm();
  showLegendCard.value = false;
}

async function handleWaterlogClick(index: number) {
  if (index === 3) {

    const position: [number, number, number] = [
      118.78050893789745, 32.060429491436764, 109.50152529205775
    ];
    const rotation = { pitch: -29.049842834472656, yaw: -170.84732055664062 };
    await updateCamera(App, position, rotation, 2);
  }
}

async function handleOpenPumpCar() {
  const position: [number, number, number] = [
    118.78212673256611, 32.07360501510054, 12944.56967247115
  ];
  const rotation = { pitch: -88.99999237060547, yaw: -179.94093322753906 };
  await updateCamera(App, position, rotation, 2);

  await createAndRunInundation(
    App,
    "http://10.100.10.124:8090/inundation/water_point_grid/nanjing/Inud_Gen.json",
    5
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
    [118.7910777155568, 32.05912317247263, 0],
    [118.77862249782888, 32.03138232207008, 0],
    [118.75051321332089, 32.06456591665459, 0],
    [118.75818955275446, 32.091178823033204, 0],
    [118.77880150743988, 32.06069156440686, 0],
  ];

  const markerNormals = [
    "http://10.100.10.124:8090/inundation/poi/car1_normal.png",
    "http://10.100.10.124:8090/inundation/poi/car2_normal.png",
    "http://10.100.10.124:8090/inundation/poi/car3_normal.png",
    "http://10.100.10.124:8090/inundation/poi/car2_normal.png",
    "http://10.100.10.124:8090/inundation/poi/wtlog_normal.png",
  ];

  const markerActives = [
    "http://10.100.10.124:8090/inundation/poi/car1_active.png",
    "http://10.100.10.124:8090/inundation/poi/car2_active.png",
    "http://10.100.10.124:8090/inundation/poi/car3_active.png",
    "http://10.100.10.124:8090/inundation/poi/car2_active.png",
    "http://10.100.10.124:8090/inundation/poi/wtlog_active.png",
  ];

  const labelTexts = [
    "泵车-01",
    "泵车-02",
    "泵车-03",
    "泵车-04",
    "   积水点",
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
    [500, 320],
    labelTexts
  );

  console.log("📋 已记录的对象信息:", FloodPumpCarRegistry.value);
  showLegendCard.value = false;

  setTimeout(() => fixWdpInputBug(), 500);
}

async function handleClosePumpCar() {
  await handleDeleteAllPois(App, FloodPumpCarRegistry.value);
  await deleteInundationAlgorithm();
  await deleteVehicle(App);
  await deleteAllMovePaths(App);
  await deleteMovePath(App);
  await setCircleRangeVisible(false);
  isVehicleCar = false;
}

async function handleOpenDispatchPlan() {
  const position: [number, number, number] = [
    118.78146131209282, 32.07055385176709, 10014.844332762055
  ];
  const rotation = { pitch: -88.99999237060547, yaw: -179.94093322753906 };
  await updateCamera(App, position, rotation, 2);

  const position0: [number, number, number] = [
    118.77880150743988, 32.06069156440686, 0
  ];
  // await createCircleRange(App, position0, 500, true);
  await createCircleRange(App, position0, 4000, true);

  await createMultiMovePath(App, FloodPumpCarMovePaths["path0"]!, "#00FFFF", "solid");
  await createMultiMovePath(App, FloodPumpCarMovePaths["path1"]!, "#32CD32", "solid");
  await createMultiMovePath(App, FloodPumpCarMovePaths["path2"]!, "#32CD32", "solid");
  await createMultiMovePath(App, FloodPumpCarMovePaths["path3"]!, "#32CD32", "solid");

  if (FloodPumpCarMovePaths["path0"]!.length > 0 && FloodPumpCarMovePaths["path0"]![0]) {
    await createMoveVehicle(App, FloodPumpCarMovePaths["path0"]![0]);
  }
}

async function handleCloseDispatchPlan() {
  console.log("📩 收到计划关闭点击事件");
  await deleteVehicle(App);
  await deleteAllMovePaths(App);
  await deleteMovePath(App);
  await setCircleRangeVisible(false);
}

async function handleOpenDispatchExecute() {
  const position: [number, number, number] = [
    118.78494465840367, 32.06180532249867, 1659.0181234413385
  ];
  const rotation = { pitch: -88.99999237060547, yaw: -179.94093322753906 };
  await updateCamera(App, position, rotation, 2);

  await deleteAllMovePaths(App);

  vehicleDirection = "forward";
  isVehicleCar = true;
  await createMovePath(App, FloodPumpCarMovePaths["path0"]!, "#00FFFF", "solid");
  if (FloodPumpCarMovePaths["path0"]!.length > 0 && FloodPumpCarMovePaths["path0"]![0]) {
    await createMoveVehicle(App, FloodPumpCarMovePaths["path0"]![0]);
  }
  await startVehicleMove(App, undefined, undefined, 2.5, false, "play");
}

async function onArriveWaterPoint() {
  console.log("🚗💨 到达水体点");
  setTimeout(async () => {
    await createMovePath(App, FloodPumpCarMovePaths["path0"]!, "#00FFFF", "solid");
    if (FloodPumpCarMovePaths["path0"]!.length > 0 && FloodPumpCarMovePaths["path0"]![0]) {
      await createMoveVehicle(App, FloodPumpCarMovePaths["path0"]![0]);
    }
    await startVehicleMove(App, undefined, undefined, 2.5, true, "play");
  }, 1200);
  vehicleDirection = "backward";

  await deleteInundationAlgorithm();
}

async function onArriveBackStart() {
  console.log("🚗💨 返回起始点");
  await deleteVehicle(App);
  await deleteMovePath(App);
  isVehicleCar = false;
  await handleClosePumpCar();
}

async function handlePipeProblemAnalysis() {
  await new Promise((resolve) => setTimeout(resolve, 1300));

  // -------- 第一批悬挂管线 --------
  const fids1 = ["53393b07", "b50f7eb7", "b50f7eb8", "b50f7eb6", "b50f7eb5"];
  await setPipelineHighlight(
    App,
    true,
    "#ff0000ff",
    1,
    [""],
    "sewage_line",
    fids1
  );

  // 等待1秒
  await new Promise((resolve) => setTimeout(resolve, 1800));
  // 将fids1添加到PipeProblemFID中
  PipeProblemFID.value = [...fids1];

  // 为pipeDetailProblemInfo添加相应的数据
  pipeDetailProblemInfo.value = [
    {
      fid: "53393b07",
      position: "管段B-05",
      defectName: "悬挂",
      color: "#ff0000ff",
    },
    {
      fid: "b50f7eb7",
      position: "管段A-12",
      defectName: "悬挂",
      color: "#ff0000ff",
    },
    {
      fid: "b50f7eb8",
      position: "管段A-11",
      defectName: "悬挂",
      color: "#ff0000ff",
    },
    {
      fid: "b50f7eb6",
      position: "管段A-10",
      defectName: "悬挂",
      color: "#ff0000ff",
    },
    {
      fid: "b50f7eb5",
      position: "管段A-09",
      defectName: "悬挂",
      color: "#ff0000ff",
    },
  ];

  // -------- 第二批管线交叉 --------
  const fids2 = ["1694edc3", "a82f50b5"];
  await setPipelineHighlight(
    App,
    true,
    "#0d00ffff",
    1,
    [""],
    "sewage_line",
    fids2
  );

  // 等待1s秒
  await new Promise((resolve) => setTimeout(resolve, 1800));
  // 将fids2添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids2];

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push(
    {
      fid: "1694edc3",
      position: "管段B-06",
      defectName: "管线交叉",
      color: "#0d00ffff",
    },
    {
      fid: "a82f50b5",
      position: "管段B-10",
      defectName: "管线交叉",
      color: "#0d00ffff",
    }
  );

  // -------- 第三批管线重叠 --------
  const fids3 = ["18249494"];
  await setPipelineHighlight(
    App,
    true,
    "#55ff00ff",
    1,
    [""],
    "sewage_line",
    fids3
  );

  // 等待1s秒
  await new Promise((resolve) => setTimeout(resolve, 1800));
  // 将fids3添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids3];

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push({
    fid: "18249494",
    position: "管段B-06",
    defectName: "管线重叠",
    color: "#04f8dfff",
  });

  // -------- 第四批管线错位 --------
  const fids4 = ["b87625c6", "3084886c"];
  await setPipelineHighlight(
    App,
    true,
    "#04f8dfff",
    1,
    [""],
    "sewage_line",
    fids4
  );

  // 等待1s秒
  await new Promise((resolve) => setTimeout(resolve, 1800));
  // 将fids4添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids4];

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push(
    {
      fid: "b87625c6",
      position: "管段B-06",
      defectName: "管线错位",
      color: "#04f8dfff",
    },
    {
      fid: "3084886c",
      position: "管段B-10",
      defectName: "管线错位",
      color: "#04f8dfff",
    }
  );

  // -------- 第五批管线埋深偏差 --------
  const fids5 = ["c8c92f4e"];
  await setPipelineHighlight(
    App,
    true,
    "#fbff00ff",
    1,
    [""],
    "sewage_line",
    fids5
  );

  // 等待1s秒
  await new Promise((resolve) => setTimeout(resolve, 1800));
  // 将fids5添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids5];

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push({
    fid: "c8c92f4e",
    position: "管段B-06",
    defectName: "埋深偏差",
    color: "#fbff00ff",
  });

  // -------- 第六批管井错位 --------
  const fids6 = ["node_8105", "node_11404", "node_2501", "node_5549"];
  await setPipeNodeHighlight(
    App,
    true,
    "#ff9f05ff",
    1,
    [""],
    "sewage_node",
    fids6
  );

  await new Promise((resolve) => setTimeout(resolve, 1800));

  // 将fids6添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids6];
  console.log("PipeProblemFID.value", PipeProblemFID.value);

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push(
    {
      fid: "node_8105",
      position: "管段B-06",
      defectName: "错位",
      color: "#ff9f05ff",
    },
    {
      fid: "node_11404",
      position: "管段B-10",
      defectName: "错位",
      color: "#ff9f05ff",
    },
    {
      fid: "node_2501",
      position: "管段C-13",
      defectName: "错位",
      color: "#ff9f05ff",
    },
    {
      fid: "node_5549",
      position: "管段A-13",
      defectName: "错位",
      color: "#ff9f05ff",
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 1800));

  const fids7 = ["b84568c6", "971489c", "c99x2f4e"];
  // 将fids7添加到PipeProblemFID中（插入而不是替换）
  PipeProblemFID.value = [...PipeProblemFID.value, ...fids7];
  console.log("PipeProblemFID.value", PipeProblemFID.value);

  // 为pipeDetailProblemInfo添加相应的数据（添加而不是替换）
  pipeDetailProblemInfo.value.push(
    {
      fid: "b84568c6",
      position: "管段C-06",
      defectName: "其他",
      color: "#f60bd3ff",
    },
    {
      fid: "971489c",
      position: "管段C-10",
      defectName: "其他",
      color: "#f60bd3ff",
    },
    {
      fid: "c99x2f4e",
      position: "管段C-13",
      defectName: "其他",
      color: "#f60bd3ff",
    }
  );

  aiAnalysisTrigger.value = false;

  plainProblems.value = JSON.parse(
    JSON.stringify(toRaw(pipeDetailProblemInfo.value))
  );
}

// 处理来自PipeClickInfo-card的AI分析事件
async function handleAIAnalysis() {
  console.log("接收到AI智能分析指令");

  isSidebarVisible.value = false;

  showPipeProblemCard.value = true;
  aiAnalysisTrigger.value = true;

  // 同时给 AI 一个“状态更新”
  startWaitingAction(); // ⭐ 告诉 AI 对话框：正在扫描

  await handlePipeProblemAnalysis();

  aiAnalysisTrigger.value = false;

  // finishWaitingAction();

  const aiproblems = plainProblems.value

  continueWithFeedback({
    type: "analysis_result",
    analyzed: true,
    problems: aiproblems,
  });
}

async function handleButtonAnalysis() {
  console.log("接收到分析指令");
  showPipeProblemCard.value = true;
  isSidebarVisible.value = false;
  await handlePipeProblemAnalysis();
  RepairButtonVisible.value = true;
}

async function handlePipeProblemRepair() {
  const fids1_problem = [
    "53393b07",
    "b50f7eb7",
    "b50f7eb8",
    "b50f7eb6",
    "b50f7eb5",
  ];
  const fids2_problem = ["1694edc3", "a82f50b5"];
  const fids3_problem = ["18249494"];
  const fids4_problem = ["b87625c6", "3084886c"];
  const fids5_problem = ["c8c92f4e"];
  const fids6_problem = ["node_8105", "node_11404", "node_2501", "node_5549"];

  const fids1_repair = [
    "53393b07",
    "b50f7eb7",
    "b50f7eb8",
    "b50f7eb6",
    "b50f7eb5",
    "1694edc3",
    "a82f50b5",
    "18249494",
    "b87625c6",
    "3084886c",
    "c8c92f4e",
  ];
  const fids2_repair = ["node_8105", "node_11404", "node_2501", "node_5549"];

  await new Promise((resolve) => setTimeout(resolve, 1500));

  await setPipelineVisible(App, false, "sewage_line", ["SN", "SL", "ZT"]);
  await setPipeNodeVisible(App, false, "sewage_node", ["HNT"]);

  // -------- 高亮第一批 --------
  const fids1 = ["b50f7eb5", "3576da0a"];
  await setPipelineHighlight(
    App,
    true,
    "#ff0000ff",
    5,
    [""],
    "rain_line",
    fids1
  );

  // -------- 高亮第二批 --------
  const fids2 = ["1694edc3"];
  await setPipelineHighlight(
    App,
    true,
    "#0d00ffff",
    5,
    [""],
    "rain_line",
    fids2
  );

  // -------- 高亮第三批 --------
  const fids3 = ["776e39c5"];
  await setPipelineHighlight(
    App,
    true,
    "#04f8dfff",
    5,
    [""],
    "rain_line",
    fids3
  );

  // -------- 高亮第四批 --------
  const fids4 = ["3084886c", "b87625c6"];
  await setPipelineHighlight(
    App,
    true,
    "#04f8dfff",
    5,
    [""],
    "rain_line",
    fids4
  );

  // -------- 高亮第五批 --------
  const fids5 = ["c8c92f4e"];
  await setPipelineHighlight(
    App,
    true,
    "#fbff00ff",
    5,
    [""],
    "rain_line",
    fids5
  );

  // -------- 高亮第五批 --------
  const fids6 = ["node_9463"];
  await setPipeNodeHighlight(
    App,
    true,
    "#0d00ffff",
    5,
    [""],
    "rain_node",
    fids6
  );

  // 逐个删除元素，实现丝滑的移除动画效果
  for (let i = 0; i < fids1_repair.length; i++) {
    const fid = fids1_repair[i];
    // 从PipeProblemFID中移除当前fid
    PipeProblemFID.value = PipeProblemFID.value.filter((id) => id !== fid);

    // 从pipeDetailProblemInfo中移除对应的项
    pipeDetailProblemInfo.value = pipeDetailProblemInfo.value.filter(
      (item) => item.fid !== fid
    );

    // 对于最后一个元素，不需要等待
    if (i < fids1_repair.length - 1) {
      // 等待一小段时间再删除下一个，实现逐个删除的效果
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  for (let i = 0; i < fids2_repair.length; i++) {
    const fid = fids2_repair[i];
    // 从PipeProblemFID中移除当前fid
    PipeProblemFID.value = PipeProblemFID.value.filter((id) => id !== fid);

    // 从pipeDetailProblemInfo中移除对应的项
    pipeDetailProblemInfo.value = pipeDetailProblemInfo.value.filter(
      (item) => item.fid !== fid
    );

    // 对于最后一个元素，不需要等待
    if (i < fids2_repair.length - 1) {
      // 等待一小段时间再删除下一个，实现逐个删除的效果
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  // await setPipelineHeight(App, 15, "rain_line");
  // await setPipeNodeHeight(App, 16.7, "rain_node");

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  await setPipelineHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_line",
    fids1
  );
  await setPipelineHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_line",
    fids2
  );
  await setPipelineHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_line",
    fids3
  );
  await setPipelineHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_line",
    fids4
  );
  await setPipelineHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_line",
    fids5
  );

  await setPipeNodeHighlight(
    App,
    false,
    "#7cd615ff",
    5,
    [""],
    "rain_node",
    fids6
  );

  await new Promise((resolve) => setTimeout(resolve, 500));
}

// 处理来自PipeClickInfo-card的AI修复事件
async function handleAIRepair() {
  console.log("接收到AI智能修复指令");
  aiRepairTrigger.value = true;

  await handlePipeProblemRepair();

  aiRepairTrigger.value = false;

  isSidebarVisible.value = true;
}

async function handleButtonRepair() {
  console.log("接收到修复指令");
  RepairButtonVisible.value = false;
  await handlePipeProblemRepair();
  showPipeProblemCard.value = false;
  isSidebarVisible.value = true;
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
    let position: [number, number, number] = [0, 0, 0];
    let rotation: { pitch: number; yaw: number } = { pitch: 0, yaw: 0 };

    switch (station) {
      case "pump1":
        position = [118.76833392150021, 32.033545830492244, 82.45153664034628];
        rotation = { pitch: -4.962748050689697, yaw: -57.22252655029297 };
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

async function handleRowClick(fid: string) {
  // 查找对应的管网元素信息
  const problemItem = pipeDetailProblemInfo.value.find(
    (item) => item.fid === fid
  );

  if (problemItem) {
    console.log("📄 问题详情:", problemItem);
    // let elementType = "pipeline"; // 默认为管线
    // let distanceFactor = 50;
    // let eid = "";

    // const pipeline = PipeLineEid.value.find(p => p.key.includes("sewage") ? true : p.key.includes("rain"));
    //   if (pipeline) {
    //     eid = pipeline.eid;
    //   }
    // if (fid.startsWith("node_")) {
    //   elementType = "pipenode";
    //   distanceFactor = 0.5;
    //   const pipenode = PipeNodeEid.value.find(p => p.key.includes("sewage") ? true : p.key.includes("rain"));
    //   if (pipenode) {
    //     eid = pipenode.eid;
    //   }
    // }

    // // 使用传入的fid作为fId
    // const fId = fid;

    // await focusPipelineSegment(App, eid, fId, distanceFactor);

    // 如果需要定位到对应位置，可以根据fid查找预定义的位置信息
    // 这里只是一个示例，实际应用中可能需要从数据源获取位置信息
    const positions = {
      "53393b07": {
        pos: [118.77858083142631, 32.043923070781446, 32.445374138166],
        rot: { pitch: -21.49539566040039, yaw: 96.44375610351562 },
      },
      b50f7eb7: {
        pos: [118.77856329112893, 32.04394018765378, 30.520639105800726],
        rot: { pitch: -17.032958984375, yaw: 87.43425750732422 },
      },
      b50f7eb8: {
        pos: [118.77846283682736, 32.04392583514427, 30.520639105800726],
        rot: { pitch: -17.032958984375, yaw: 87.43425750732422 },
      },
      b50f7eb6: {
        pos: [118.77834376805271, 32.04393082753703, 30.520639105800726],
        rot: { pitch: -17.032958984375, yaw: 87.43425750732422 },
      },
      b50f7eb5: {
        pos: [118.77837557122216, 32.04393313994983, 29.541795849755914],
        rot: { pitch: -15.348967552185059, yaw: 112.77833557128906 },
      },
      "1694edc3": {
        pos: [118.778756166143, 32.0437763506602, 45.38611009108844],
        rot: { pitch: -43.13502883911133, yaw: -40.381690979003906 },
      },
      a82f50b5: {
        pos: [118.778756166143, 32.0437763506602, 45.38611009108844],
        rot: { pitch: -43.13502883911133, yaw: -40.381690979003906 },
      },
      "18249494": {
        pos: [118.77858083142631, 32.043923070781446, 32.445374138166],
        rot: { pitch: -21.49539566040039, yaw: 96.44375610351562 },
      },
      b87625c6: {
        pos: [118.77895413862804, 32.043678729917026, 31.713484293304493],
        rot: { pitch: -9.707489013671875, yaw: -93.84732055664062 },
      },
      "3084886c": {
        pos: [118.77865659502132, 32.04388982554715, 40.2235107306306],
        rot: { pitch: -16.527639389038086, yaw: -2.743511915206909 },
      },
      c8c92f4e: {
        pos: [118.77899161758687, 32.043824664089364, 27.749805771585738],
        rot: { pitch: -11.05457592010498, yaw: -159.1862030029297 },
      },
      node_8105: {
        pos: [118.77848047261318, 32.04395111978543, 40.6422913502814],
        rot: { pitch: -23.179222106933594, yaw: 10.897170066833496 },
      },
      node_11404: {
        pos: [118.77848047261318, 32.04395111978543, 40.6422913502814],
        rot: { pitch: -23.179222106933594, yaw: 10.897170066833496 },
      },
      node_2501: {
        pos: [118.77848047261318, 32.04395111978543, 40.6422913502814],
        rot: { pitch: -23.179222106933594, yaw: 10.897170066833496 },
      },
      node_5549: {
        pos: [118.77848047261318, 32.04395111978543, 40.6422913502814],
        rot: { pitch: -23.179222106933594, yaw: 10.897170066833496 },
      },
    };

    if (positions[fid as keyof typeof positions]) {
      const { pos, rot } = positions[fid as keyof typeof positions];
      await updateCamera(App, pos as [number, number, number], rot, 2);
    }
  } else {
    console.warn(`⚠️ 未找到FID为 ${fid} 的问题项`);
  }
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
  background: radial-gradient(circle at center,
      rgba(0, 0, 0, 0.9),
      rgba(0, 0, 0, 0.95));
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

.control-btn {
  pointer-events: auto;
}

.test-btn-container {
  position: absolute;
  top: 95%;
  left: 20px;
  z-index: 100;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 90%;
  pointer-events: auto;
}

.camera-input-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.camera-input-container label {
  color: white;
  font-size: 14px;
  white-space: nowrap;
}

.camera-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  background: rgba(255, 255, 255, 0.9);
}

.sidebar-toggle-btn {
  pointer-events: auto;
}
</style>