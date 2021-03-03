<template>
  <div>
    <el-form v-loading="loading" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题">
            {{ notice.noticeTitle }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序值">
            {{ notice.sorted }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人">
            {{ notice.createdBy }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间">
            {{ notice.createdTime }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="内容">
          <div v-html="notice.noticeContent" />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import sysNoticeApi from '@/api/sys-notice'
export default {
  props: {
    activeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      notice: {},
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
          this.loading = false
        })
      }
    }
  }
}
</script>
