<template>
  <div class="list-container">
    <ul class="list" v-if="items.length > 0">
      <li class="list__item" v-for="(item, index) in formatedListValues" :key="index">{{ item }}</li>
    </ul>
    <div class="empty">Пожалуйста выберите что-нибудь!</div>
  </div>
</template>

<script>
  export default {
    name: 'List',
    props: {
      items: Array
    },
    computed: {
      formatedListValues () {
        let result = [];

        for(let i = 0; i < this.items.length; i++) {
          if (this.items[i].length !== 0) result.push(this.items[i].join(', '))
        }

        return result;
      }
    }
  }
</script>

<style lang="scss">
  .list-container {
    margin-bottom: 16px;
  }
</style>