<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>

  computed: {
    key () {
      return useRoute().path + Math.random()
    }
  }

</script>
