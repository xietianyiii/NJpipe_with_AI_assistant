<script setup lang="ts">
import logoUrl from "@/assets/51WORLD-LOGO.png";
</script>

<template>
  <RouterView />
  <img :src="logoUrl" class="logo" aria-hidden="true"/>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.logo {
  position: fixed;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 13%;
  height: auto;
  opacity: 0.26;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none; /* Safari support */
  -moz-user-select: none; /* Firefox support */
  -ms-user-select: none; /* IE10+/Edge support */
}
</style>
