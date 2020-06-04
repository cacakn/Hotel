<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>回收管理</el-breadcrumb-item>
      <el-breadcrumb-item>回收餐厅列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 酒店餐厅列表数据 -->
      <el-table :data="restaurantlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="foodName" label="菜品名"></el-table-column>
        <el-table-column prop="restaurantPicture" label="菜品图片">
          <template slot-scope="scope">
            <img :src="'http://101.132.135.179:8080'+scope.row.restaurantPicture" />
          </template>
        </el-table-column>
        <el-table-column
          prop="restaurantType"
          label="菜品分类"
          width="150"
          column-key="restaurantType"
          :filters="[{text: '休闲食品', value: '休闲食品'}, {text: '乳饮酒水', value: '乳饮酒水'}, {text: '精选水果', value: '精选水果'}, {text: '生活用品', value: '生活用品'}]"
        ></el-table-column>
        <el-table-column prop="foodUnitPrice" label="菜品单价" sortable></el-table-column>
        <el-table-column prop="foodPopularity" label="菜品热度" sortable></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRestaurantDialog(scope.row.id)"
            >还原</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRestaurantById(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // query: "",
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        limit: 5
      },
      total: 0,
      restaurantlist: [],
    };
  },
  created() {
    this.getRestaurantList();
  },
  methods: {
    async getRestaurantList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecycleRestaurantList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取回收酒店餐厅列表失败！");
      }
      this.$message.success("获取回收酒店餐厅列表成功！");

      console.log(res);
      this.total = res.count;
      this.restaurantlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getRestaurantList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getRestaurantList();
    },
    // 展示编辑酒店餐厅信息的对话框
    async showRestaurantDialog(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将还原该餐厅, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消还原");
      }
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/restaurant/recoveryRecycleRestaurant?id=" + id
      );

      if (res.code != 0) {
        return this.$message.error("还原餐厅失败！");
      }
      this.$message.success("还原餐厅成功！");
      this.getRestaurantList();
    },
    // 根据Id删除对应酒店餐厅信息
    async removeRestaurantById(id) {
      console.log(id);
      // 弹框询问酒店餐厅信息是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该酒店餐厅数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果酒店餐厅信息确认删除，则返回值为字符串 confirm
      // 如果酒店餐厅信息取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post(
          "http://101.132.135.179:8088/hotel/restaurant/deleteRestaurant?id=" +
            id
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除酒店餐厅成功！");
          }
          this.$message.error("删除酒店餐厅失败！");
        });
      this.getRestaurantList();
    }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
