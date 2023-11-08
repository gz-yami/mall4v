<template>
  <nav
    class="site-navbar"
    :class="'site-navbar--' + navbarLayoutType"
  >
    <div class="site-navbar__header">
      <h1
        class="site-navbar__brand"
        @click="$router.push({ name: 'home' })"
      >
        <a
          class="site-navbar__brand-lg"
          href="javascript:;"
        >mall4j建站后台</a>
        <a
          class="site-navbar__brand-mini"
          href="javascript:;"
        >mall4j</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal"
      >
        <el-menu-item
          class="site-navbar__switch"
          index="0"
          @click="sidebarFold = !sidebarFold"
        >
          <icon-svg name="zhedie" />
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal"
      >
        <el-menu-item
          class="site-navbar__avatar"
          index="3"
        >
          <el-dropdown
            :show-timeout="0"
            placement="bottom"
          >
            <span class="el-dropdown-link">
              {{ userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-dropdown-item @click="updatePasswordHandle()">
                  修改密码
                </el-dropdown-item>
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-dropdown-item @click="logoutHandle()">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePassowrdVisible"
      ref="updatePassowrdRef"
    />
  </nav>
</template>

<script setup>
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo } from '@/utils'


var updatePassowrdVisible = ref(false)
  computed: {
    navbarLayoutType: {
      get () { return $store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return $store.state.common.sidebarFold },
      set (val) { $store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return $store.state.common.mainTabs },
      set (val) { $store.commit('common/updateMainTabs', val) }
    },
    userName: {
      get () { return $store.state.user.name }
    }
  },

// 修改密码
const updatePasswordHandle  = () => {
  updatePassowrdVisible = true
  nextTick(() => {
    updatePassowrdRef.value?.init()
  })
}
// 退出
const logoutHandle  = () => {
  ElMessageBox.confirm('确定进行[退出]操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/logOut'),
      method: 'post',
      data: http.adornData()
    }).then(({ data }) => {
      clearLoginInfo()
      useRouter().push({ name: 'login' })
    })
  }).catch(() => {})
}

</script>
