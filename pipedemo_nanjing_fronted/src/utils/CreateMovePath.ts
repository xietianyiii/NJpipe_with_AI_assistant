/**
 * moveVehicle.ts
 *  - 创建路径
 *  - 创建移动的小车
 *  - 控制小车沿路径运动
 */

const movePathCache = {
    paths: [] as any[],
};

/**
 * 创建移动路径
 * 
 * @param App - WDP 实例对象
 * @param coordinates - 路径坐标点数组 [[lon, lat, height], ...]
 * @param color - 路径颜色（HEX 或 rgba）
 * @param pathType - 路径样式类型，如 "arrow"、"line"
 * @param visible - 是否可见
 * @returns Promise<any> - 返回路径对象
 */
export async function createMovePath(
    App: any,
    coordinates: [number, number, number][],
    color: string = "a54cffff",
    pathType: "arrow" | "arrow_dot" | "scan_line"| "solid" = "arrow",
    visible: boolean = true
): Promise<any> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效，请确保包含 Scene 模块");
        return null;
    }

    try {
        console.log("🛣️ 正在创建路径...");

        // 删除旧路径
        const re = await App.Scene.GetByCustomId(["my-movePath-id"]);
        if (re.success && re.result.length > 0) {
            console.log("🧹 删除旧路径对象");
            await re.result[0].Delete();
        }

        const path = new App.Path({
            polyline: { coordinates },
            pathStyle: {
                type: pathType,
                width: 20,
                speedupFactor: 1,
                opacity: 1,
                color,
                passColor: "#006400",
            },
            customId: "my-movePath-id",
            bVisible: visible,
        });

        const { success } = await App.Scene.Add(path, {
            calculateCoordZ: { coordZRef: "altitude", coordZOffset: 30 },
        });

        if (success) {
            console.log("✅ 路径创建成功:", path);
            return path;
        } else {
            console.warn("⚠️ 路径创建失败");
            return null;
        }
    } catch (error) {
        console.error("🚨 createMovePath 执行出错:", error);
        return null;
    }
}

/**
 * 创建多条移动路径（不会删除旧路径）
 * @param App 
 * @param coordinates 
 * @param color 
 * @param pathType 
 * @param width - 路径宽度
 * @param speedupFactor - 路径加速因子
 * @param passColor - 路径通过颜色
 * @param coordZRef - 高度参考模式 (默认: "altitude")
 * @param coordZOffset - 高度偏移量 (默认: 30)
 * @returns 
 */
export async function createMultiMovePath(
    App: any,
    coordinates: [number, number, number][],
    color: string = "a54cffff",
    pathType: string = "arrow",
    width: number = 20,
    speedupFactor: number = 1,
    passColor: string = "c9ff23ff",
    coordZRef: string = "altitude",
    coordZOffset: number = 30,
): Promise<any> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效");
        return null;
    }

    try {
        console.log("🛣️ 创建多路径模式：不会删除旧路径");

        const customId = `my-movePath-id-${Date.now()}-${movePathCache.paths.length}`;

        const path = new App.Path({
            polyline: { coordinates },
            pathStyle: {
                type: pathType,
                width: width,
                speedupFactor: speedupFactor,
                opacity: 1,
                color,
                passColor: passColor,
            },
            customId,
            bVisible: true,
        });

        const res = await App.Scene.Add(path, {
            calculateCoordZ: { coordZRef: coordZRef, coordZOffset: coordZOffset },
        });

        if (res.success) {
            movePathCache.paths.push(path);
            console.log(`✅ 路径创建成功：${customId}`, path);
            return path;
        }
    } catch (err) {
        console.error("🚨 createMultiMovePath 出错:", err);
    }

    return null;
}

/**
 * 删除单条路径
 */
export async function deleteMovePath(App: any): Promise<void> {
    if (!App?.Scene) return;

    try {
        const re = await App.Scene.GetByCustomId(["my-movePath-id"]);
        if (re.success && re.result.length > 0) {
            const entity = re.result[0];
            const res = await entity.Delete();
            if (res.success) {
                console.log("🧹 单条路径删除成功");
            }
        }
    } catch (err) {
        console.error("🚨 deleteMovePath 出错:", err);
    }
}


