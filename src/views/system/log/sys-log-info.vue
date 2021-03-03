<template>
  <div>
    <el-form v-loading="loading" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="控制层">{{ log.logController }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求IP">{{ log.logIp }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="请求路径">{{ log.logUrl }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态 ">{{ log.logStatus }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请求方式">{{ log.logMethod }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创建时间">{{ log.createdDate }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人">{{ log.createdBy }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="响应时间">{{ log.logTime }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="UA标识">{{ log.logUa }}</el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="log.logMessage" :gutter="20">
        <el-col :span="24">
          <el-form-item label="异常文本">{{ log.logMessage }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="请求参数">
            <json-editor ref="jsonEditor" v-model="log.logParamsJson" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="响应结果">
            <json-editor ref="jsonEditor" v-model="log.logResultJson" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script>
import sysLogApi from '@/api/sys-log'
import JsonEditor from '@/components/JsonEditor'
export default {
  props: {
    activeId: {
      type: String,
      default: null
    }
  },
  components:{
    JsonEditor
  },
  data() {
    return {
      log: {
        logParamsJson: '',
        logResultJson: ''
      },
      loading: false
    }
  },
  watch: {
    activeId: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.loading = true
        this.getById(newVal)
      }
    }
  },
  methods:{
    getById(id){
      sysLogApi.get(id).then(res => {
        this.log = res.data
        console.log(111111)
        console.log(res.data.logParams)
        console.log(res.data.logResult)
        // 判断参数是否存在
        if (res.data.logParams) {
          this.log.logParamsJson=JSON.parse(res.data.logParams)
        }
        if (res.data.logResult) {
          this.log.logResultJson=JSON.parse(res.data.logResult)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>
.header-image {
  margin: auto;
  width: 100px;
  height: 100px;
}
.image-container {
  text-align: center;
}
.CodeMirror pre {
  line-height: 16px !important;
}
.json-editor {
  min-height: 200px;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
