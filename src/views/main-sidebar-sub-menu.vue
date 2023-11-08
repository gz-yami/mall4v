<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'"
  >
    <template #title>
      <icon-svg
        :name="menu.icon || ''"
        class="site-sidebar__menu-icon"
      />
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.menuId"
      :menu="item"
      :dynamic-menu-routes="dynamicMenuRoutes"
    />
  </el-submenu>
  <el-menu-item
    v-else
    :index="menu.menuId + ''"
    @click="gotoRouteHandle(menu)"
  >
    <icon-svg
      :name="menu.icon || ''"
      class="site-sidebar__menu-icon"
    />
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script setup>
import SubMenu from './main-sidebar-sub-menu'

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  dynamicMenuRoutes: {
    type: Array,
    required: true
  }
})
  computed: {
    sidebarLayoutSkin: {
      get () { return $store.state.common.sidebarLayoutSkin }
    }
  },

// 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
const gotoRouteHandle  = (menu) => {
  const route = dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
  if (route.length >= 1) {
    useRouter().push({ name: route[0].name })
  }
}

</script>