/**
 * 删除所有路径
 */
export async function deleteAllMovePaths(App: any): Promise<void> {
    if (!App?.Scene) return;

    for (const p of movePathCache.paths) {
        await p.Delete();
    }
    movePathCache.paths = [];
    console.log("🧹 所有路径已删除");
}

/**
 * 创建小车粒子实体
 * 
 * @param App - WDP 实例对象
 * @param startLocation - 起始位置 [lon, lat, height]
 * @returns Promise<any> - 返回小车对象
 */
export async function createMoveVehicle(
    App: any,
    startLocation: [number, number, number]
): Promise<any> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效，请确保包含 Scene 模块");
        return null;
    }

    try {
        console.log("🚗 正在创建小车实体...");

        // 删除旧小车与移动对象
        const re1 = await App.Scene.GetByCustomId(["my-moveParticle-id"]);
        if (re1.success && re1.result.length > 0) {
            console.log("🧹 删除旧小车实体");
            await re1.result[0].Delete();
        }

        const re2 = await App.Scene.GetByCustomId(["my-moveObj-id"]);
        if (re2.success && re2.result.length > 0) {
            console.log("🧹 删除旧移动绑定对象");
            await re2.result[0].Delete();
        }

        const particle = new App.Particle({
            location: startLocation,
            rotator: { pitch: 0, yaw: 0, roll: 0 },
            scale3d: [5, 5, 5],
            particleType: "vehicle_taxi",
            customId: "my-moveParticle-id",
            bVisible: true,
        });

        const res = await App.Scene.Add(particle, {
            calculateCoordZ: { coordZRef: "ground", coordZOffset: 5 },
        });

        if (res.success) {
            console.log("✅ 小车实体创建成功:", particle);
            return particle;
        } else {
            console.warn("⚠️ 小车实体创建失败");
            return null;
        }
    } catch (error) {
        console.error("🚨 createMoveVehicle 执行出错:", error);
        return null;
    }
}


/**
 * 删除小车
 */
export async function deleteVehicle(App: any): Promise<void> {
    if (!App?.Scene) return;

    try {
        const re = await App.Scene.GetByCustomId(["my-moveParticle-id"]);
        if (re.success && re.result.length > 0) {
            const entity = re.result[0];
            const res = await entity.Delete();
            console.log(res);
        }
        console.log("🧹 小车已删除");
    } catch (err) {
        console.error("🚨 deleteVehicle 出错:", err);
    }
}

//////////////////////////////
// 🌀 小车沿路径移动
//////////////////////////////

/**
 * 让小车沿路径移动（可选复用已有对象）
 *
 * @param App - WDP 实例对象
 * @param particle - （可选）小车对象，若为空则自动查找已存在的
 * @param path - （可选）路径对象，若为空则自动查找已存在的
 * @param duration - 移动时长（单位：秒，默认 60）
 * @param reverse - 是否反向移动（默认 false）
 * @param state - 移动状态（默认 "play"）
 * @returns Promise<void>
 */
