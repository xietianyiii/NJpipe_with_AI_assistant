/**
 * CreatePipeline.ts
 * 创建与操作管网（Pipeline）
 * 包含：
 *  - 创建管网
 *  - 修改管网高度
 *  - 缓存管理
 */

const pipelineCache = {
    pipeline: null as any,
};

/**
 * 创建管网对象
 * @param App - WDP 实例
 * @param shpUrl - 管网 SHP 文件路径
 */
export async function createPipeline(App: any, shpUrl: string): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效，无法创建管网");
        return;
    }

    try {
        console.log("🚧 开始创建管网...");

        // 如果已缓存对象则直接复用
        if (pipelineCache.pipeline) {
            console.log("🔁 使用缓存的管网对象:", pipelineCache.pipeline.eid);
            return;
        }

        const jsondata = {
            apiClassName: "WimPipeAPI",
            apiFuncName: "CreateWimPipeEntity",
            args: {
                guid: "",
                pipeUrl: shpUrl,
                groupType: "sanmenxia",
                fieldList: {
                    fields: [
                        { StandardName: "PipeFlow", FeatureName: "flow_direction" },
                        { StandardName: "PipeCodeStart", FeatureName: "start_lon" },
                        { StandardName: "PipeCodeEnd", FeatureName: "start_lon" },
                        { StandardName: "PipeLocationStartX", FeatureName: "start_lon" },
                        { StandardName: "PipeLocationStartY", FeatureName: "start_lat" },
                        { StandardName: "PipeLocationEndX", FeatureName: "end_lon" },
                        { StandardName: "PipeLocationEndY", FeatureName: "end_lat" },
                        { StandardName: "PipeSurfaceAltitudeStart", FeatureName: "qdg" },
                        { StandardName: "PipeSurfaceAltitudeEnd", FeatureName: "zdg" },
                        { StandardName: "PipeBurialDepthStart", FeatureName: "qdm" },
                        { StandardName: "PipeBurialDepthEnd", FeatureName: "zdm" },
                        { StandardName: "PipeDiameter", FeatureName: "gj" },
                        {
                            StandardName: "PipeMaterial",
                            FeatureName: "cz",
                            DefaultValue: "HNT",
                            DetailFields: [
                                { SourceName: "钢管", TargetName: "GC" },
                                { SourceName: "铸铁", TargetName: "ZT" },
                                { SourceName: "水泥", TargetName: "SN" },
                                { SourceName: "砖石", TargetName: "ZQ" },
                                { SourceName: "陶瓷", TargetName: "TC" },
                                { SourceName: "塑料", TargetName: "SL" },
                                { SourceName: "ZT", TargetName: "ZT" },
                            ],
                        },
                        { StandardName: "Fid", FeatureName: "Wyid" },
                        {
                            StandardName: "FilterType",
                            DetailFields: [{ SourceName: "xl" }, { SourceName: "dl" }],
                        },
                    ],
                },
            },
        };

        const res = await App.Customize.RunCustomizeApi(jsondata);
        console.log("🧱 管网创建结果:", res);

        if (!res.success) throw new Error("❌ 管网创建失败");

        pipelineCache.pipeline = res.result;
        console.log("✅ 管网创建成功:", pipelineCache.pipeline.eid);
        console.log("⏳ 等待管网加载完成...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
        console.error("🚨 createPipeline 执行出错:", error);
    }
}

/**
 * 修改管网高度
 * @param App - WDP 实例
 * @param height - 新的管网高度
 */
export async function setPipelineHeight(App: any, height: number): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效");
        return;
    }

    if (!pipelineCache.pipeline) {
        console.warn("⚠️ 尚未创建管网，请先调用 createPipeline()");
        return;
    }

    try {
        const jsondata = {
            apiClassName: "WimPipeAPI",
            apiFuncName: "SetPipeHeight",
            args: {
                guid: "",
                pipeHeight: height,
                eid: pipelineCache.pipeline.eid,
            },
        };

        const res = await App.Customize.RunCustomizeApi(jsondata);
        if (res.success) {
            console.log(`📏 管网高度修改成功：${height} 米`);
        } else {
            console.error("❌ 修改管网高度失败:", res);
        }
    } catch (error) {
        console.error("🚨 setPipelineHeight 执行出错:", error);
    }
}


/**
 * 设置管网高亮
 * @param App - WDP 实例
 * @param highlight - 是否高亮（true 表示开启高亮）
 * @param color - 高亮颜色（如 "#ffe600"）
 * @param intensity - 高亮强度（数值，如 15）
 * @param types - 管网类型数组（如 ["SN", "SL", "ZT"]）
 */
export async function setPipelineHighlight(
    App: any,
    highlight: boolean,
    color: string,
    intensity: number,
    types: string[]
): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效");
        return;
    }

    if (!pipelineCache.pipeline) {
        console.warn("⚠️ 尚未创建管网，请先调用 createPipeline()");
        return;
    }

    try {
        const jsondata = {
            apiClassName: "WimPipeAPI",
            apiFuncName: "SetPipeHighLight",
            args: {
                guid: "",
                highLightInst: intensity, // 高亮强度
                highLightType: highlight ? 1 : 0, // 1=开，0=关
                highLightColor: color, // 高亮颜色
                eid: pipelineCache.pipeline.eid, // 当前管网对象的 EID
                fIds: [],
                types: types || [], // 需要高亮的类型
            },
        };

        const res = await App.Customize.RunCustomizeApi(jsondata);

        if (res.success) {
            console.log(
                `💡 管网高亮设置成功: ${highlight ? "开启" : "关闭"}，颜色=${color}，亮度=${intensity}`
            );
        } else {
            console.error("❌ 设置高亮失败:", res);
        }
    } catch (error) {
        console.error("🚨 setPipelineHighlight 执行出错:", error);
    }
}

