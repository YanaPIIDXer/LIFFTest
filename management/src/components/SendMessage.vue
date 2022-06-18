<template>
  <div class="send-message">
    <form @submit="onSubmit">
      <textarea v-model="message"></textarea><br />
      <input type="submit" value="送信" :disabled="!targetId || !message" />
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SendMessage',
  props: {
    targetId: {
      type: String,
      require: true,
    }
  },
  data: function () {
    return {
      message: "",
    }
  },
  methods: {
    onSubmit: async function (e) {
      e.preventDefault()
      
      try {
        const response = await axios.post('https://yanap-liff-app-bot.herokuapp.com/message', {
          userId: this.targetId,
          message: this.message,
        })
        if (!response || !response.data.result) { throw response }
      } catch {
        alert('送信失敗')
      }
      
      this.message = ""
    }
  },
}
</script>