export async function startVehicleMove(
    App: any,
    particle?: any,
    path?: any,
    duration: number = 60,
    reverse: boolean = false,
    state: "play" | "pause" | "stop" = "play"
): Promise<void> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效，请确保包含 Scene 模块");
        return;
    }

    try {
        console.log("🌀 正在启动或控制小车移动...");

        // 如果未传入 particle，则自动获取
        if (!particle) {
            const reParticle = await App.Scene.GetByCustomId(["my-moveParticle-id"]);
            if (reParticle.success && reParticle.result.length > 0) {
                particle = reParticle.result[0];
                console.log("♻️ 复用已有小车实体:", particle);
            } else {
                console.warn("⚠️ 未找到现有小车对象，请先创建！");
                return;
            }
        }

        // 如果未传入 path，则自动获取
        if (!path) {
            const rePath = await App.Scene.GetByCustomId(["my-movePath-id"]);
            if (rePath.success && rePath.result.length > 0) {
                path = rePath.result[0];
                console.log("♻️ 复用已有路径对象:", path);
            } else {
                console.warn("⚠️ 未找到现有路径对象，请先创建！");
                return;
            }
        }

        // 检查是否已有移动绑定对象
        const reMove = await App.Scene.GetByCustomId(["my-moveObj-id"]);
        if (reMove.success && reMove.result.length > 0) {
            const existingMove = reMove.result[0];
            console.log("🔁 发现已有移动对象，更新状态:", state);

            // 如果只是控制状态，不必重新创建
            if (state === "pause" && existingMove.Pause) {
                await existingMove.Pause();
            } else if (state === "play" && existingMove.Play) {
                await existingMove.Play();
            } else if (state === "stop" && existingMove.Stop) {
                await existingMove.Stop();
            } else {
                console.warn("⚠️ 当前引擎对象不支持对应状态控制");
            }

            return; // ✅ 不再重复创建
        }

        // 🆕 若没有旧对象，则创建新移动绑定
        const moveObj = new App.Bound({
            moving: particle,
            path,
            boundStyle: {
                time: duration,
                bLoop: false,
                bReverse: reverse,
                state: state,
            },
            customId: "my-moveObj-id",
            rotator: { pitch: 0, yaw: 0, roll: 0 },
            offset: { left: 0, forward: 0, up: 0 },
        });

        const res = await App.Scene.Add(moveObj);

        if (res.success) {
            console.log(`✅ 小车开始移动（${reverse ? "反向" : "正向"}，时长: ${duration}s，状态: ${state}）`);
        } else {
            console.warn("⚠️ 小车移动启动失败:", res);
        }

    } catch (error) {
        console.error("🚨 startVehicleMove 执行出错:", error);
    }
}


/**
 * 让任意实体沿路径移动（通用封装）
 *
 * @param App - WDP 实例
 * @param eid  - 需要移动的实体对象的 EID
 * @param coordinates  - 路径坐标数组[[lng, lat, z], ...]
 * @param pitch - 俯仰角度（默认 0）
 * @param yaw - 偏航角度（默认 0）
 * @param roll - 横滚角度（默认 0）
 * @param duration - 移动时长（秒）
 * @param loop - 是否循环（true 循环，false 不循环）
 * @param reverse - 是否反向移动
 * @param state - 初始状态（play/pause/stop）
 */
export async function createEntityMovePath(
    App: any,
    eid: string,
    coordinates: [number, number, number][],
    pitch: number = 0,
    yaw: number = 0,
    roll: number = 0,
    duration: number = 20,
    loop: boolean = false,
    reverse: boolean = false,
    state: "play" | "pause" | "stop" = "play"
): Promise<any> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效，请确认 Scene 模块存在");
        return null;
    }

    /* ========= 1️⃣ 获取实体并设置 customId ========= */
    const modelCustomId = `move-model-${eid}`;

    const modelRes = await App.Scene.GetByEids([eid]);
    if (!modelRes.success || modelRes.result.length === 0) {
        console.error("❌ 未找到对应 EID 的实体:", eid);
        return null;
    }

    const model = modelRes.result[0];
    model.customId = modelCustomId;

    /* ========= 2️⃣ 创建路径 ========= */
    const pathCustomId = `move-path-${eid}-${Date.now()}`;

    const path = new App.Path({
        polyline: {
            coordinates,
        },
        pathStyle: {
            type: "arrow",
            width: 20,
            speedupFactor: 1,
            opacity: 1,
            color: "ff8a2aff",
            passColor: "c9ff23ff",
        },
        customId: pathCustomId,
        bVisible: false,
    });

    const pathAddRes = await App.Scene.Add(path);
    if (!pathAddRes.success) {
        console.error("❌ 路径创建失败");
        return null;
    }

    /* ========= 3️⃣ 通过 customId 再次获取（确保是 Scene 实例） ========= */
    const modelQuery = await App.Scene.GetByCustomId([modelCustomId]);
    const pathQuery = await App.Scene.GetByCustomId([pathCustomId]);

    if (
        !modelQuery.success ||
        modelQuery.result.length === 0 ||
        !pathQuery.success ||
        pathQuery.result.length === 0
    ) {
        console.error("❌ 无法通过 customId 获取实体或路径");
        return null;
    }

    const realModel = modelQuery.result[0];
    const realPath = pathQuery.result[0];

    /* ========= 4️⃣ 创建绑定移动 ========= */
    const bound = new App.Bound({
        moving: realModel,
        path: realPath,
        boundStyle: {
            time: duration,
            bLoop: loop,
            bReverse: reverse,
            state,
        },
        rotator: {
            pitch,
            yaw,
            roll,
        },
        offset: {
            left: 0,
            forward: 0,
            up: 0,
        },
        customId: `move-bound-${eid}-${Date.now()}`,
    });

    const boundRes = await App.Scene.Add(bound);
    if (!boundRes.success) {
        console.error("❌ 创建路径绑定失败");
        return null;
    }

    console.log("✅ 实体沿路径移动创建成功", {
        model: realModel,
        path: realPath,
        bound,
    });

    return bound;
}

