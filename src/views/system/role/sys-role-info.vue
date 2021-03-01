<template>
  <div />
</template>

<script>
import sysRoleApi from '@/api/sys-role'
export default {
  props:{
    activeId:{
      type: String,
      default: null
    }
  },
  data(){
    return {
      // 回显角色信息对象
      sysRole:{}
    }
  },
  watch: {
    activeId: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.getById(newVal)
      }
    }
  },
  methods: {
    // 根据id查询
    getById(id) {
      sysRoleApi.get(id).then(res => {
        this.sysRole = res.data
      })
    }
  }
}
</script>

<style scoped>
.header-container {
  text-align: center;
  margin-bottom: 15px;
}
</style>
