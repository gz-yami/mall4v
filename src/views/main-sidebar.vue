<template>
  <aside
    class="site-sidebar"
    :class="'site-sidebar--' + sidebarLayoutSkin"
  >
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapse-transition="false"
        class="site-sidebar__menu"
      >
        <el-menu-item
          index="home"
          @click="$router.push({ name: 'home' })"
        >
          <icon-svg
            name="shouye"
            class="site-sidebar__menu-icon"
          />
          <template #title>
            <span>首页</span>
          </template>
        </el-menu-item>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamic-menu-routes="dynamicMenuRoutes"
        />
      </el-menu>
    </div>
  </aside>
</template>

<script setup>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils/validate'


var dynamicMenuRoutes = ref([])
  computed: {
    sidebarLayoutSkin: {
      get () { return $store.state.common.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return $store.state.common.sidebarFold }
    },
    menuList: {
      get () { return $store.state.common.menuList },
      set (val) { $store.commit('common/updateMenuList', val) }
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
    }
  },
  watch: {
    $route: 'routeHandle'
  },
onMounted(() => {
  menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
  dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
  routeHandle(useRoute())
})

// 路由操作
const routeHandle  = (route) => {
  if (route.meta.isTab) {
    // tab选中, 不存在先添加
    let tab = mainTabs.filter(item => item.name === route.name)[0]
    if (!tab) {
      if (route.meta.isDynamic) {
        route = dynamicMenuRoutes.filter(item => item.name === route.name)[0]
        if (!route) {
          return console.error('未能找到可用标签页!')
        }
      }
      tab = {
        menuId: route.meta.menuId || route.name,
        name: route.name,
        title: route.meta.title,
        type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
        iframeUrl: route.meta.iframeUrl || ''
      }
      mainTabs = mainTabs.concat(tab)
    }
    menuActiveName = tab.menuId + ''
    mainTabsActiveName = tab.name
  }
}

</script>
