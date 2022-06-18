<template>
  <div class="user-list">
    <select>
      <option v-for="item in list" :key="item.userId">
        {{ item.displayName }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data: function () {
    return {
      list: [{ userId: "", displayName: "" }]
    }
  },
  mounted: async function () {

  },
}
</script>