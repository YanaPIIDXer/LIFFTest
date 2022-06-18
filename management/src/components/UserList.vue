<template>
  <div class="user-list">
    <select @change="$emit('input', $event.target.value)">
      <option v-for="item in list" :key="item.userId" :value="item.userId">
        {{ item.displayName }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserList',
  data: function () {
    return {
      list: [{ userId: "", displayName: "" }]
    }
  },
  mounted: async function () {
    try {
      const response = await axios.get('https://yanap-liff-app-bot.herokuapp.com/users', {
        headers: {
          authorization: `Bearer ${process.env.VUE_APP_ADMIN_USER_ID}`
        }
      })
      if (!response || response.status !== 200) { throw response }
      this.list = this.list.concat(response.data.users)
    } catch {
      alert('ユーザリストの取得失敗')
    }
  },
}
</script>