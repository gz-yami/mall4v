import IconSvg from '@/components/icon-svg'
import './iconfont.js'

export default {
  install: app => {
    app.component('IconSvg', IconSvg);
  }
};;

const svgFiles = require.context('./svg', true, /\.svg$/)
const iconList = svgFiles.keys().map(item => svgFiles(item))

export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList () {
    return iconList.map(item => item.default.id.split('-')[1])
  }
}
