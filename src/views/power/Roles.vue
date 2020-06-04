<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getRolesList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDescription"></el-table-column>
        <el-table-column label="角色状态(正常)" prop="roleStates">
          <template>
            <el-switch v-model="rolesState"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoleDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="getRightById(scope.row.id)"
            >分配权限</el-button>
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

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescription">
          <el-input v-model="addForm.roleDescription"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescription">
          <el-input v-model="editForm.roleDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配角色权限" :visible.sync="setRightDialogVisible" width="55%">
      <!-- 卡片视图区域 -->
      <el-card>
        <!-- 搜索区域 -->
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible1 = true">添加权限</el-button>
          </el-col>
        </el-row>

        <!-- 权限列表数据 -->
        <el-table :data="rightByIdlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="permissionName"></el-table-column>
          <el-table-column label="权限描述" prop="permissionDescribe"></el-table-column>
          <el-table-column label="权限路径" prop="permissionKey"></el-table-column>
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
        <!-- 添加权限的对话框 -->
        <el-dialog
          title="添加权限"
          :visible.sync="addDialogVisible1"
          width="30%"
          append-to-body
          @close="addDialogClosed1"
        >
          <!-- 内容主体区域 -->
          <el-form :model="addForm1" :rules="addFormRules1" ref="addFormRef1" label-width="80px">
            <el-form-item label="角色id" prop="roleId">
              <el-input v-model="addForm1.roleId"></el-input>
            </el-form-item>
            <el-form-item label="权限id" prop="permissionId">
              <el-input v-model="addForm1.permissionId"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRight">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑权限的对话框 -->
        <el-dialog
          title="修改权限"
          :visible.sync="editDialogVisible1"
          width="30%"
          append-to-body
          @close="editDialogClosed1"
        >
          <el-form :model="editForm1" :rules="editFormRules1" ref="editFormRef1" label-width="80px">
            <el-form-item label="权限id" prop="id">
              <el-input v-model="editForm1.id"></el-input>
            </el-form-item>
            <el-form-item label="权限路径" prop="roleId">
              <el-input v-model="editForm1.roleId"></el-input>
            </el-form-item>
            <el-form-item label="权限对应角色" prop="permissionId">
              <el-input v-model="editForm1.permissionId"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRightInfo">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-dialog>
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
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      addDialogVisible1: false,
      // 添加角色的表单数据
      addForm: {
        roleName: "",
        roleDescription: ""
      },
      addForm1: {
        roleId: "",
        permissionId: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        roleDescription: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ],
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      addFormRules1: {
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
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 控制修改权限对话框的显示与隐藏
      editDialogVisible1: false,
      // 查询到的角色信息对象
      editForm: {},
      // 查询到的权限信息对象
      editForm1: {},
      // 修改表单的验证规则对象
      editFormRules: {
        roleDescription: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ],
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      // 修改表单的验证规则对象
      editFormRules1: {
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
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightByIdlist: []
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRoleList",
        {
          params: this.queryInfo
        }
      );
      if (res.code !== 0) {
        return this.$message.error("获取角色列表失败！");
      }
      this.$message.success("获取角色列表成功！");

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

    // 监听添加角色的对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听添加权限的对话框的关闭事件
    addDialogClosed1() {
      this.$refs.addFormRef1.resetFields();
    },
    // 点击按钮，添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/role/insertRole?" +
              "roleName=" +
              this.addForm.roleName +
              "&roleDescription=" +
              this.addForm.roleDescription
          )
          .then(res => {
            console.log("添加角色", res);
            if (res.data.code == 0) {
              this.$message.success("添加角色成功！");
            } else if (res.data.code == 500) {
              this.$message.error("角色名已存在");
            } else {
              this.$message.warning("对不起，你无权访问，请升级权限");
            }

            // 隐藏添加用户的对话框
            this.addDialogVisible = false;
            // 重新获取用户列表数据
            this.getRolesList();
          })
          .catch(err => {});
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
      });
    },
    // 添加权限的对话框
    addRight() {
      this.$refs.addFormRef1.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(
          "http://101.132.135.179:8088/hotel/rolePermission/insertRolePermission?" +
            "roleId=" +
            this.addForm1.roleId +
            "&permissionId=" +
            this.addForm1.permissionId +
            "&permissionKey="
        );

        if (res.code == 0) {
          this.$message.success("添加权限信息成功！");
        } else if (res.code == 1000) {
          this.$message.warning("对不起，你无权访问，请升级权限");
        } else {
          this.$message.error("添加权限信息失败！");
        }

        // 隐藏添加权限的对话框
        this.addDialogVisible1 = false;
        // 重新获取权限列表数据
      });
    },
    // 展示编辑角色的对话框
    async showRoleDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getRoleById?id=" + id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.success("查询角色信息失败！");
      }
      this.$message.success("查询角色信息成功！");
      this.editForm = res.data;
      console.log("角色数据", res.data);
      this.editDialogVisible = true;
    },
    // 展示编辑权限信息的对话框
    async showRightDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getRolePermissionById?id=" +
          id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.error("查询权限信息失败,请登录");
      }
      this.$message.success("查询权限信息成功！");
      this.editForm1 = res.data;
      console.log("权限数据", res.data);
      this.editDialogVisible1 = true;
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 监听修改权限对话框的关闭事件
    editDialogClosed1() {
      this.$refs.editFormRef1.resetFields();
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/role/updateRole?id=" +
              this.editForm.id +
              "&roleName=" +
              this.editForm.roleName +
              "&roleDescription=" +
              this.editForm.roleDescription
          )
          .then(res => {
            if (res.data.code == 0) {
              return this.$message.success("更新角色信息成功！");
            } else if (res.data.code == 1000) {
              // 提示修改成功
              this.$message.warning("对不起，你无权访问，请升级权限！");
            } else {
              this.$message.error("更新角色失败!");
            }

            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getUserList();
          })
          .catch(err => {});
        // 关闭对话框
        this.editDialogVisible = false;
      });
    },
    // 修改权限信息并提交
    editRightInfo() {
      this.$refs.editFormRef1.validate(async valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/rolePermission/updateRolePermission?id=" +
              this.editForm1.id +
              "&roleId=" +
              this.editForm1.roleId +
              "&permissionId=" +
              this.editForm1.permissionId
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
            this.editDialogVisible1 = false;
          })
          .catch(err => {});
        // 关闭对话框
        this.editDialogVisible1 = false;
      });
    },
    // 根据Id删除对应的角色信息
    async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将删除该角色, 是否继续?",
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
        .post("http://101.132.135.179:8088/hotel/role/recycleRole?id=" + id)
        .then(res => {
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message.success("删除角色成功！");
          } else {
            this.$message.warning("对不起，你无权访问，请升级权限");
          }
          this.getRolesList();
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
          "http://101.132.135.179:8088/hotel/rolePermission/deleteRolePermission?id=" +
            id
        )
        .then(res => {
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message.success("删除权限成功！");
          } else {
            this.$message.warning("对不起，你无权访问，请升级权限");
          }
        });
    },

    // 根据角色id查询所有权限
    async getRightById(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getPermissionListByRoleId?roleId=" +
          id
      );
      console.log("根据id查询角色所有的权限", res);
      if (res.code != 0) {
        return this.$message.error("查询权限信息失败！");
      }
      this.$message.success("查询权限信息成功！");
      this.rightByIdlist = res.data;
      console.log(this.rightByIdlist);

      this.setRightDialogVisible = true;
    }
  }
};
</script>

<style lang="stylus"></style>
