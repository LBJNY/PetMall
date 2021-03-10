<template>
  <div>
    <!-- 搜索表单结束 -->
    <!-- 数据表格开始 -->
    <div class="data-table">
      <el-table
        ref="selectTable"
        v-loading="loading"
        :data="dataPage.list"
        header-row-class-name="table-header"
        stripe
        highlight-current-row
        style="width: 100%"
        @current-change="selectRow"
      >
        <el-table-column prop="id" label="套装编号" width="200" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="productCount" label="商品数" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createBy" label="创建人" />
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

  </div>
</template>
<script>
import packApi from '@/api/shop-pack'
export default {
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
      loading: false
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
    selectRow(row, oldRow) {
      this.$emit('selected', row)
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    search() {
      this.page.currentPage = 1
      this.getByPage()
    },
    getByPage() {
      this.loading = true
      packApi.getByPage(this.page).then(res => {
        this.dataPage = res.data
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
