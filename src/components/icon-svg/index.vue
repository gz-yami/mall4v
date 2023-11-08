<template>
  <svg
    :class="getClassName"
    :width="width"
    :height="height"
    aria-hidden="true"
  >
    <use :xlink:href="getNameRef" />
  </svg>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String
  },
  width: {
    type: String
  },
  height: {
    type: String
  }
})
  computed: {
    getName () {
      return `#icon-${name}`
    },
    getClassName () {
      return [
        'icon-svg',
          `icon-svg__${name}`,
          className && /\S/.test(className) ? `${className}` : ''
      ]
    }
  }

</script>

<style>
  .icon-svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
