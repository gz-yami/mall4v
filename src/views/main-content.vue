<template>
  <main
    class="site-content"
    :class="{ 'site-content--tabs': $route.meta.isTab }"
  >
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
    >
      <el-dropdown
        class="site-tabs__tools"
        :show-timeout="0"
      >
        <i class="el-icon-arrow-down el-icon--right" />
        <template #dropdown>
          <el-dropdown-menu>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-dropdown-item @click="tabsCloseCurrentHandle">
              关闭当前标签页
            </el-dropdown-item>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-dropdown-item @click="tabsCloseOtherHandle">
              关闭其它标签页
            </el-dropdown-item>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-dropdown-item @click="tabsCloseAllHandle">
              关闭全部标签页
            </el-dropdown-item>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-dropdown-item @click="tabsRefreshCurrentHandle">
              刷新当前标签页
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <el-card :body-style="siteContentViewHeight">
          <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="yes"
          />
          <keep-alive v-else>
            <router-view v-if="item.name === mainTabsActiveName" />
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card
      v-else
      :body-style="siteContentViewHeight"
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </el-card>
  </main>
</template>

<script setup>
import { isURL } from '@/utils/validate'


  computed: {
    documentClientHeight: {
      get () { return $store.state.common.documentClientHeight }
    },
    menuActiveName: {
      get () { return $store.state.common.menuActiveName },
      set (val) { $store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return $store.state.common.mainTabs },
      set (val) { $store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return $store.state.common.mainTabsActiveName },
      set (val) { $store.commit('common/updateMainTabsActiveName', val) }
    },
    siteContentViewHeight () {
      let height = documentClientHeight - 50 - 30 - 2
      if (useRoute().meta.isTab) {
        height -= 40
        return isURL(useRoute().meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  },

// tabs, 选中tab
const selectedTabHandle  = (tab) => {
  tab = mainTabs.filter(item => item.name === tab.name)
  if (tab.length >= 1) {
    useRouter().push({ name: tab[0].name })
  }
}
// tabs, 删除tab
const removeTabHandle  = (tabName) => {
  mainTabs = mainTabs.filter(item => item.name !== tabName)
  if (mainTabs.length >= 1) {
    // 当前选中tab被删除
    if (tabName === mainTabsActiveName) {
      useRouter().push({ name: mainTabs[mainTabs.length - 1].name }, () => {
        mainTabsActiveName = useRoute().name
      })
    }
  } else {
    menuActiveName = ''
    useRouter().push({ name: 'home' })
  }
}
// tabs, 关闭当前
const tabsCloseCurrentHandle  = () => {
  removeTabHandle(mainTabsActiveName)
}
// tabs, 关闭其它
const tabsCloseOtherHandle  = () => {
  mainTabs = mainTabs.filter(item => item.name === mainTabsActiveName)
}
// tabs, 关闭全部
const tabsCloseAllHandle  = () => {
  mainTabs = []
  menuActiveName = ''
  useRouter().push({ name: 'home' })
}
// tabs, 刷新当前
const tabsRefreshCurrentHandle  = () => {
  const tempTabName = mainTabsActiveName
  removeTabHandle(tempTabName)
  nextTick(() => {
    useRouter().push({ name: tempTabName })
  })
}

</script>
