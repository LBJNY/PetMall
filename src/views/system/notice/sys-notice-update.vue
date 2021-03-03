<template>
  <div>
    <el-form size="small" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题">
            <el-input
              v-model="notice.noticeTitle"
              placeholder="请输入标题"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序值">
            <el-input-number
              v-model="notice.sorted"
              controls-position="right"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="内容">
          <markdown-editor ref="markdownEditor" v-model="content" language="zh_CN" height="500px" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="primary" @click="update">修改</el-button>
          <el-button type="warning" @click="notice = {}">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import sysNoticeApi from '@/api/sys-notice'
export default {
  components: { MarkdownEditor },
  props: {
    activeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      notice: {
      },
      content: '',
      loading: false
    }
  },
  watch: {
    activeId: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.loading = true
        sysNoticeApi.get(newVal).then(res => {
          this.notice = res.data
          if (this.notice.noticeContent) {
            this.$refs.markdownEditor.setHtml(this.notice.noticeContent)
          }
          this.loading = false
        })
      }
    }
  },
  methods: {
    update() {
      if (this.content) {
        this.notice.noticeContent = this.$refs.markdownEditor.getHtml()
      }
      sysNoticeApi.update(this.notice).then(res => {
        this.$message.success(res.msg)
        this.$emit('after')
      })
    }
  }
}
</script>
