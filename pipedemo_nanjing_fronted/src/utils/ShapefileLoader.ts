import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson"
import * as shp from "shapefile"

export class ShapefileLoader {
  files: { [key: string]: File }
  constructor() {
    this.files = {}
  }

  // 处理上传的文件
  handleFileUpload(files: FileList) {
    this.processFiles(files)
  }

  // 处理 SHP 和 DBF 文件
  async processFiles(files: FileList) {
    const fileMap: { [key: string]: File } = {}
    console.log(files, "====")

    // 分类文件
    Array.from(files).forEach((file: any) => {
      const ext = file.name.split(".").pop().toLowerCase()
      fileMap[ext] = file
    })

    if (!fileMap.shp) {
      console.error("未找到 SHP 文件")
      return
    }

    // 读取文件
    const shpData = (await this.readFile(fileMap.shp)) as shp.Openable
    const dbfData = fileMap.dbf ? await this.readFile(fileMap.dbf) : null
    const prjData = fileMap.prj ? await this.readFile(fileMap.prj) : null

    // 转换为 GeoJSON
    const geojson = (await this.convertToGeoJSON(shpData, dbfData as shp.Openable)) as any

    // 处理投影
    if (prjData) {
      const projection = await this.parseProjection(prjData as AllowSharedBufferSource)
      geojson.projection = projection
    }

    return geojson
  }

  // 读取文件为 ArrayBuffer
  readFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // 转换为 GeoJSON
  async convertToGeoJSON(shpArrayBuffer: shp.Openable, dbfArrayBuffer: shp.Openable) {
    return await shp.read(shpArrayBuffer, dbfArrayBuffer)
  }

  // 解析投影文件
  async parseProjection(prjArrayBuffer: AllowSharedBufferSource) {
    const text = new TextDecoder().decode(prjArrayBuffer)
    return text.trim()
  }

  // 提取属性表
  extractAttributeTable(geojson: any) {
    if (!geojson || !geojson.features) {
      return []
    }

    return geojson.features.map((feature: any) => ({
      id: feature.id || feature.properties.FID || feature.properties.ID,
      ...feature.properties,
      geometryType: feature.geometry.type,
      coordinatesCount: this.countCoordinates(feature.geometry),
    }))
  }

  // 统计坐标点数量
  countCoordinates(geometry: any) {
    if (!geometry || !geometry.coordinates) return 0

    const countRecursive = (coords: any) => {
      if (Array.isArray(coords[0]) && typeof coords[0][0] === "number") {
        return coords.length
      }
      return coords.reduce((sum: any, coord: any) => sum + countRecursive(coord), 0)
    }

    return countRecursive(geometry.coordinates)
  }
}
