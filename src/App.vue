<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .el-dropdown-link{
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down{
    font-size: 12px;
  }
  .handle-button{
    margin-left: 10px;
  }
</style>
