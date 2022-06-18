<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import liff from '@line/liff'

export default {
  name: 'App',
  components: {
  },
  data: function () {
    return {
    }
  },
  mounted: async function () {
    try {
      await liff.init({
        liffId: process.env.VUE_APP_LIFF_ID,
      })
    } catch {
      alert("LIFF初期化エラー")
      return
    }

    if (!liff.isLoggedIn()) {
      liff.login()
    }
  }
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
