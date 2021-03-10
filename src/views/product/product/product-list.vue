<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-form">
      <el-form :model="page.params" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="page.params.name" clearable placeholder="商品名称" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="page.params.createBy" clearable placeholder="创建人" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="page.params.publishStatus" placeholder="上架" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="page.params.newStatus" placeholder="新品" clearable>
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="page.params.recommendStatus" placeholder="推荐" clearable>
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="page.params.brandId"
            filterable
            remote
            :remote-method="getBrandList"
            placeholder="品牌"
            clearable
          >
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="page.params = {}">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框结束 -->
    <!-- 操作按钮组 -->
    <div class="button-group">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">添加</el-button>
    </div>
    <!-- 操作按钮组结束 -->
    <div class="data-table">
      <el-table
        header-row-class-name="pochi-table-header"
        :data="dataPage.list"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="标题" width="200px" />
        <el-table-column prop="pic" align="center" width="200px" label="图片">
          <template slot-scope="{row}">
            <el-image :src="row.pic" style="width: 200px; height: 250px" fit="fill" :preview-src-list="[row.pic]" />
          </template>
        </el-table-column>
        <el-table-column prop="albumPicList" align="center" label="轮播图" width="200px">
          <template slot-scope="{row}">
            <div class="carousel">
              <el-carousel height="250px" arrow="never" indicator-position="none">
                <el-carousel-item v-for="item in row.albumPicList" :key="item">
                  <el-image style="width: 200px; height: 250px" :src="item" fit="fill" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="80px" />
        <el-table-column prop="stock" label="库存" width="80px" />
        <el-table-column prop="lowStock" label="预警库存" width="100px" />
        <el-table-column prop="sale" label="销量" width="80px" />
        <el-table-column prop="commentNum" label="评论数" width="100px" />
        <el-table-column prop="point" label="购买积分" width="100px" />
        <el-table-column prop="category.name" label="分类" width="120px" />
        <el-table-column prop="brandName" label="品牌" width="120px" />
        <el-table-column prop="transFee" label="运费" width="100px" />
        <el-table-column prop="specs" label="规格" width="150px" />
        <el-table-column label="标签" width="200px">
          <template slot-scope="{row}">
            <div class="switch-group">
              <div class="switch-item">上架：
                <el-switch
                  v-model="row.publishStatus"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changePublish(row)"
                />
              </div>
              <div class="switch-item">新品：
                <el-switch
                  v-model="row.newStatus"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeNew(row)"
                />
              </div>
              <div class="switch-item">推荐：
                <el-switch
                  v-model="row.recommendStatus"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeRecommend(row)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="createTime" label="创建时间" width="160px" />
        <el-table-column prop="createBy" label="创建人" width="120px" />
        <el-table-column prop="updateTime" label="修改时间" width="160px" />
        <el-table-column prop="updateBy" label="修改人" width="120px" />
        <el-table-column label="操作" fixed="right" width="160px">
          <template slot-scope="{row}">
            <el-button type="text" icon="el-icon-edit" @click="toUpdate(row.id)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="toDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>

<script>
import brandApi from '@/api/shop-brand'
import productApi from '@/api/shop-product'
export default {
  data() {
    return {
      // 分页对象
      page: {
        // 搜索对象
        params: {},
        // 当前页
        currentPage: 1,
        // 每页条数
        pageSize: 10
      },
      // 品牌列表
      brandList: [],
      // 数据分页对象
      dataPage: {}
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    // 查询品牌
    getBrandList(name) {
      brandApi.getByName(name).then((res) => {
        this.brandList = res.data
      })
    },
    // 搜索
    search() {
      this.page.currentPage = 1
      this.getByPage()
    },
    // 跳转到添加页
    toAdd() {
      this.$router.push('/product/add')
    },
    // 分页查询
    getByPage() {
      productApi.getByPage(this.page).then(res => {
        this.dataPage = res.data
      })
    },
    // 每页条数发生改变
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getByPage()
    },
    // 当前页发生改变
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    // 修改
    toUpdate(id){
      this.$router.push('/product/update/' + id)
    },
    // 删除
    toDelete(id){
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        productApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    // changePublish 上下架
    changePublish(row) {
      if (row.publishStatus === 1) {
        this.toEnablePublish(row)
      } else {
        this.toDisablePublish(row)
      }
    },
    toEnablePublish(row){
      this.$confirm('此操作会上架该商品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.publish(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.publishStatus = 1
      })
    },
    toDisablePublish(row){
      this.$confirm('此操作会下架该商品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.unPublish(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.publishStatus = 0
      })
    },
    // changeNew 是否新品
    changeNew(row) {
      if (row.newStatus === 1) {
        this.toEnableNew(row)
      } else {
        this.toDisableNew(row)
      }
    },
    toEnableNew(row){
      this.$confirm('此操作会将该商品列为新品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.news(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.newStatus = 1
      })
    },
    toDisableNew(row){
      this.$confirm('设置该商品不是新品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.old(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.newStatus = 0
      })
    },
    // changeRecommend 是否推荐
    changeRecommend(row) {
      if (row.recommendStatus === 1) {
        this.toEnableRecommend(row)
      } else {
        this.toDisableRecommend(row)
      }
    },
    toEnableRecommend(row){
      this.$confirm('设置该商品将被推荐，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.recommend(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.recommendStatus = 1
      })
    },
    toDisableRecommend(row){
      this.$confirm('设置该商品将不被推荐，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        productApi.unRecommend(row.id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        row.recommendStatus = 0
      })
    }
  }
}
</script>

<style>
</style>
