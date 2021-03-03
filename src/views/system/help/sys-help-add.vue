<template>
  <div>
    <el-form :model="sysHelp" label-width="80px" size="small">
      <el-form-item label="标题">
        <el-input v-model="sysHelp.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce v-model="sysHelp.content" :height="300" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import sysHelpApi from '@/api/sys-help'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      // 表单对象
      sysHelp: {}
    }
  },
  methods: {
    // 添加
    add() {
      sysHelpApi.save(this.sysHelp).then(res => {
        this.$message.success(res.msg)
        this.$emit('after')
        this.$emit('close')
      })
    }
  }
}
</script>

<style>

</style>
