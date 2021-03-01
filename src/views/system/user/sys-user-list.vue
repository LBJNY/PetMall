<template>
  <div>
    <!-- 搜索栏开始 -->
    <div class="search-form">
      <el-form :inline="true" :model="page.params" size="small">
        <el-form-item>
          <el-input v-model="page.params.username" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="page.params.nickName" clearable placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="page.params.status" clearable placeholder="请选择启用状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="page.params={}">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索栏结束 -->
    <!-- 操作按钮组开始 -->
    <div class="button-group">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd()">添加</el-button>
    </div>
    <!-- 操作按钮组结束 -->
    <!-- 数据表格开始 -->
    <div class="data-table">
      <el-table
        header-row-class-name="pochi-table-header"
        :data="dataPage.list"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="header" label="头像">
          <template slot-scope="{row}">
            <el-image
              style="width: 50px; height: 50px"
              :src="row.header"
              fit="fill"
              :preview-src-list="[row.header]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column prop="loginTime" label="登录时间" />
        <el-table-column prop="status" label="启用状态">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="note" label="操作">
          <template slot-scope="{row}">
            <el-button type="text" icon="el-icon-document" @click="toInfo(row.id)">详情</el-button>
            <el-dropdown class="handle-button">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" icon="el-icon-edit" @click="toUpdate(row.id)">修改</el-button>
                </el-dropdown-item>
                <el-dropdown-item @click.native="deleteById(row.id)">
                  <el-button type="text" icon="el-icon-delete">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 数据表格结束 -->
    <!-- 分页组件开始 -->
    <div class="pageable">
      <el-pagination
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataPage.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页组件结束 -->
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      width="45%"
    >
      <sysUserAdd @after="getByPage" @close="closeDialog" />
    </el-dialog>
    <!-- 添加用户弹窗结束 -->
    <!-- 修改弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="updateDialog"
      width="45%"
    >
      <sysUserUpdate :active-id="activeId" @after="getByPage" @close="closeDialog" />
    </el-dialog>
    <!-- 修改弹窗结束 -->
    <!-- 详情弹窗开始 -->
    <el-dialog
      title="用户详情"
      :visible.sync="infoDialog"
      width="30%"
    >
      <sysUserInfo :active-id="activeId" />
    </el-dialog>
    <!-- 详情弹窗结束 -->
  </div>
</template>

<script>
import sysUserApi from '@/api/sys-user'
import sysUserAdd from './sys-user-add'
import sysUserUpdate from './sys-user-update'
import sysUserInfo from './sys-user-info'
export default {
  components: {
    sysUserAdd,
    sysUserUpdate,
    sysUserInfo
  },
  data() {
    return {
      // 分页对象
      page: {
        // 分页传参
        params: {},
        currentPage: 1,
        pageSize: 10
      },
      // 当前点击的用户
      activeId: '',
      // 控制添加用户弹窗展示
      addDialog: false,
      // 控制修改用户弹窗展示
      updateDialog: false,
      // 控制用户详情弹窗展示
      infoDialog: false,
      // 数据 page 对象
      dataPage: {}
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    // 搜索
    search() {
      // 搜索时，要还原为第一页
      this.page.currentPage = 1
      this.getByPage()
    },
    // 每页条数变更时触发
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getByPage()
    },
    // 当前页变更时触发
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    // 分页查询
    getByPage() {
      var that = this
      sysUserApi.getByPage(this.page).then((res) => {
        that.dataPage = res.data
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.addDialog = false
      this.updateDialog = false
      this.infoDialog = false
    },
    // 添加
    toAdd() {
      this.addDialog = true
    },
    // 查询详情
    toInfo(id) {
      this.activeId = id
      this.infoDialog = true
    },
    // 修改用户信息
    toUpdate(id) {
      this.activeId = id
      this.updateDialog = true
    },
    // 删除用户
    deleteById(id) {
      // 弹出框提示,是否删除
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        sysUserApi.deleteById(id).then((res) => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    changeStatus(row) {
      const status = row.status
      if (status === 0) {
        // 禁用
        this.$confirm('是否禁用该用户,禁用后用户将无法登陆?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用禁用方法
          sysUserApi.disableById(row.id).then((res) => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        }).catch(() => {
          row.status = 1
        })
      } else {
        // 启用
        this.$confirm('是否启用该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          // 调用启用方法
          sysUserApi.enableById(row.id).then((res) => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        }).catch(() => {
          row.status = 0
        })
      }
    }
  }
}
</script>

