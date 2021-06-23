<template>
  <div class="select">
    <multiselect 
      @input="input"
      :value="value"
      :options="options"
      :multiple="true"  
      placeholder="Pick some" 
    >
    <template slot="selection" slot-scope="{ values, isOpen }">
      <span class="multiselect__single" v-if="values.length && !isOpen">{{ values.length }} options selected</span>
    </template>
  </multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import '../../node_modules/vue-multiselect/dist/vue-multiselect.min.css';

  export default {
    name: 'Select',
    components: {
      Multiselect
    },
    props: {
      id: Number,
      value: Array,
      options: Array,
    },
    methods: {
      input (value) {
        this.$emit('input',  value, this.id);
      },
    },
  }
</script>

<style lang="scss">
  .select {
    flex: 1 0;
    
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
</style>