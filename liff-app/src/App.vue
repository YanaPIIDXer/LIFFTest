<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld :msg="message" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import liff from '@line/liff'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data: function () {
    return {
      message: 'Hello, World',
    }
  },
  mounted: async function () {
    try {
      await liff.init({
        liffId: process.env.VUE_APP_LIFF_ID,
      })
    } catch {
      this.message = "LIFF Init Error..."
      return
    }
    this.message = "LIFF Init OK!"
    
    try {
      const profile = await liff.getProfile()
      this.mesage = profile.displayName
    } catch {
      this.message = "LIFF GetProfile Error..."
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
