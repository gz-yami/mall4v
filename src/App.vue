<template>
  <transition name="fade">
    <router-view :key="key"></router-view>
  </transition>
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
