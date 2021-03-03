<template>
  <div>
    <el-form ref="form" :model="sysUser" label-width="80px" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :data="{dir: 'header'}"
              :headers="{Authorization:token}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账号">
            <el-input v-model="sysUser.username" readonly placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="昵称">
            <el-input v-model="sysUser.nickName" placeholder="请输入昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        <el-button type="primary" @click="update">修改</el-button>
        <el-button type="warning" @click="sysUser = {}">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import sysUserApi from '@/api/sys-user'
import sysRoleApi from '@/api/sys-role'
import { mapGetters } from 'vuex'
export default {
  props: {
    // 调用方传来的用户ID
    activeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 表单数据
      sysUser: {
        // 角色信息
        sysRole: {},
        header: ''
      },
      // 角色下拉列表
      roleList: [],
      // 文件上传地址
      uploadUrl: process.env.VUE_APP_UPLOAD_URL,
      // 图片回显地址
      imageUrl:null
    }
  },
  computed:{
    ...mapGetters(['token'])
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
    this.getAllRole()
  },
  methods: {
    // 根据id查询用户
    getById(id) {
      sysUserApi.get(id).then(res => {
        this.sysUser = res.data
        this.imageUrl = this.sysUser.header
      })
    },
    // 修改用户
    update() {
      sysUserApi.update(this.sysUser).then(res => {
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
    },
    // 图片上传方法
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data
      console.log(this.imageUrl)
      this.sysUser.header = this.imageUrl
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
