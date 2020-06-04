<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column
          label="性别"
          prop="gender"
          sortable
          :filters="[{text: '男', value: '男'}, {text: '女', value: '女'}]"
        ></el-table-column>
        <el-table-column label="会员等级(级)" prop="membershipLevel" sortable></el-table-column>
        <el-table-column  label="实名状态" prop="realnameAuthenticationStates">
           <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.realnameAuthenticationStates === 2">已实名</el-tag>
            <el-tag type="warning" v-else-if="scope.row.realnameAuthenticationStates === 1">未实名</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
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

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="form" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/users/insertUser"
            :limit="limitNum"
            :auto-upload="false"
            accept=".png"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :file-list="fileList"
          >
            <el-button size="small" plain>选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color:grey;">只能上传png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/users/updateUser"
            :limit="limitNum"
            :auto-upload="false"
            accept=".png"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :file-list="fileList"
          >
            <el-button size="small" plain>选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color:grey;">只能上传png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div class="role">
        <p>当前用户：{{this.userInfo.username}}</p>
        <p>当前角色：{{this.rolesListById.roleName}}</p>
        <p>
          <el-form :model="addform" :rules="FormRules" label-width="65px">
            <el-form-item label="角色id" prop="roleId">
              <el-input v-model="addform.roleId" placeholder="请输入数字 1 -root权限最高 3 -user权限最低"></el-input>
            </el-form-item>
          </el-form>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // query: "",
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        limit: 5
      },
      realnameAuthenticationStates: false,
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,

      // 图片上传
      limitNum: 1,
      // 添加用户的表单数据
      form: {
        file: "",
        username: "",
        password: "",
        phone: "",
        email: ""
      },
      fileList: [],

      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        // file: [{ required: true, message: "请上传头像" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        phone: [{ validator: checkMobile, trigger: "blur" }]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ]
        // email: [
        //   { required: true, message: "请输入用户邮箱", trigger: "blur" },
        //   { validator: checkEmail, trigger: "blur" }
        // ],
        // phone: [
        //   { required: true, message: "请输入用户手机", trigger: "blur" },
        //   { validator: checkMobile, trigger: "blur" }
        // ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      rolesListById: [],
      addform: {
        roleId: ""
      },
      FormRules: {
        roleId: [
          { required: true, message: "请输入角色id", trigger: "blur" },
          {
            min: 1,
            max: 1,
            message: "角色id的长度为1个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getUserList",
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
      console.log(this.userlist)
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
    // 监听 switch 开关状态的改变
    // async userStateChanged(userinfo) {
    //   console.log(userinfo);
    //   const { data: res } = await this.$http.put(
    //     `users/${userinfo.id}/state/${userinfo.mg_state}`
    //   );
    //   if (res.meta.status !== 200) {
    //     userinfo.mg_state = !userinfo.mg_state;
    //     return this.$message.error("更新用户状态失败！");
    //   }
    //   this.$message.success("更新用户状态成功！");
    // },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求

        let formData = new FormData();
        formData.append("file", this.form.file);
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/users/insertUser?" +
              "username=" +
              this.form.username +
              "&password=" +
              this.form.password +
              "&phone=" +
              this.form.phone +
              "&email=" +
              this.form.email,
            formData,
            { "Content-Type": "multipart/form-data" }
          )
          .then(res => {
            console.log("添加用户", res);
            if (res.data.code == 0) {
              this.$message.success("添加用户成功！");
            } else {
              this.$message.error("用户名已存在");
            }
            // 隐藏添加用户的对话框
            this.addDialogVisible = false;
            // 重新获取用户列表数据
            this.getUserList();
          })
          .catch(err => {});
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getUserById?id=" + id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.success("查询用户信息失败！");
      }
      this.$message.success("查询用户信息成功！");
      this.editForm = res.data;
      this.editForm.password = "";
      console.log("用户数据", res.data);
      console.log("用户密码", this.editForm.password);
      this.editDialogVisible = true;
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;

        // 发起修改用户信息的数据请求
        let formData1 = new FormData();
        formData1.append("file", this.editForm.file);
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/users/updateUser?id=" +
              this.editForm.id +
              "&username=" +
              this.editForm.username +
              "&password=" +
              this.editForm.password +
              "&phone=" +
              this.editForm.phone +
              "&email=" +
              this.editForm.email,
            formData1,
            { "Content-Type": "multipart/form-data" }
          )
          .then(res => {
            if (res.data.code !== 0) {
              return this.$message.error("更新用户信息失败！");
            }
            // 提示修改成功
            this.$message.success("更新用户信息成功！");
            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getUserList();
          })
          .catch(err => {});
      });
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将删除该用户, 是否继续?",
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
        .post("http://101.132.135.179:8088/hotel/users/recycleUser?id=" + id)
        .then(res => {
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message.success("删除用户成功！");
          } else if (res.data.code == 1000) {
            this.$message.warning("对不起，请升级权限!");
          } else {
            this.$message.error("删除用户失败!");
          }
          this.getUserList();
        });
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      console.log(this.userInfo.id);
      const { data: res } = await this.$http.post(
        "http://101.132.135.179:8088/hotel/select/getUserRoleById?id=" +
          this.userInfo.id
      );
      console.log("rolesListById当前用户角色信息", res);
      this.rolesListById = res.data;

      this.setRoleDialogVisible = true;
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      console.log(this.userInfo.username);
      const { data: res } = await this.$http.post(
        "http://101.132.135.179:8088/hotel/userRole/updateUserRole?id=" +
          this.rolesListById.id +
          "&username=" +
          this.userInfo.username +
          "&roleId=" +
          this.addform.roleId
      );
      if (res.code !== 0) {
        return this.$message.error("修改用户角色失败！");
      }
      this.$message.success("修改用户角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },

    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$notify.warning({
        title: "警告",
        message: `只能选择 ${
          this.limitNum
        } 个文件，当前共选择了 ${files.length + fileList.length} 个`
      });
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log("change");
      console.log(file);
      this.form.file = file.raw;
      console.log(this.form.file);
      console.log(fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "png") {
        this.$notify.warning({
          title: "警告",
          message: `只能上传png（即后缀是.png）的文件`
        });
      }
      if (size > 10) {
        this.$notify.warning({
          title: "警告",
          message: `文件大小不得超过10M`
        });
      }
    }
  }
};
</script>

<style>
.role p {
  margin: 18px;
}
</style>

