<template>
  <div id="app">
    <div class="loader" v-if="isLoading">Загрузка...</div>
    <div class="container" v-else-if="items.length !== 0">
      <div class="error" v-if="status.state === 'error'">
        {{ status.message }}
      </div>
      <div class="application" v-else>
        <div class="selects-container">
          <Select @input="setState" :options="options" v-for="(options, index) in selectData" :value="state[position][index]" :key="index" :id="index"></Select>
        </div>
        <List :items='state[position]'></List>
        <div class="button-container">
          <button class="btn" @click="setPosition('back')" :disabled='position === 0'>Отменить</button>
          <button class="btn" @click="setPosition('forward')" :disabled='state.length === 0 || position === state.length - 1'>Вернуть</button>
          <button class="btn" @click="reset">Сбросить</button>
        </div>
      </div>
    </div>
    <div class="empty" v-else>Массив пуст!</div>
  </div>
</template>

<script>
  import Select from './components/Select';
  import List from './components/List';
  import Api from './services/api';
  import { flatPolyfill, isEmpty } from './services/common';

  export default {
    name: 'App',
    components: {
      Select,
      List
    },
    async created () {
      this.isLoading = true;

      await Api().get('master/db.json')
        .then((res) => {
          this.items = res.data.testArr;
          this.$store.commit('setStatus', {
            state: 'done',
            message: ''
          });
        })
        .catch((error) => {
          this.$store.commit('setStatus', {
            state: 'error',
            message: 'Произошла ошибка!'
          });
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    computed: {
      status () {
        return this.$store.getters['status'];
      },
      selectData () {
        const types = ['object', 'number', 'boolean', 'string', 'undefined', 'symbol'];
        let array = [...flatPolyfill(this.items)];
        let objectPrimetives = {};
        let result = [];

        for (let i = 0; i < array.length; i++) {
          const element = array[i];

          if (element === null || (typeof element === 'object' && isEmpty(element))) continue;
          if (types.includes(typeof element)) {
            const type = typeof element;
            objectPrimetives[type] === undefined ? objectPrimetives[type] = [element] : objectPrimetives[type].push(element);
          }
        }

        for (let key in objectPrimetives) {
          result.push(objectPrimetives[key]);
        }
        
        return result;
      },
    },
    methods: {
      reset () {
        this.state = [[]];
        this.position = 0;
      },
      setState (items, id) {
        if (this.state && this.state.length >= 10) {
          this.position = this.state.length - 1;
          this.state.shift();
        } else {
          this.position = this.state.length - 1;
          this.position++;
        }
        this.state[this.position] = [...this.state[this.position - 1]];
        this.state[this.position][id] = [...items];
        console.log(this.state);
        //нужно сохранить текущее состояние и на основе него изменять state
      },
      setPosition (where) {
        where === 'forward' ? this.position++ : this.position--;
      }
    },
    data () {
      return {
        state: [[]],
        position: 0,
        isLoading: false,
        items: []
      }
    }
  }
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .selects-container {
    display: flex;
    max-height: 40px;
    margin-bottom: 16px;
  }

  .buttons-container {
    display: flex;
  }

  .btn {
    display: inline-block;
    max-width: 200px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    outline: none;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
</style>
