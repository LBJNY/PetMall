<template>
  <div>
    <el-form ref="form" :model="sysRole" label-width="80px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名">
            <el-input v-model="sysRole.roleName" placeholder="请输入角色名" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="排序">
            <el-input-number v-model="sysRole.roleSort" style="width: 100%" controls-position="right" :min="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="权限">
            <el-tree
              ref="authTree"
              :props="{label: 'menuName'}"
              :data="menuTree"
              show-checkbox
              :render-after-expand="false"
              node-key="menuId"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="update">修改</el-button>
        <el-button type="warning" @click="sysRole = {}">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sysRoleApi from '@/api/sys-role'
import sysMenuApi from '@/api/sys-menu'
export default {
  props:{
    activeId:{
      type: String,
      default: null
    }
  },
  data(){
    return {
      // 回显用户信息对象
      sysRole:{},
      // 菜单树
      menuTree: []
    }
  },
  watch: {
    activeId: {
      // 该属性作用就是让监听器立即生效
      immediate: true,
      // 处理监听器的实际逻辑
      handler: function(newVal, oldVal) {
        this.getById(newVal)
      }
    }
  },
  created() {
    this.getTreeList()
  },
  methods:{
    // 修改
    update() {
      const checkKeys = this.$refs.authTree.getCheckedKeys()
      const halfCheckKeys = this.$refs.authTree.getHalfCheckedKeys()
      // 合并选中的数组和半选中的数组
      checkKeys.push(...halfCheckKeys)
      this.sysRole.authIds = checkKeys
      sysRoleApi.update(this.sysRole).then(res => {
        this.$message.success(res.msg)
        this.$emit('after')
        this.$emit('close')
      })
    },
    // 根据角色ID查询出默认选中的数据
    getRoleSelectMenu(id) {
      sysMenuApi.getRoleSelectMenu(id).then(res => {
        const authIds = res.data
        if (authIds && authIds[0]) {
          this.$ref.authTree.setCheckedKeys(authIds)
        } else {
          this.$ref.authTree.setCheckedKeys([])
        }
      })
    },
    // 根据id查询
    getById(id) {
      sysRoleApi.get(id).then(res => {
        this.sysRole = res.data
        // 设置默认选中的权限树
        // 获取权限ID集合
        const authIds = this.sysRole.authIds
        if (authIds && authIds[0]) {
          // 手动设置选中
          this.$refs.authTree.setCheckedKeys(authIds)
        }
      })
    },
    // 树状查询
    getTreeList() {
      sysMenuApi.getTreeList().then(res => {
        this.menuTree = res.data
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
