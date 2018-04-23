<template>
  <footer :style="{color}">
    {{year}} &copy; 中国印钞造币总公司提供技术支持
  </footer>
</template>
<style lang="less" scoped>
footer {
  padding-bottom: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
<script>
export default {
  computed: {
    year() {
      let date = new Date();
      return date.getFullYear();
    }
  },
  props: {
    color: {
      default: "#fff"
    }
  }
};
</script>
