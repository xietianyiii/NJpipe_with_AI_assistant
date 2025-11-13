/**
 * 更新相机位置与姿态
 * @param App - WDP 实例对象
 * @param position - 相机位置 [longitude, latitude, altitude]
 * @param rotation - 相机旋转角度 { pitch: number, yaw: number }
 * @param flyTime - 过渡时长（秒）
 */
export async function updateCamera(
  App: any,
  position: [number, number, number],
  rotation: { pitch: number; yaw: number },
  flyTime: number = 1
): Promise<void> {
  if (!App?.CameraControl) {
    console.error("❌ App 实例未初始化或无 CameraControl 模块");
    return;
  }

  try {
    const jsondata = {
      location: position,
      locationLimit: [],
      rotation: rotation,
      pitchLimit: [-90, 0],
      yawLimit: [-180, 180],
      viewDistanceLimit: [10, 40000],
      fieldOfView: 90,
      controlMode: "RTS", // RTS 飞行模式
      flyTime, // 过渡时长
    };

    const res = await App.CameraControl.UpdateCamera(jsondata);
    console.log("🎥 相机更新成功:", res);
  } catch (error) {
    console.error("❌ 相机更新失败:", error);
  }
}
