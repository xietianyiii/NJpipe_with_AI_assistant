import * as shp from "shapefile"

export class ShapefileLoader {
  constructor() {
    this.files = {}
  }

  // 处理上传的文件
  handleFileUpload(files) {
    this.processFiles(files)
  }

  // 处理 SHP 和 DBF 文件
  async processFiles(files) {
    const fileMap = {}
    console.log(files, "====")

    // 分类文件
    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase()
      fileMap[ext] = file
    })

    if (!fileMap.shp) {
      console.error("未找到 SHP 文件")
      return
    }

    // 读取文件
    const shpData = await this.readFile(fileMap.shp)
    const dbfData = fileMap.dbf ? await this.readFile(fileMap.dbf) : null
    const prjData = fileMap.prj ? await this.readFile(fileMap.prj) : null

    // 转换为 GeoJSON
    const geojson = await this.convertToGeoJSON(shpData, dbfData)

    // 处理投影
    if (prjData) {
      const projection = await this.parseProjection(prjData)
      geojson.projection = projection
    }

    return geojson
  }

  // 读取文件为 ArrayBuffer
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // 转换为 GeoJSON
  async convertToGeoJSON(shpArrayBuffer, dbfArrayBuffer) {
    return await shp.read(shpArrayBuffer, dbfArrayBuffer)
  }

  // 解析投影文件
  async parseProjection(prjArrayBuffer) {
    const text = new TextDecoder().decode(prjArrayBuffer)
    return text.trim()
  }

  // 提取属性表
  extractAttributeTable(geojson) {
    if (!geojson || !geojson.features) {
      return []
    }

    return geojson.features.map((feature) => ({
      id: feature.id || feature.properties.FID || feature.properties.ID,
      ...feature.properties,
      geometryType: feature.geometry.type,
      coordinatesCount: this.countCoordinates(feature.geometry),
    }))
  }

  // 统计坐标点数量
  countCoordinates(geometry) {
    if (!geometry || !geometry.coordinates) return 0

    const countRecursive = (coords) => {
      if (Array.isArray(coords[0]) && typeof coords[0][0] === "number") {
        return coords.length
      }
      return coords.reduce((sum, coord) => sum + countRecursive(coord), 0)
    }

    return countRecursive(geometry.coordinates)
  }
}
