<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>回收管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限回收列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 权限列表数据 -->
      <el-table :data="rightlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="permissionName"></el-table-column>
        <el-table-column label="权限描述" prop="permissionDescribe"></el-table-column>
        <el-table-column label="权限路径" prop="permissionKey"></el-table-column>
        <el-table-column label="权限状态(正常)" prop="permissionStates">
          <template>
            <el-switch v-model="permissionStates"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRightDialog(scope.row.id)"
            >还原</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRightById(scope.row.id)"
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
      rightlist: [],
      permissionStates: true
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecyclePermissionList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取回收权限列表失败！");
      }
      this.$message.success("获取回收权限列表成功！");

      console.log(res);
      this.total = res.count;
      this.rightlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getRightList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getRightList();
    },
    // 展示编辑权限信息的对话框
    async showRightDialog(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将还原该权限, 是否继续?",
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
        "http://101.132.135.179:8088/hotel/permission/recoveryRecyclePermission?id=" +
          id
      );

      if (res.code != 0) {
        return this.$message.success("还原权限失败！");
      }
      this.$message.success("还原权限成功！");
      this.getRightList();
    },
    // 根据Id删除对应的权限信息
    async removeRightById(id) {
      // 弹框询问用户是否删除数据
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果权限确认删除，则返回值为字符串 confirm
      // 如果权限取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = this.axios
        .post(
          "http://101.132.135.179:8088/hotel/permission/deletePermission?id=" +
            id
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除权限成功！");
          }
          this.$message.error("删除权限失败！");
        });
      this.getRightList();
    }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