/**
 * 获取实体并设置 customId
 *
 * @param App - WDP 实例
 * @param eid - 实体对象eid
 * @param customid - 自定义id
 */
export async function assignEidEntity(
    App: any,
    eid: any,
    customid: any,
): Promise<any> {
    if (!App?.Scene) {
        console.error("❌ App 实例无效，请确认 Scene 模块存在");
        return null;
    }

    if (!customid) {
        console.error("❌ customid 不能为空！你必须传入一个实体customId");
        return null;
    }

    if (!eid) {
        console.error("❌ eid 不能为空！你必须传入一个实体对象eid");
        return null;
    }

    try {
        console.log("🌀 准备为eid分配customid...");

        const eids = [eid];

        const res = await App.Scene.GetByEids(eids);
        console.log("实体查询结果：", res);

        if (res.success && res.result.length > 0) {
            const model = res.result[0];
            model.customId = customid;
            console.log("✅ 已获取实体并设置 customId:", model);
            return model;
        } else {
            console.warn("⚠️ 未找到对应 EID 的实体");
            return null;
        }
    } catch (error) {
        console.error("🚨 assignEidEntity 执行出错:", error);
        return null;
    }
}

export type MovePath = [number, number, number][];
/**
 * 批量创建路径（基于 Record<string, MovePath>）
 * @param App
 * @param pathsRecord 路径集合（如 WaterZone1PipePaths）
 * @param options 公共样式参数
 */
export async function createMovePathsFromRecord(
  App: any,
  pathsRecord: Record<string, MovePath>,
  options?: {
    color?: string;
    pathType?: string;
    width?: number;
    speedupFactor?: number;
    passColor?: string;
    coordZRef?: string;
    coordZOffset?: number;
  }
): Promise<any[]> {
  const results: any[] = [];

  if (!pathsRecord || Object.keys(pathsRecord).length === 0) {
    console.warn("⚠️ pathsRecord 为空");
    return results;
  }

  for (const [key, coordinates] of Object.entries(pathsRecord)) {
    if (!coordinates || coordinates.length < 2) {
      console.warn(`⚠️ ${key} 点数不足，跳过`);
      continue;
    }

    console.log(`🛠️ 创建路径：${key}`);

    const path = await createMultiMovePath(
      App,
      coordinates,
      options?.color ?? "a54cffff",
      options?.pathType ?? "arrow",
      options?.width ?? 20,
      options?.speedupFactor ?? 1,
      options?.passColor ?? "c9ff23ff",
      options?.coordZRef ?? "altitude",
      options?.coordZOffset ?? 30,
    );

    if (path) {
      results.push({
        key,
        path,
      });
    }
  }

  console.log(`✅ 批量创建完成，共 ${results.length} 条路径`);
  return results;
}

