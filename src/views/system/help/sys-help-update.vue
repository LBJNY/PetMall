<template>
  <div>
    <el-form :model="sysHelp" label-width="80px" size="small">
      <el-form-item label="标题">
        <el-input v-model="sysHelp.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce ref="content" v-model="sysHelp.content" :height="300" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sysHelpApi from '@/api/sys-help'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    activeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 表单对象
      sysHelp: {}
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
    // 修改
    update() {
      sysHelpApi.update(this.sysHelp).then(res => {
        this.$message.success(res.msg)
        this.$emit('after')
        this.$emit('close')
      })
    },
    // 根据id查询
    getById(id) {
      sysHelpApi.get(id).then(res => {
        this.sysHelp = res.data
        this.$refs.content.setContent(this.sysHelp.content)
      })
    }
  }
}
</script>

<style>

</style>
