// 定义坐标类型（数组 [lon, lat, height]）
type Coord = [number, number, number?];

interface CreatedEntityInfo {
    customId: string;
    stationType: string;
}

/**
 * 批量创建 POI + 信息弹窗 + 曲线弹窗
 * @param App - WdpApi 实例
 * @param coords - 坐标数组 [[lon, lat, height], ...]
 * @param markerNormal - 普通图标 URL（单个或数组）
 * @param markerActive - 选中图标 URL（单个或数组）
 * @param infoUrl - 信息弹窗 HTML 地址（单个或数组）
 * @param curveUrl - 曲线弹窗 HTML 地址（单个或数组）
 * @param stationTypes - 泵站类型数组（与坐标一一对应）
 * @param onCurveOpen - 曲线按钮点击回调（可选）
 * @param infoWindowSize - 信息窗口大小 [width, height]（可选）
 * @param labelText - 标签内容（可选）
 * @param markerSize - 图标大小 [width, height]（可选）
 * @param coordZOffset - 坐标 Z 轴偏移量（可选）
 */
export async function createPois(
    App: any,
    coords: Coord[],
    markerNormal: string | string[] = "http://wdpapi.51aes.com/doc-static/images/static/markerNormal.png",
    markerActive: string | string[] = "http://wdpapi.51aes.com/doc-static/images/static/markerActive.png",
    infoUrl: string | string[],
    curveUrl: string | string[],
    stationTypes: string[],
    onCurveOpen?: (station: string, type?: string) => void,
    infoWindowSize?: [number, number],
    labelText?: string | string[],
    markerSize?: [number, number] | [number, number][],
    coordZOffset?: number,
): Promise<CreatedEntityInfo[]> {
    if (!App || !coords?.length) {
        console.error("❌ App 实例或坐标数组无效");
        return [];
    }

    try {
        const createdEntities: CreatedEntityInfo[] = [];

        // -------------------------
        // 1️⃣ 删除旧对象
        // -------------------------
        for (let i = 0; i < coords.length; i++) {
            const poiId = `poi-${i}`;
            const re = await App.Scene.GetByCustomId([
                poiId,
                `${poiId}-info`,
                `${poiId}-curve`,
            ]);

            if (re.success && re.result.length > 0) {
                for (const item of re.result) {
                    await item.Delete();
                }
            }
        }

        // -------------------------
        // 2️⃣ 注册全局窗口事件
        // -------------------------
        await App.Renderer.RegisterSceneEvent([
            {
                name: "OnWebJSEvent",
                func: async (res: any) => {
                    console.log("📩 内嵌窗口消息:", res);

                    const event = res?.args?.name || res?.result?.name;
                    let args = res?.args?.args || res?.result?.args;

                    if (typeof args === "string") {
                        try {
                            args = JSON.parse(args);
                        } catch {
                            console.warn("⚠️ args JSON 解析失败:", args);
                        }
                    }

                    if (event === "openCurve") {
                        const { station, index } = args || {};
                        const curveId = `poi-${index}-curve`;
                        const target = await App.Scene.GetByCustomId([curveId]);

                        if (target.success && target.result.length > 0) {
                            await target.result[0].SetVisible(true);
                        }
                        onCurveOpen?.(station, "open");
                    }

                    if (event === "closeCurve") {
                        const { station, index } = args || {};
                        const curveId = `poi-${index}-curve`;
                        const target = await App.Scene.GetByCustomId([curveId]);

                        if (target.success && target.result.length > 0) {
                            await target.result[0].SetVisible(false);
                        }
                        onCurveOpen?.(station, "close");
                    }
                },
            },
        ]);

        // -------------------------
        // 3️⃣ 组装创建数据
        // -------------------------
        const jsonData: any[] = [];

        for (let i = 0; i < coords.length; i++) {
            const coord = coords[i];
            if (!coord) continue;

            const [lon, lat, height = 71] = coord;

            const poiId = `poi-${i}`;
            const infoWinId = `${poiId}-info`;
            const curveWinId = `${poiId}-curve`;

            const stationType = stationTypes[i] || "未知类型";

            // marker 支持数组
            const currentMarkerNormal = Array.isArray(markerNormal)
                ? markerNormal[i] ?? markerNormal[0]
                : markerNormal;

            const currentMarkerActive = Array.isArray(markerActive)
                ? markerActive[i] ?? markerActive[0]
                : markerActive;

            const currentInfoUrl = Array.isArray(infoUrl)
                ? infoUrl[i] ?? infoUrl[0]
                : infoUrl;

            const currentCurveUrl = Array.isArray(curveUrl)
                ? curveUrl[i] ?? curveUrl[0]
                : curveUrl;

            // ✅ 每个 POI 独立 label 文本
            const currentLabelText =
                typeof labelText === "string"
                    ? labelText
                    : Array.isArray(labelText)
                        ? (labelText[i] ?? labelText[0] ?? "")
                        : "";

            const currentMarkerSize = Array.isArray(markerSize?.[0])
                ? (markerSize as [number, number][])[i] ?? (markerSize as [number, number][])[0]
                : (markerSize as [number, number] | undefined) ?? [140, 72];

            // -------- POI --------
            jsonData.push({
                type: "Poi",
                location: [lon, lat, height],
                customId: poiId,
                entityName: `POI-${i}`,
                customData: { index: i, stationType },
                poiStyle: {
                    markerNormalUrl: currentMarkerNormal,
                    markerActivateUrl: currentMarkerActive,
                    markerSize: currentMarkerSize,
                    markerVisible: true,
                    labelBgSize: [177, 66],
                    labelBgOffset: [-60, 81],
                    labelContent: [currentLabelText, "ffffff", "14"],
                    labelContentOffset: [45, 23],
                    labelTop: true,
                },
            });

            // -------- 信息窗 --------
            jsonData.push({
                type: "Window",
                location: [lon, lat, height],
                customId: infoWinId,
                entityName: `POI-${i}-window`,
                customData: { index: i, stationType },
                windowStyle: {
                    url: `${currentInfoUrl}?index=${i}`,
                    size: infoWindowSize || [500, 320],
                    offset: [82, 78],
                },
                bVisible: true,
            });

            // -------- 曲线窗 --------
            jsonData.push({
                type: "Window",
                location: [lon, lat, height],
                customId: curveWinId,
                entityName: `POI-${i}-curve`,
                customData: { index: i, stationType },
                windowStyle: {
                    url: `${currentCurveUrl}?index=${i}`,
                    size: [353, 227],
                    offset: [322, 70],
                },
                bVisible: false,
                visible2D: {
                    camera: { hideDistance: 2000, hideType: "default", scaleMode: "2D" },
                    interaction: { hoverTop: true },
                    entity: { overlapOrder: 3 },
                },
            });

            createdEntities.push(
                { customId: poiId, stationType },
                { customId: infoWinId, stationType },
                { customId: curveWinId, stationType }
            );
        }

        // -------------------------
        // 4️⃣ 创建实体
        // -------------------------
        const hasGroundPoint = coords.some((c) => c[2] === 0);

        const res = await App.Scene.Creates(jsonData, {
            calculateCoordZ: hasGroundPoint
                ? { coordZRef: "ground", coordZOffset: coordZOffset ?? 0 }
                : { coordZRef: "surface", coordZOffset: 20 },
        });

        console.log("✅ POI 批量创建完成:", res);
        return createdEntities;

    } catch (error) {
        console.error("❌ 创建 POI 失败:", error);
        return [];
    }
}