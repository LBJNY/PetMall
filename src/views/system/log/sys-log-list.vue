<template>
  <div>
    <!-- 搜索表单开始 -->
    <div class="search-form">
      <el-form :inline="true" size="small" :model="sysLogDto">
        <el-form-item>
          <el-input v-model="sysLogDto.logUrl" placeholder="请求地址" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="sysLogDto.logController" placeholder="控制层" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="sysLogDto.logStatus" clearable placeholder="访问状态 ">
            <el-option
              label="正常"
              value="1"
            />
            <el-option
              label="异常"
              value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="block">
            <el-date-picker
              v-model="sysLogDto.createdDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="sysLogDto = {}">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索表单结束 -->
    <!-- 数据表格开始 -->
    <div class="data-table">
      <el-table
        v-loading="loading"
        :data="dataPage.list"
        header-row-class-name="table-header"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="logUrl"
          label="请求地址"
        />
        <el-table-column
          prop="logStatus"
          label="状态">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.logStatus === 1" size="small" >成功</el-tag>
            <el-tag type="danger" v-if="row.logStatus === 0" size="small">失败</el-tag>
          </template> 
        </el-table-column>
        <el-table-column
          prop="logUa"
          label="UA"
        />
        <el-table-column
          prop="logController"
          label="控制层"
        />
        <el-table-column
          prop="logMethod"
          label="请求方式"
        />
        <el-table-column
          prop="logTime"
          label="响应时间"
        />
        <el-table-column
          prop="logIp"
          label="请求IP"
        />
        <el-table-column
          prop="createdDate"
          label="创建时间"
        />
        <el-table-column
          prop="createdBy"
          label="创建人"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="text" icon="el-icon-document" @click="toInfo(row.logId)">详情</el-button>
            <el-dropdown class="button-group">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" icon="el-icon-delete" @click="toDelete(row.logId)">删除</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page="sysLogDto.currentPage"
        :page-sizes="[10,20,30,50]"
        :page-size="sysLogDto.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataPage.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 数据表格结束 -->

    <!-- 详情弹窗 -->
    <el-dialog title="日志详情" width="30%" :visible.sync="infoDialog">
      <sys-log-info :active-id="activeId" />
    </el-dialog>
    <!-- 详情弹窗结束 -->

  </div>
</template>
<script>
import sysLogApi from '@/api/sys-log'
import SysLogInfo from './sys-log-info.vue'
export default {
  components: {
    SysLogInfo
  },
  data() {
    return {
      sysLogDto: {
        currentPage: 1,
        pageSize: 10
      },
      dataPage: {
        list: [],
        totalCount: 0,
        totalPage: 0
      },
      loading: false,
      activeId: '',
      infoDialog: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    handleSizeChange(val) {
      this.sysLogDto.pageSize = val
      this.getByPage()
    },
    toDelete(id) {
      this.$confirm('此操作会删除该日志，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        sysLogApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
      })
    },
    toInfo(id) {
      this.activeId = id
      this.infoDialog = true
    },
    handleCurrentChange(val) {
      this.sysLogDto.currentPage = val
      this.getByPage()
    },
    search() {
      this.sysLogDto.currentPage = 1
      this.getByPage()
    },
    closeDialog() {
      this.infoDialog = false
    },
    getByPage() {
      this.closeDialog()
      this.loading = true
      sysLogApi.getByPage(this.sysLogDto).then(res => {
        this.dataPage.list = res.data.list
        this.dataPage.totalCount = res.data.totalCount
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.pagination {
  margin-top: 15px;
}
.mid-button-group {
  margin-bottom: 15px;
}
.button-group {
  margin-left: 10px;
}
</style>
