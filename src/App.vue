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
          <button class="btn" @click="position--" :disabled='position === 0'>Отменить</button>
          <button class="btn" @click="position++" :disabled='state.length === 0 || position === state.length - 1'>Вернуть</button>
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
          this.status = {
            state: 'done',
            message: ''
          };
        })
        .catch((error) => {
            this.status = {
                state: 'error',
                message: 'Произошла ошибка'
            };
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    computed: {
      selectData () {
        const types = ['object', 'number', 'boolean', 'string', 'undefined', 'symbol'];
        let array = [...flatPolyfill(this.items)];
        let objectPrimitives = {};
        let result = [];

        for (let i = 0; i < array.length; i++) {
          const element = array[i];

          if (element === null || (typeof element === 'object' && isEmpty(element))) continue;
          if (types.includes(typeof element)) {
            const type = typeof element;
            objectPrimitives[type] === undefined ? objectPrimitives[type] = [element] : objectPrimitives[type].push(element);
          }
        }

        for (let key in objectPrimitives) {
          result.push(objectPrimitives[key]);
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
          this.state.shift();
        } else {
          this.position++;
        }
        this.state[this.position] = [...this.state[this.position - 1]];
        this.state[this.position][id] = [...items];
        this.state.splice(this.position + 1, this.state.length - this.position + 1);
      },
    },
    data () {
      return {
        status: {
          state: '',
          message: ''
        },
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
