<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店管理</el-breadcrumb-item>
      <el-breadcrumb-item>背景图片列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 背景图片列表数据 -->
      <el-table :data="backgroundlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="backgroundIntro" label="背景简介"></el-table-column>
        <el-table-column prop="backgroundPicture" label="背景图片">
          <template slot-scope="scope">
            <img :src="'http://101.132.135.179:8080'+scope.row.backgroundPicture" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBackgroundDialog(scope.row.id)"
            >还原</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeBackgroundById(scope.row.id)"
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
      backgroundlist: []
    };
  },
  created() {
    this.getBackgroundList();
  },
  methods: {
    async getBackgroundList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecycleBackgroundList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取背景图片列表失败！");
      }
      this.$message.success("获取背景图片列表成功！");

      console.log(res);
      this.total = res.count;
      this.backgroundlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getBackgroundList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getBackgroundList();
    },
    // 展示编辑背景图片信息的对话框
    async showBackgroundDialog(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将还原该图片, 是否继续?",
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
        "http://101.132.135.179:8088/hotel/background/recoveryRecycleBackground?id=" + id
      );

      if (res.code != 0) {
        return this.$message.error("还原图片失败！");
      }
      this.$message.success("还原图片成功！");
      this.getBackgroundList();
    },
    // 根据Id删除对应背景图片信息
    async removeBackgroundById(id) {
      console.log(id);
      // 弹框询问背景图片信息是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该背景图片数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果背景图片信息确认删除，则返回值为字符串 confirm
      // 如果背景图片信息取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post(
          "http://101.132.135.179:8088/hotel/background/deleteBackground?id=" +
            id
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除背景图片成功！");
          }
          this.$message.error("删除背景图片失败！");
        });
      this.getBackgroundList();
    }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
