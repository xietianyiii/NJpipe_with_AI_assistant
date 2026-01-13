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
