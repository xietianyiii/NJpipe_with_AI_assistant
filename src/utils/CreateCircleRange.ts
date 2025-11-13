/**
 * createCircleRange.ts
 * 创建并聚焦一个圆形范围实体（波纹/围栏等）
 *
 * 功能说明：
 * 1️⃣ 支持传入圆心坐标与半径；
 * 2️⃣ 可自定义类型 type 与填充模式 fillAreaType；
 * 3️⃣ 自动删除旧实例（customId 固定为 "my-circleRange-id"）；
 *
 * @param App - WDP 实例对象
 * @param center - 圆心坐标 [longitude, latitude, height]
 * @param radius - 圆形半径（单位：米）
 * @param type - 范围类型（可选，默认 "wave"）
 * @param fillAreaType - 填充模式（可选，默认 "none"）
 */
export async function createCircleRange(
  App: any,
  center: [number, number, number],
  radius: number,
  type: "wave" | "loop_line" | "block" = "wave",
  fillAreaType: "none" | "block" | "wire" = "none"
): Promise<void> {
  if (!App?.Scene || !App?.CameraControl) {
    console.error("❌ App 实例无效，请确保 WdpApi 初始化完成且包含 Scene 与 CameraControl 模块");
    return;
  }

  try {
    console.log("⭕ 正在创建圆形范围实体...");

    // 1️⃣ 删除旧实体，防止重复
    const re = await App.Scene.GetByCustomId(["my-circleRange-id"]);
    if (re.success && re.result.length > 0) {
      console.log("🧹 检测到旧的圆形范围实体，正在删除...");
      await re.result[0].Delete();
    }

    // 2️⃣ 构建实体对象
    const entityObj = new App.Range({
      circlePolygon2D: {
        center, // 圆心
        radius, // 半径（米）
      },
      rangeStyle: {
        shape: "circle", // 类型固定为圆
        type, // 波纹类型、轮廓线等
        fillAreaType, // 填充模式
        height: 200, // 围栏高度（米）
        strokeWeight: 10, // 轮廓线宽度
        color: "b7ff94ff", // 区域颜色
      },
      bVisible: true,
      entityName: "circle-range-entity",
      customId: "my-circleRange-id",
      customData: { data: "circleRangeData" },
    });

    // 3️⃣ 添加至场景
    const res = await App.Scene.Add(entityObj, {
      calculateCoordZ: {
        coordZRef: "surface", // 表面参考
        coordZOffset: -30, // 偏移高度（米）
      },
    });

    if (!res.success) {
      console.error("❌ 圆形范围添加失败:", res);
      return;
    }

    console.log("✅ 圆形范围创建成功:", res);
  } catch (error) {
    console.error("🚨 createCircleRange 执行出错:", error);
  }
}
