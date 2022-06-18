<template>
  <div class="register">
    <button @click="onRegister">ユーザ登録</button>
  </div>
</template>

<script>
export default {
  name: 'Register',
  methods: {
    /**
     * 登録ボタン押下
     */
    onRegister: async function () {
      alert('登録ボタン押下')
    }
  }
}
</script>
