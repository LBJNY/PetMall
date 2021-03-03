<template>
  <div>
    <el-form :model="sysBanner" label-width="80px" size="small">
      <el-row>
        <el-col :span="12" :offset="0">
          <el-form-item label="名称">
            <el-input v-model="sysBanner.name" placeholder="请输入名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="排序">
            <el-input-number v-model="sysBanner.sort" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item label="跳转路径">
            <el-input v-model="sysBanner.url" placeholder="请输入跳转路径" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :data="{dir: 'banner'}"
              :headers="{Authorization: token}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item label="备注">
            <el-input v-model="sysBanner.note" placeholder="备注" type="textarea" :rows="2" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sysBannerApi from '@/api/sys-banner'
export default {
  data() {
    return {
      // 表单对象
      sysBanner: {},
      // 图片上传路径
      uploadUrl: process.env.VUE_APP_UPLOAD_URL,
      // 用于回显的图片路径
      imageUrl: null
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.sysBanner.pic = this.imageUrl
    },
    // 添加
    add() {
      sysBannerApi.save(this.sysBanner).then(res => {
        this.$message.success(res.msg)
        this.$emit('close')
        this.$emit('after')
      })
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
