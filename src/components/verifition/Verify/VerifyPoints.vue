<template>
  <div
    style="position: relative"
  >
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{'width': setSize.imgWidth,
                 'height': setSize.imgHeight,
                 'background-size' : setSize.imgWidth + ' '+ setSize.imgHeight,
                 'margin-bottom': vSpace + 'px'}"
      >
        <div
          v-show="showRefresh"
          class="verify-refresh"
          style="z-index:3"
          @click="refresh"
        >
          <i class="iconfont icon-refresh" />
        </div>
        <img
          ref="canvasRef"
          :src="pointBackImgBase?('data:image/png;base64,'+pointBackImgBase):defaultImg"
          alt=""
          style="width:100%;height:100%;display:block"
          @click="bindingClick?canvasClick($event):undefined"
        >

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color':'#1abd6c',
            color:'#fff',
            'z-index':9999,
            width:'20px',
            height:'20px',
            'text-align':'center',
            'line-height':'20px',
            'border-radius': '50%',
            position:'absolute',
            top:parseInt(tempPoint.y-10) + 'px',
            left:parseInt(tempPoint.x-10) + 'px'
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': barSize.height, -->
    <div
      class="verify-bar-area"
      :style="{'width': setSize.imgWidth,
               'color': barAreaColor,
               'border-color': barAreaBorderColor,
               'line-height':barSize.height}"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script type="text/babel">
/**
     * VerifyPoints
     * @description 点选
     * */
import { resetSize, _code_chars, _code_color1, _code_color2 } from './../utils/util'
import { aesEncrypt } from './../utils/ase'
import { reqGet, reqCheck } from './../api/index'


const props = defineProps({
  // 弹出式pop，固定fixed
  mode: {
    type: String,
    default: 'fixed'
  },
  captchaType: {
    type: String
  },
  // 间隔
  vSpace: {
    type: Number,
    default: 5
  },
  imgSize: {
    type: Object,
    default () {
      return {
        width: '310px',
        height: '155px'
      }
    }
  },
  barSize: {
    type: Object,
    default () {
      return {
        width: '310px',
        height: '40px'
      }
    }
  },
  defaultImg: {
    type: String,
    default: ''
  }
})

var secretKey = ref('') // 后端返回的ase加密秘钥
var checkNum = ref(3) // 默认需要点击的字数
var fontPos = ref([]) // 选中的坐标信息
var checkPosArr = ref([]) // 用户点击的坐标
var num = ref(1) // 点击的记数
var pointBackImgBase = ref('') // 后端获取到的背景图片
var poinTextList = ref([]) // 后端返回的点击字体顺序
var backToken = ref('') // 后端返回的token值
var setSize = reactive({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0
})
var tempPoints = ref([])
var text = ref('')
var barAreaColor = reactive(undefined)
var barAreaBorderColor = reactive(undefined)
var showRefresh = ref(true)
var bindingClick = ref(true)
  computed: {
    resetSize () {
      return resetSize
    }
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler () {
        init()
      }
    }
  },
onMounted(() => {
  // 禁止拖拽
  $el.onselectstart = function () {
    return false
  }
})

const init  = () => {
  // 加载页面
  fontPos.splice(0, fontPos.length)
  checkPosArr.splice(0, checkPosArr.length)
  num = 1
  getPictrue()
  nextTick(() => {
    setSize = resetSize(this)  // 重新设置宽度高度
    $parent.$emit('ready', this)
  })
}
const canvasClick  = (e) => {
  checkPosArr.push(getMousePos($refs.canvas, e))
  if (num == checkNum) {
    num = createPoint(getMousePos($refs.canvas, e))
    // 按比例转换坐标值
    checkPosArr = pointTransfrom(checkPosArr, setSize)
    // 等创建坐标执行完
    setTimeout(() => {
      // var flag = comparePos(fontPos, checkPosArr);
      // 发送后端请求
      const captchaVerification = secretKey ? aesEncrypt(backToken + '---' + JSON.stringify(checkPosArr), secretKey) : backToken + '---' + JSON.stringify(checkPosArr)
      const data = {
        captchaType: captchaType,
        pointJson: secretKey ? aesEncrypt(JSON.stringify(checkPosArr), secretKey) : JSON.stringify(checkPosArr),
        token: backToken
      }
      reqCheck(data).then(res => {
        if (res.repCode == '0000') {
          barAreaColor = '#4cae4c'
          barAreaBorderColor = '#5cb85c'
          text = '验证成功'
          bindingClick = false
          if (mode == 'pop') {
            setTimeout(() => {
              $parent.clickShow = false
              refresh()
            }, 1500)
          }
          $parent.$emit('success', { captchaVerification })
        } else {
          $parent.$emit('error', this)
          barAreaColor = '#d9534f'
          barAreaBorderColor = '#d9534f'
          text = '验证失败'
          setTimeout(() => {
            refresh()
          }, 700)
        }
      })
    }, 400)
  }
  if (num < checkNum) {
    num = createPoint(getMousePos($refs.canvas, e))
  }
}

// 获取坐标
const getMousePos: function  = (obj, e) => {
  const x = e.offsetX
  const y = e.offsetY
  return { x, y }
}
// 创建坐标点
const createPoint: function  = (pos) => {
  tempPoints.push(Object.assign({}, pos))
  return ++num
}
const refresh: function  = () => {
  tempPoints.splice(0, tempPoints.length)
  barAreaColor = '#000'
  barAreaBorderColor = '#ddd'
  bindingClick = true
  fontPos.splice(0, fontPos.length)
  checkPosArr.splice(0, checkPosArr.length)
  num = 1
  getPictrue()
  text = '验证失败'
  showRefresh = true
}

// 请求背景图片和验证图片
const getPictrue  = () => {
  const data = {
    captchaType: captchaType,
    clientUid: localStorage.getItem('point'),
    ts: Date.now() // 现在的时间戳
  }
  reqGet(data).then(res => {
    if (res.repCode == '0000') {
      pointBackImgBase = res.repData.originalImageBase64
      backToken = res.repData.token
      secretKey = res.repData.secretKey
      poinTextList = res.repData.wordList
      text = '请依次点击【' + poinTextList.join(',') + '】'
    } else {
      text = res.repMsg
    }

    // 判断接口请求次数是否失效
    if (res.repCode == '6201') {
      pointBackImgBase = null
    }
  })
}
// 坐标转换函数
const pointTransfrom  = (pointArr, imgSize) => {
  const newPointArr = pointArr.map(p => {
    const x = Math.round(310 * p.x / parseInt(imgSize.imgWidth))
    const y = Math.round(155 * p.y / parseInt(imgSize.imgHeight))
    return { x, y }
  })
  // console.log(newPointArr,"newPointArr");
  return newPointArr
}

</script>
