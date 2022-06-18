<template>
  <div id="app">
    <UserList />
    <SendMessage
      :target-id="adminId"
    />
  </div>
</template>

<script>
import UserList from '@/components/UserList'
import SendMessage from '@/components/SendMessage'

export default {
  name: 'App',
  components: {
    UserList,
    SendMessage,
  },
  data: function () {
    return {
      adminId: process.env.VUE_APP_ADMIN_USER_ID,
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
