<template>
  <div
    :class="{fullscreen:fullscreen}"
    class="tinymce-container"
    :style="{width:containerWidth}"
  >
    <textarea
      :id="tinymceId"
      class="tinymce-textarea"
    />
    <div class="editor-custom-btn-container">
      <el-upload
        class="upload-demo"
        list-type="picture"
        :action="$http.adornUrl('/admin/file/upload/element')"
        :headers="{Authorization: $cookie.get('Authorization')}"
        :on-success="imageSuccessCBK"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <el-button
          
          type="primary"
        >
          点击上传图片
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import mulPicUpload from '@/components/mul-pic-upload'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const resourceCdn1 = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const resourceCdn2 = 'https://unpkg.zhimg.com/tinymce-all-in-one@4.9.3/tinymce.min.js'
const resourceCdn3 = 'https://unpkg.com/tinymce-all-in-one@4.9.3/tinymce.min.js'



const props = defineProps({
  id: {
    type: String,
    default: function () {
      return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    }
  },
  value: {
    type: String,
    default: ''
  },
  toolbar: {
    type: Array,
    required: false,
    default () {
      return []
    }
  },
  menubar: {
    type: String,
    default: 'file edit insert view format table'
  },
  height: {
    type: [Number, String],
    required: false,
    default: 360
  },
  width: {
    type: [Number, String],
    required: false,
    default: 'auto'
  }
})
  emits: ['input'],


var hasChange = ref(false)
var hasInit = ref(false)
var tinymceId = reactive(id)
var fullscreen = ref(false)
var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

  computed: {
    language () {
      return localStorage.getItem('lang') || 'zh_CN'
    },
    containerWidth () {
      const width = width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },

  watch: {
    value (val) {
      if (!hasChange && hasInit) {
        nextTick(() =>
          window.tinymce.get(tinymceId).setContent(val || ''))
      }
    },
    language () {
      destroyTinymce()
      nextTick(() => initTinymce())
    }
  },

onMounted(() => {
  init()
})

onActivated(() => {
  if (window.tinymce) {
    initTinymce()
  }
})

  deactivated () {
    destroyTinymce()
  },

  unmounted () {
    destroyTinymce()
  },


const init  = () => {
  // dynamic load tinymce from cdn
  load(resourceCdn1, (err) => {
    if (!err) {
      initTinymce()
      return
    }
    load(resourceCdn2, (err2) => {
      if (!err2) {
        initTinymce()
        return
      }
      load(resourceCdn3, (err3) => {
        if (!err3) {
          initTinymce()
          return
        }
        ElMessage.error(err.message)
      })
    })
  })
}
const initTinymce  = () => {
  const _this = this
  window.tinymce.init({
    language: language,
    selector: `#${tinymceId}`,
    height: height,
    body_class: 'panel-body ',
    object_resizing: false,
    toolbar: toolbar.length > 0 ? toolbar : toolbar,
    menubar: menubar,
    plugins,
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
    init_instance_callback: editor => {
      if (_value) {
        editor.setContent(_value)
      }
      _hasInit = true
      editor.on('NodeChange Change KeyUp SetContent', () => {
        hasChange = true
        emit('update:modelValue', editor.getContent())
      })
    },
    setup (editor) {
      editor.on('FullscreenStateChanged', (e) => {
        _fullscreen = e.state
      })
    },
    // it will try to keep these URLs intact
    // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
    // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
    convert_urls: false
    // 整合七牛上传
    // images_dataimg_filter(img) {
    //   setTimeout(() => {
    //     const $image = $(img);
    //     $image.removeAttr('width');
    //     $image.removeAttr('height');
    //     if ($image[0].height && $image[0].width) {
    //       $image.attr('data-wscntype', 'image');
    //       $image.attr('data-wscnh', $image[0].height);
    //       $image.attr('data-wscnw', $image[0].width);
    //       $image.addClass('wscnph');
    //     }
    //   }, 0);
    //   return img
    // },
    // images_upload_handler(blobInfo, success, failure, progress) {
    //   progress(0);
    //   const token = _$store.getters.token;
    //   getToken(token).then(response => {
    //     const url = response.data.qiniu_url;
    //     const formData = new FormData();
    //     formData.append('token', response.data.qiniu_token);
    //     formData.append('key', response.data.qiniu_key);
    //     formData.append('file', blobInfo.blob(), url);
    //     upload(formData).then(() => {
    //       success(url);
    //       progress(100);
    //     })
    //   }).catch(err => {
    //     failure('出现未知问题，刷新页面，或者联系程序员')
    //     console.log(err);
    //   });
    // },
  })
}
const destroyTinymce  = () => {
  const tinymce = window.tinymce.get(tinymceId)
  if (fullscreen) {
    tinymce.execCommand('mceFullScreen')
  }

  if (tinymce) {
    tinymce.destroy()
  }
}
const setContent  = (value) => {
  if (window.tinymce) {
    window.tinymce.get(tinymceId).setContent(value)
  }
}
const getContent  = () => {
  window.tinymce.get(tinymceId).getContent()
}
// 限制图片上传大小
const beforeAvatarUpload  = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg'
  if (!isJPG) {
    ElMessage.error('上传图片只能是jpeg/jpg/png/gif 格式!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M && isJPG
}
const imageSuccessCBK  = (response, file, fileList) => {
  const _this = this
  fileList.forEach(v => {
    window.tinymce.get(_tinymceId).insertContent(`<img class="wscnph" src="${resourcesUrl + v.response.data}" >`)
  })
}

</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
