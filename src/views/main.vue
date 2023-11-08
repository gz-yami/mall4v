<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div
        class="site-content__wrapper"
        :style="{ 'min-height': documentClientHeight + 'px' }"
      >
        <main-content />
      </div>
    </template>
  </div>
</template>

<script setup>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'


var loading = ref(true)
  computed: {
    documentClientHeight: {
      get () { return $store.state.common.documentClientHeight },
      set (val) { $store.commit('common/updateDocumentClientHeight', val) }
    },
    sidebarFold: {
      get () { return $store.state.common.sidebarFold }
    },
    userId: {
      get () { return $store.state.user.id },
      set (val) { $store.commit('user/updateId', val) }
    },
    userName: {
      get () { return $store.state.user.name },
      set (val) { $store.commit('user/updateName', val) }
    }
  },

onMounted(() => {
  getUserInfo()

  resetDocumentClientHeight()
})

// 重置窗口可视高度
const resetDocumentClientHeight  = () => {
  documentClientHeight = document.documentElement.clientHeight
  window.onresize = () => {
    documentClientHeight = document.documentElement.clientHeight
  }
}
// 获取当前管理员信息
const getUserInfo  = () => {
  http({
    url: http.adornUrl('/sys/user/info'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    loading = false
    userId = data.userId
    userName = data.username
  })
}

</script>
