<template>
  <div>
    <el-form :model="sysMenu" label-width="80px" size="small">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <treeselect
              v-model="sysMenu.parentId"
              :options="menuOptions"
              :show-count="true"
              :normalizer="normalizer"
              placeholder="请选择菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="sysMenu.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">权限</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="sysMenu.menuType != 3" :gutter="20">
        <el-col :span="24">
          <el-form-item label="菜单图标">
            <select-icon @checkIcon="checkIcon" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="sysMenu.menuType === 2" :gutter="20">
        <el-col :span="24">
          <el-form-item label="组件路径">
            <el-input v-model="sysMenu.componentUrl" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单名称">
            <el-input v-model="sysMenu.menuName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序">
            <el-input-number v-model="sysMenu.orderNum" clearable controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="sysMenu.menuType != 3" :span="12">
          <el-form-item label="路由地址">
            <el-input v-model="sysMenu.routerPath" clearable />
          </el-form-item>
        </el-col>
        <el-col v-show="sysMenu.menuType != 1" :span="12">
          <el-form-item label="权限标识">
            <el-input v-model="sysMenu.permission" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="sysMenu.menuType != 3" :span="12">
          <el-form-item label="显示状态">
            <el-radio-group v-model="sysMenu.visible">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态">
            <el-radio-group v-model="sysMenu.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="warning" @click="sysMenu = {}">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import sysMenuApi from '@/api/sys-menu'
import SelectIcon from '@/components/SelectIcon'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data() {
    return {
      // 表单对象
      sysMenu: {
        // 菜单类型，1目录，2菜单，3权限
        menuType: 1
      },
      // 菜单选择树结构
      menuOptions:[]
    }
  },
  components:{
    Treeselect,
    SelectIcon
  },
  methods: {
    // 添加
    add() {
      sysMenuApi.save(this.sysMenu).then(res => {
        this.$message.success(res.msg)
        this.$emit('after')
        this.$emit('close')
      })
    },
    // 设置树形下拉框结构
    normalizer(node){
      if (!node.children) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    // 获取树形菜单数据
    getTreeList(){
      sysMenuApi.getTreeList().then(res => {
        // 清空menuOptions
        this.menuOptions = []
        const rootMenu = { menuId:0, menuName:'根菜单', children:[] }
        rootMenu.children = res.data
        this.menuOptions.push(rootMenu)
      })
    },
    // 选中图标的回调
    checkIcon(icon) {
      console.log(icon)
      // this.sysMenu.menuIcon=icon
      this.$set(this.sysMenu, 'menuIcon', icon)
    }
  },
  created() {
    this.getTreeList()
  }
}
</script>

<style>
.vue-treeselect__control {
  border: 1px solid #dcdfe6 !important;
}
</style>
<style scoped>
.icon-content {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
