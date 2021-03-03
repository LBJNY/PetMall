<template>
  <div>
    <!-- 搜索表单开始 -->
    <div class="search-form">

      <el-form :inline="true" size="small" :model="page.params">
        <el-form-item>
          <el-input v-model="page.params.noticeTitle" placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="page.params.enabled" clearable placeholder="启用状态">
            <el-option
              label="启用"
              :value="1"
            />
            <el-option
              label="禁用"
              :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="page.params = {}">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索表单结束 -->
    <!-- 菜单组开始 -->
    <div class="mid-button-group">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="toAdd">添加</el-button>
    </div>
    <!-- 菜单组结束 -->
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
          prop="noticeTitle"
          label="标题"
        />
        <el-table-column
          prop="sorted"
          label="排序值"
        />
        <el-table-column
          prop="createdBy"
          label="创建人"
        />
        <el-table-column
          prop="createdTime"
          label="创建时间"
        />
        <el-table-column
          prop="enabled"
          label="启用状态"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="text" icon="el-icon-document" @click="toInfo(row.noticeId)">详情</el-button>
            <el-dropdown class="button-group">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" icon="el-icon-edit" @click="toUpdate(row.noticeId)">修改</el-button></el-dropdown-item>
                <el-dropdown-item><el-button type="text" icon="el-icon-delete" @click="toDelete(row.noticeId)">删除</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page="page.currentPage"
        :page-sizes="[10,20,30,50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataPage.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 数据表格结束 -->

    <!-- 添加弹窗 -->
    <el-dialog title="添加通知" width="60%" :visible.sync="addDialog">
      <sys-notice-add @after="getByPage" @close="closeDialog"/>
    </el-dialog>
    <!-- 添加弹窗结束 -->

    <!-- 修改弹窗 -->
    <el-dialog title="修改通知" width="60%" :visible.sync="updateDialog">
      <sys-notice-update :active-id="activeId" @after="getByPage"  @close="closeDialog"/>
    </el-dialog>
    <!-- 修改弹窗结束 -->

    <!-- 详情弹窗 -->
    <el-dialog title="通知详情" width="60%" :visible.sync="infoDialog">
      <sys-notice-info :active-id="activeId" />
    </el-dialog>
    <!-- 详情弹窗结束 -->

  </div>
</template>
<script>
import sysNoticeApi from '@/api/sys-notice'
import SysNoticeAdd from './sys-notice-add'
import SysNoticeUpdate from './sys-notice-update'
import SysNoticeInfo from './sys-notice-info'
export default {
  components: {
    SysNoticeAdd,
    SysNoticeUpdate,
    SysNoticeInfo
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        params: {}
      },
      dataPage: {
        list: [],
        totalCount: 0,
        totalPage: 0
      },
      addDialog: false,
      loading: false,
      activeId: '',
      updateDialog: false,
      infoDialog: false
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getByPage()
    },
    toAdd() {
      this.addDialog = true
    },
    toUpdate(id) {
      this.activeId = id
      this.updateDialog = true
    },
    toDelete(id) {
      this.$confirm('此操作会删除该通知，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        sysNoticeApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
      })
    },
    changeStatus(row) {
      if (row.enabled === 1) {
        this.toEnable(row)
      } else {
        this.toDisable(row)
      }
    },
    toEnable(row) {
      this.$confirm('此操作会启用该通知，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        sysNoticeApi.enableById(row.noticeId).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.status = 0
      })
    },
    toDisable(row) {
      this.$confirm('此操作会禁用该通知，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysNoticeApi.disableById(row.noticeId).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.status = 1
      })
    },
    toInfo(id) {
      this.activeId = id
      this.infoDialog = true
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    search() {
      this.page.currentPage = 1
      this.getByPage()
    },
    closeDialog() {
      this.addDialog = false
      this.updateDialog = false
      this.infoDialog = false
    },
    getByPage() {
      this.closeDialog()
      this.loading = true
      sysNoticeApi.getByPage(this.page).then(res => {
        this.dataPage.list = res.data.list
        this.dataPage.totalCount = res.data.totalCount
        this.dataPage.totalPage = res.data.totalPage
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
