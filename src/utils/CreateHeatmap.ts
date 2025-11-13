import HeatmapConfig from "E:/VScode/Urban-flood/urban-pipe-flood/src/configs/Heatmap_Gen.json";

// 创建缓存对象来存储已创建的热力映射组件
const heatmapCache = {
  colorCard: null as any,
  material: null as any,
  algorithm: null as any
};

/**
 * 创建并运行热力映射（SHP）算法
 * 包含四个步骤：
 * 1️⃣ 创建色卡
 * 2️⃣ 创建热力材质
 * 3️⃣ 创建热力映射算法
 * 4️⃣ 运行算法
 * @param App - WDP 实例
 */
export async function createAndRunHeatmap(App: any): Promise<void> {
  if (!App) {
    console.warn("⚠️ App 实例无效，无法创建热力映射");
    return;
  }

  try {
    console.log("🔥 开始创建热力映射...");

    // 1️⃣ 检查缓存或创建色卡
    let colorCard;
    if (heatmapCache.colorCard) {
      console.log("🎨 使用缓存的色卡:", heatmapCache.colorCard.eid);
      colorCard = heatmapCache.colorCard;
    } else {
      const colorCardRes = await App.WIM.CustomColorCard.CreateCard({
        name: "ColorCard1",
        customId: "",
        color: [
          [30, 123, 255],
          [240, 26, 27],
        ],
        anchor: [
          { name: "test1", position: 0.167, weight: 1, color: [51,25,255] },
          { name: "test2", position: 0.33, weight: 1, color: [80,255,122] },
          { name: "test3", position: 0.5, weight: 1, color: [45,255,9] },
          { name: "test4", position: 0.67, weight: 1, color: [158,20,255] },
          { name: "test5", position: 0.83, weight: 1, color: [255,0,218] },
        ],
      });

      if (!colorCardRes.success) throw new Error("❌ 创建色卡失败");
      colorCard = colorCardRes.result.object;
      heatmapCache.colorCard = colorCard;
      console.log("🎨 色卡创建成功:", colorCard.eid);
    }

    // 2️⃣ 检查缓存或创建热力材质
    let materialObj;
    if (heatmapCache.material) {
      console.log("🧱 使用缓存的热力材质:", heatmapCache.material.eid);
      materialObj = heatmapCache.material;
    } else {
      const materialRes = await App.WIM.Flood.CreateMaterial({
        mId: "HeatmapMaterial1",
        customId: "",
        matBlur: 0.004,
        dataMax: 10,
        dataMin: 0.1,
        opacity: 0.8,
        heatMapMatIndex: 2,
      });

      if (!materialRes.success) throw new Error("❌ 创建材质失败");
      materialObj = materialRes.result.object;
      heatmapCache.material = materialObj;
      console.log("🧱 热力材质创建成功:", materialObj.eid);
    }

    // 3️⃣ 检查缓存或创建热力映射算法
    let heatmapAlgo;
    if (heatmapCache.algorithm) {
      console.log("🧩 使用缓存的热力算法:", heatmapCache.algorithm.eid);
      heatmapAlgo = heatmapCache.algorithm;
    } else {
      const algoConfig = HeatmapConfig;
      const algorithmRes = await App.WIM.Flood.CreateAlgorithm(algoConfig);

      if (!algorithmRes.success) throw new Error("❌ 创建热力映射算法失败");
      heatmapAlgo = algorithmRes.result.object;
      heatmapCache.algorithm = heatmapAlgo;
      console.log("🧩 热力算法创建成功:", heatmapAlgo.eid);
    }

    // 4️⃣ 运行热力映射算法
    const runRes = await heatmapAlgo.RunAlgorithm({
      offset: [0, 0, 0],
      scale: [1, 1],
      rotation: 0,
      materialEId: materialObj.eid, // 材质EID
      colorPointEId: colorCard.eid, // 色卡EID
      index: 1,
      minIndex: 0,
      maxIndex: 0,
      speed: 2,
      status: true,
      reset: false,
    });

    if (!runRes.success) throw new Error("❌ 热力算法运行失败");
    console.log("✅ 热力映射运行成功:", runRes);

  } catch (error) {
    console.error("🚨 createAndRunHeatmap 执行出错:", error);
  }
}

export async function deleteHeatmapAlgorithm(force: boolean = true): Promise<void> {
  try {
    if (!heatmapCache.algorithm) {
      console.warn("⚠️ 没有可删除的热力映射算法，请先创建！");
      return;
    }

    console.log("🧨 正在删除热力映射算法...");
    const res = await heatmapCache.algorithm.DeleteAlgorithm({ force });
    console.log("✅ 删除结果:", res);

    // 删除后清除缓存
    heatmapCache.algorithm = null;
    heatmapCache.material = null;
    console.log("🧹 缓存已清除");
  } catch (error) {
    console.error("🚨 删除热力映射算法出错:", error);
  }
}

/**
 * 清除热力映射缓存
 */
export function clearHeatmapCache(): void {
  heatmapCache.colorCard = null;
  heatmapCache.material = null;
  heatmapCache.algorithm = null;
  console.log("🧹 热力映射缓存已清除");
}