/**
 * 设置管网显隐状态
 * @param App - WDP 实例
 * @param visible - 是否显示（true = 显示，false = 隐藏）
 * @param types - 管网类型数组（如 ["SN", "SL", "ZT"]，可选）
 */
export async function setPipelineVisible(
    App: any,
    visible: boolean,
    types?: string[]
): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效");
        return;
    }

    if (!pipelineCache.pipeline) {
        console.warn("⚠️ 尚未创建管网，请先调用 createPipeline()");
        return;
    }

    try {
        console.log(`👁️ 正在${visible ? "显示" : "隐藏"}管网...`);

        const jsondata = {
            apiClassName: "WimPipeAPI",
            apiFuncName: "SetPipeShowState",
            args: {
                guid: "",
                visible, // true 显示, false 隐藏
                eid: pipelineCache.pipeline.eid,
                fIds: [],
                types: types || [], // 可以指定类型，不传则作用于全部
            },
        };

        const res = await App.Customize.RunCustomizeApi(jsondata);

        if (res.success) {
            console.log(
                `✅ 管网显隐设置成功: ${visible ? "已显示" : "已隐藏"} (${types?.length ? types.join(", ") : "全部类型"})`
            );
        } else {
            console.error("❌ 管网显隐设置失败:", res);
        }
    } catch (error) {
        console.error("🚨 setPipelineVisible 执行出错:", error);
    }
}


/**
 * 设置管网液位高度
 * @param App - WDP 实例
 * @param pipeLiquidLevel - 管网液位高度（单位：米）
 * @param pipeLiquidLevels - 管网液位高度数组（单位：米）
 * @param color - 颜色
 * @param types - 管网fids数组（如 ["SN", "SL", "ZT"]，可选）
 */
export async function setPipeLiquidLevel(
    App: any,
    pipeLiquidLevel: number,
    color: string,
    pipeLiquidLevels?: number[],
    types?: string[]
): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效");
        return;
    }

    if (!pipelineCache.pipeline) {
        console.warn("⚠️ 尚未创建管网，请先调用 createPipeline()");
        return;
    }

    try {
        console.log(`👁️ 正在设置管网液位高度为 ${pipeLiquidLevel} 米, 颜色为${color}...`);

        const jsondata = {
            apiClassName: "WimPipeAPI",
            apiFuncName: "SetPipeLiquidLevel",
            args: {
                guid: "",
                eid: pipelineCache.pipeline.eid,
                fIds: [],
                pipeLiquidLevel: pipeLiquidLevel,
                pipeLiquidLevels: pipeLiquidLevels,
                color: color,
                isOpen: true,
                isFlow: true,
            },
        };

        const res = await App.Customize.RunCustomizeApi(jsondata);

        if (res.success) {
            console.log(
                `✅ 管网液位高度设置成功: ${pipeLiquidLevel} 米, 颜色为${color} (${types?.length ? types.join(", ") : "全部类型"})`
            );
        } else {
            console.error("❌ 管网液位高度设置失败:", res);
        }
    } catch (error) {
        console.error("🚨 setPipeLiquidLevel 执行出错:", error);
    }
}


/**
 * 设置管网流向
 * @param App - WDP 实例
 * @param pipeFlowdirction - 管网流向（单位：米）
 * @param pipeFlowStyle - 管网流向样式（0,1,2）
 * @param color - 颜色
 * @param visible - 是否显示（true = 显示，false = 隐藏）
 * @param fIds - 管网fids数组（"fid"为各构件要素的唯一标识ID，可选）
 */
export async function setPipeFlowState(
    App: any,
    pipeFlowdirction: number,
    pipeFlowStyle: number,
    color: string,
    visible: boolean,
    fIds?: number[],
): Promise<void> {
    if (!App) {
        console.warn("⚠️ App 实例无效");
        return;
    }

    if (!pipelineCache.pipeline) {
        console.warn("⚠️ 尚未创建管网，请先调用 createPipeline()");
        return;
    }

    try {
        console.log(`👁️ 正在设置管网流向为 ${pipeFlowdirction} ,样式为${pipeFlowStyle}, 颜色为${color}..., 显示为${visible}`);

        const jsondata = {
            "apiClassName": "WimPipeAPI",
            "apiFuncName": "SetPipeFlowState",
            "args":
            {
                "guid": "",  //为空即可
                "eid": pipelineCache.pipeline.eid,
                "visible": visible,
                "fIds": fIds,
                "flow": pipeFlowdirction,
                "type": pipeFlowStyle,
                "color": color,
                "reset": false
            }
        }

        const res = await App.Customize.RunCustomizeApi(jsondata);

        if (res.success) {
            console.log(
                `✅ 管网流向设置成功: ${pipeFlowdirction} ,样式为${pipeFlowStyle}, 颜色为${color}..., 显示为${visible} (${fIds?.length ? fIds.join(", ") : "全部类型"})`
            );
        } else {
            console.error("❌ 管网流向设置失败:", res);
        }
    } catch (error) {
        console.error("🚨 setPipeFlowState 执行出错:", error);
    }
}

/**
 * 获取当前缓存的管网对象（如果需要直接访问）
 */
export function getPipeline(): any {
    return pipelineCache.pipeline;
}

