<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getRightList">
            <el-button slot="append" icon="el-icon-search" @click="getRightList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加权限</el-button>
        </el-col>
      </el-row>

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
            >编辑</el-button>
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

      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="danger" style="margin:10px 0 0 0">批量删除</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加权限的对话框 -->
    <el-dialog title="添加权限" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="权限路径" prop="permissionKey">
          <el-input v-model="addForm.permissionKey"></el-input>
        </el-form-item>
        <el-form-item label="权限对应角色" prop="permissionValue">
          <el-input v-model="addForm.permissionValue"></el-input>
        </el-form-item>
        <el-form-item label="权限排序" prop="parentSort">
          <el-input v-model="addForm.parentSort"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="addForm.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="permissionDescribe">
          <el-input v-model="addForm.permissionDescribe"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="权限id" prop="parentPermissionId">
          <el-input v-model="editForm.parentPermissionId"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="permissionKey">
          <el-input v-model="editForm.permissionKey"></el-input>
        </el-form-item>
        <el-form-item label="权限对应角色" prop="permissionValue">
          <el-input v-model="editForm.permissionValue"></el-input>
        </el-form-item>
        <el-form-item label="权限排序" prop="parentSort">
          <el-input v-model="editForm.parentSort"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="editForm.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="permissionDescribe">
          <el-input v-model="editForm.permissionDescribe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRightInfo">确 定</el-button>
      </span>
    </el-dialog>
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
      permissionStates: true,
      addDialogVisible: false,
      // 添加权限的表单数据
      addForm: {
        permissionName: "",
        permissionDescribe: "",
        permissionKey: "",
        permissionValue: "",
        parentSort: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        permissionKey: [
          { required: true, message: "请输入权限路径", trigger: "blur" }
        ],
        permissionValue: [
          { required: true, message: "请输入权限对应角色", trigger: "blur" }
        ],
        parentSort: [
          { required: true, message: "请输入权限排序", trigger: "blur" }
        ],
        permissionName: [
          { required: true, message: "请输入权限名", trigger: "blur" }
        ],
        permissionDescribe: [
          { required: true, message: "请输入权限描述", trigger: "blur" }
        ]
      },
      // 控制修改权限信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的权限订息对象
      editForm: {},
      // 修改权限表单的验证规则对象
      editFormRules: {}
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getPermissionList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取权限列表失败！");
      }
      this.$message.success("获取权限列表成功！");

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
    // 监听添加权限对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加权限的对话框
    addRight() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(
          "http://101.132.135.179:8088/hotel/permission/insertPermission?" +
            "permissionName=" +
            this.addForm.permissionName +
            "&permissionDescribe=" +
            this.addForm.permissionDescribe +
            "&permissionKey=" +
            this.addForm.permissionKey +
            "&permissionValue=" +
            this.addForm.permissionValue +
            "&parentSort=" +
            this.addForm.parentSort
        );

        if (res.code == 0) {
          this.$message.success("添加权限信息成功！");
        } else if (res.code == 1000) {
          this.$message.warning("对不起，你无权访问，请升级权限");
        } else {
          this.$message.error("添加权限信息失败！");
        }

        // 隐藏添加权限的对话框
        this.addDialogVisible = false;
        // 重新获取权限列表数据
        this.getRightList();
      });
    },
    // 展示编辑权限信息的对话框
    async showRightDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getPermissionById?id=" + id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.success("查询权限信息失败！");
      }
      this.$message.success("查询权限信息成功！");
      this.editForm = res.data;
      console.log("权限数据", res.data);
      this.editDialogVisible = true;
    },
    // 监听修改权限对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改权限信息并提交
    editRightInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/permission/updatePermission?id=" +
              this.editForm.id +
              "&parentPermissionId=" +
              this.editForm.parentPermissionId +
              "&permissionName=" +
              this.editForm.permissionName +
              "&permissionDescribe=" +
              this.editForm.permissionDescribe +
              "&permissionKey=" +
              this.editForm.permissionKey +
              "&permissionValue=" +
              this.editForm.permissionValue +
              "&parentSort=" +
              this.editForm.parentSort
          )
          .then(res => {
            if (res.data.code == 0) {
              return this.$message.success("更新权限信息成功！");
            } else if (res.data.code == 1000) {
              // 提示修改成功
              this.$message.warning("对不起，你无权访问，请升级权限！");
            } else {
              this.$message.error("更新权限失败!");
            }
          })
          .catch(err => {});
          // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getRightList();
      });
    },
    // 根据Id删除对应的权限信息
    async removeRightById(id) {
      // 弹框询问用户是否删除数据
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将删除该权限, 是否继续?",
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
          "http://101.132.135.179:8088/hotel/permission/recyclePermission?id=" +
            id
        )
        .then(res => {
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message.success("删除权限成功！");
          } else {
            this.$message.warning("对不起，你无权访问，请升级权限");
          }
          this.getRightList();
        });
    },
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
