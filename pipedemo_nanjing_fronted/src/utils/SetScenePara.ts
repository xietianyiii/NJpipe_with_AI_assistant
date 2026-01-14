/**
 * 设置场景风格
 * @param App - WDP 实例对象
 * @param style - 场景风格
 *  可选值：
 *  - "comic"  漫画风
 *  - "sketch" 素描风
 *  - "dark"   暗色风
 *  - "ashy"   灰白风
 *  - false    关闭风格（恢复默认）
 */
export async function setSceneStyle(
  App: any,
  style: string
): Promise<void> {
  if (!App?.Scene) {
    console.error("❌ App 实例未初始化或无 Scene 模块");
    return;
  }

  try {
    const res = await App.Scene.SetSceneStyle(style);
    console.log("🎨 场景风格设置成功:", style, res);
  } catch (error) {
    console.error("❌ 场景风格设置失败:", error);
  }
}


/**
 * 设置场景要素透明度
 * @param App - WDP 实例对象
 * @param placename - 场景要素名称
 *  可选示例：道路 / 水系 / 建筑 / 地形
 * @param opacity - 透明度（0 ~ 1）
 */
export async function setSceneOpacity(
  App: any,
  placename: string,
  opacity: number
): Promise<void> {
  if (!App?.Customize?.RunCustomizeApi) {
    console.error("❌ App 实例未初始化或无 Customize 模块");
    return;
  }

  // 参数安全校验（防止非法值）
  // const safeOpacity = Math.max(0, Math.min(1, opacity));

  const safeOpacity = opacity;
  
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "SceneControl",
    args: {
      placename,
      action: "setopacity",
      moreparameters: {
        opacity: safeOpacity,
      },
    },
  };

  try {
    const res = await App.Customize.RunCustomizeApi(jsondata);
    console.log(
      "🎚 场景透明度设置成功:",
      { placename, opacity: safeOpacity },
      res
    );
  } catch (error) {
    console.error("❌ 场景透明度设置失败:", error);
  }
}
