<template>
  <div class="language-select">
    <a-select :default-value="this.$i18n.locale" style="width: 120px" @change="handleChange">
      <a-icon slot="suffixIcon" type="global" />
      <a-select-option value="vi">
        Vietnamese
      </a-select-option>
      <a-select-option value="en">
        English
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  methods: {
    handleChange(value) {
      this.$store.dispatch('setLang', value)
    },
  },
  created(){
    console.log(this.$i18n.locale)
  }
};
</script>

<style scoped>
.language-select{
    display: inline-block;
    float: right;
    margin-right: 10px;
}
</style>
