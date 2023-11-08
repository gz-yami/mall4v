<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  computed: {
    key () {
      return this.$route.path + Math.random()
    }
  }
}
</script>
