<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>回收管理</el-breadcrumb-item>
      <el-breadcrumb-item>回收角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-button type="primary"  @click="getRightById(scope.row.id)">查询权限</el-button>
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <!-- <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row> -->
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDescription"></el-table-column>
        <el-table-column label="角色状态(正常)" prop="roleStates">
          <template>
            <el-switch v-model="rolesState"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoleDialog(scope.row.id)"
            >还原</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
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
      // 获取角色列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        limit: 5
      },
      total: 0,
      // 所有角色列表数据
      rolelist: [],
      rolesState: true,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecycleRoleList",
        {
          params: this.queryInfo
        }
      );
      if (res.code !== 0) {
        return this.$message.error("获取回收角色列表失败！");
      }
      this.$message.success("获取回收角色列表成功！");

      this.rolelist = res.data;
      this.total = res.count;

      console.log("res:", res);
    },
    // 监听 limit 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.limit = newSize;
      this.getRolesList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.page = newPage;
      this.getRolesList();
    },

    // 展示编辑角色的对话框
    async showRoleDialog(id) {
      console.log(id);
     const confirmResult = await this.$confirm(
        "此操作将还原该角色, 是否继续?",
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
        "http://101.132.135.179:8088/hotel/role/recoveryRecycleRole?id=" +
          id
      );

      if (res.code != 0) {
        return this.$message.success("还原角色失败！");
      }
      this.$message.success("还原角色成功！");
      this.getRolesList();
    },
    // 根据Id删除对应的角色信息
    async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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

      const { data: res } = this.axios
        .post("http://101.132.135.179:8088/hotel/role/deleteRole?id=" + id)
        .then(res => {
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message.success("删除角色成功！");
          } else {
            this.$message.warning("对不起，你无权访问，请升级权限");
          }
          this.getRolesList();
        });
      
    }
  }
};
</script>

<style lang="stylus">
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
