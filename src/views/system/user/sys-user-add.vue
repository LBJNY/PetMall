<template>
  <div>
    <el-form ref="form" :model="sysUser" :rules="rules" label-width="80px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input v-model="sysUser.username" placeholder="请输入账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="sysUser.password" show-password placeholder="请输入密码" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="sysUser.nickName" placeholder="请输入昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色">
            <el-select v-model="sysUser.sysRole.roleId" style="width: 100%" clearable placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱">
            <el-input v-model="sysUser.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="sysUser.note" :rows="2" type="textarea" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="warning" @click="sysUser = {}">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sysUserApi from '@/api/sys-user'
import sysRoleApi from '@/api/sys-role'
import md5 from 'js-md5'
export default {
  data() {
    return {
      // 用户表单
      sysUser: {
        // 角色信息
        sysRole: {}
      },
      // 角色下拉列表
      roleList: [],
      // 表单校验对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '用户名最短5位', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '密码最短5位', trigger: 'change' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllRole()
  },
  methods: {
    // 添加
    add() {
      // 1.密码要md5加密
      const form = { ...this.sysUser }
      form.password = md5(form.password)
      // 2.表单校验
      sysUserApi.save(form).then(res => {
        this.$message.success(res.msg)
        // 关闭对话框，并刷新列表
        this.$emit('close')
        this.$emit('after')
      })
    },
    // 查询所有角色
    getAllRole() {
      sysRoleApi.findAll().then(res => {
        this.roleList = res.data
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
