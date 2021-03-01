<template>
  <div>
    <!-- 搜索栏开始 -->
    <div class="search-form">
      <el-form :inline="true" size="mini" :model="page.params">
        <el-form-item>
          <el-input v-model="page.params.roleName" placeholder="角色名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="page.params = {}">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索栏结束 -->
    <!-- 操作按钮组开始 -->
    <div class="button-group">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAdd">添加</el-button>
    </div>
    <!-- 操作按钮组结束 -->
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
          prop="roleId"
          label="角色编号"
          width="200"
        />
        <el-table-column
          prop="roleName"
          label="角色名"
          width="200"
        />
        <el-table-column
          prop="roleSort"
          width="200"
          label="排序"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          prop="updateBy"
          label="更新人"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-dropdown class="button-group">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" icon="el-icon-edit" @click="toUpdate(row.roleId)">修改</el-button></el-dropdown-item>
                <el-dropdown-item><el-button type="text" icon="el-icon-delete" @click="toDelete(row.roleId)">删除</el-button></el-dropdown-item>
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
    <el-dialog title="添加角色" width="30%" :visible.sync="addDialog">
      <sys-role-add @after="getByPage" />
    </el-dialog>
    <!-- 添加弹窗结束 -->

    <!-- 修改弹窗 -->
    <el-dialog title="修改角色" width="30%" :visible.sync="updateDialog">
      <sys-role-update :active-id="activeId" @after="getByPage" />
    </el-dialog>
    <!-- 修改弹窗结束 -->

  </div>
</template>

<script>
import sysRoleApi from '@/api/sys-role'
import sysRoleAdd from './sys-role-add'
import sysRoleUpdate from './sys-role-update'
export default {
  components: {
    sysRoleAdd,
    sysRoleUpdate
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
      // 当前点击的角色
      activeId: '',
      // 控制添加角色弹窗展示
      addDialog: false,
      // 控制修改角色弹窗展示
      updateDialog: false,
      //
      loading: false,
      // 控制用户详情弹窗展示
      infoDialog: false,
      // 数据 page 对象
      dataPage: {
        list: [],
        totalCount: 0,
        totalPage: 0
      }

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
      this.closeDialog()
      this.loading = true
      sysRoleApi.getByPage(this.page).then(res => {
        this.dataPage.list = res.data.list
        this.dataPage.totalCount = res.data.totalCount
        this.dataPage.totalPage = res.data.totalPage
        this.loading = false
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.addDialog = false
      this.updateDialog = false
    },
    // 添加
    toAdd() {
      this.addDialog = true
    },
    // 修改角色信息
    toUpdate(id) {
      this.activeId = id
      this.updateDialog = true
    },
    // 删除
    toDelete(id) {
      this.$confirm('此操作会删除该角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        sysRoleApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
      })
    },
    // //是否禁用
    // changeStatus(row) {
    //   if (row.status === 1) {
    //     this.toEnable(row)
    //   } else {
    //     this.toDisable(row)
    //   }
    // },
    // // 启用角色
    // toEnable(row) {
    //   this.$confirm('此操作会启用该角色，是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'success'
    //   }).then(() => {
    //     sysRoleApi.enableById(row.id).then(res => {
    //       this.$message.success(res.msg)
    //       this.getByPage()
    //     })
    //   }).catch(() => {
    //     row.status = 0
    //   })
    // },
    // // 禁用角色
    // toDisable(row) {
    //   this.$confirm('此操作会禁用该角色，是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     sysRoleApi.disableById(row.id).then(res => {
    //       this.$message.success(res.msg)
    //       this.getByPage()
    //     })
    //   }).catch(() => {
    //     row.status = 1
    //   })
    // },
    toInfo(id) {
      this.activeId = id
      this.infoDialog = true
    }
  }
}
</script>

