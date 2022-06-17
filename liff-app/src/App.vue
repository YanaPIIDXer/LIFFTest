<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld :msg="message" />
    <button @click="sendMessage">メッセージ送信</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import liff from '@line/liff'
import axios from 'axios'

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

    if (!liff.isLoggedIn()) {
      liff.login()
    }
    
    try {
      const profile = await liff.getProfile()
      this.message = profile.displayName
    } catch {
      this.message = "LIFF GetProfile Error..."
    }
  },
  methods: {
    /**
     * メッセージ送信
     */
    sendMessage: function () {
      if (!liff.isLoggedIn()) {
        alert('ログインしてください')
        return
      }

      let userId = null
      try {
        const profile = await liff.getProfile()
        userId = profile.userId
      } catch {
        alert('プロフィール取得失敗')
        return
      }

      try {
        const response = await axios.post('https://yanap-liff-app-bot.herokuapp.com/message', {
          userId: userId,
          message: 'Motherfucking, MOTHERFUCKER!!',
        })
        if (!response || !response.data.result) { throw response }
      } catch {
        alert('メッセージ送信失敗')
        return
      }
      alert('メッセージを送信しました')
    },
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
