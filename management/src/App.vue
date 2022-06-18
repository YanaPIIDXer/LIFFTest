<template>
  <div id="app">
    <UserList @input="onChangeUser" />
    <SendMessage
      :target-id="targetId"
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
      targetId: "",
    }
  },
  methods: {
    /**
     * ユーザが切り替わった
     */
    onChangeUser: function (userId) {
      this.targetId = userId
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
