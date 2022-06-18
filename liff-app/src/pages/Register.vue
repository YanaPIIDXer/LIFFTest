<template>
  <div class="register">
    <button @click="onRegister">ユーザ登録</button>
  </div>
</template>

<script>
import liff from '@line/liff'
import axios from 'axios'

export default {
  name: 'Register',
  methods: {
    /**
     * 登録ボタン押下
     */
    onRegister: async function () {
      if (!liff.isLoggedIn()) {
        alert('ログインしていません')
        return
      }

      let token = null
      try {
        token = liff.getIDToken()
        if (!token) { throw token }
      } catch {
        alert('トークン取得エラー')
        return
      }

      try {
        const response = await axios.post('https://yanap-liff-app-bot.herokuapp.com/register', {
          token: token,
        })
        if (!response || response.status !== 200) { throw response }
      } catch {
        alert('登録エラー')
        return
      }
      alert('登録しました')
    }
  }
}
</script>
