<script lang="ts">
import { defineComponent } from 'vue'
import Menu from '@/components/Menu.vue' 

export default defineComponent({
  components: { Menu }
})
</script>

<template>
  <Menu />
  <RouterView />
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
