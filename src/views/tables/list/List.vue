<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>回收管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户回收列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="会员等级(级)" prop="membershipLevel" sortable></el-table-column>
        <el-table-column label="实名状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.realnameAuthenticationStates"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 还原按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >还原</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
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
      // 获取用户列表的参数对象
      queryInfo: {
        // query: "",
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        limit: 2
      },
      userlist: [],
      total: 0
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecycleUserList",
        {
          params: this.queryInfo
        }
      );
      console.log("res:", res);
      if (res.code !== 0) {
        return this.$message.error("获取用户列表失败！");
      }
      this.$message.success("获取用户列表成功");

      this.userlist = res.data;
      this.total = res.count;
    },
    // 监听 limit 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.limit = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.page = newPage;
      this.getUserList();
    },
    async showEditDialog(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将还原该用户, 是否继续?",
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
        "http://101.132.135.179:8088/hotel/users/recoveryRecycleUser?id=" + id
      );

      if (res.code != 0) {
        return this.$message.success("还原用户失败！");
      }
      this.$message.success("还原用户成功！");
      this.getUserList();
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post("http://101.132.135.179:8088/hotel/users/deleteUser?id=" + id)
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除用户成功！");
          }
          this.$message.error("删除用户失败！");
        });
      this.getUserList();
    }
  }
};
</script>

<style>
.el-card {
  margin: 10px;
}
</style>

