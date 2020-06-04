<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店管理</el-breadcrumb-item>
      <el-breadcrumb-item>健身器材列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getEquipmentList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getEquipmentList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加健身器材</el-button>
        </el-col>
      </el-row>

      <!-- 健身器材列表数据 -->
      <el-table :data="equipmentlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="equipmentName" label="器材名称"></el-table-column>
        <el-table-column prop="equipmentPicture" label="器材图片">
          <template slot-scope="scope">
            <img :src="'http://101.132.135.179:8080'+scope.row.equipmentPicture" width="150px" height="100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="equipmentIntro" label="器材简介" width="150px"></el-table-column>
        <el-table-column prop="equipmentUsage" label="器材使用方法" sortable></el-table-column>
        <el-table-column prop="equipmentNum" label="器材数量" sortable></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEquipmentDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeEquipmentById(scope.row.id)"
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

    <!-- 添加健身器材的对话框 -->
    <el-dialog
      title="添加健身器材信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="器材名称" prop="equipmentName">
          <el-input v-model="addForm.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="器材简介" prop="equipmentIntro">
          <el-input v-model="addForm.equipmentIntro"></el-input>
        </el-form-item>
        <el-form-item label="器材数量" prop="equipmentNum">
          <el-input v-model="addForm.equipmentNum"></el-input>
        </el-form-item>
        <el-form-item label="器材使用方法" prop="equipmentUsage">
          <el-input v-model="addForm.equipmentUsage"></el-input>
        </el-form-item>
        <el-form-item label="健身器材图片" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/fitness/insertFitness"
            :limit="limitNum"
            :auto-upload="false"
            accept=".jpg"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :file-list="fileList"
          >
            <el-button size="small" plain>选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color:grey;">只能上传jpg文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑健身器材的对话框 -->
    <el-dialog
      title="修改健身器材信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
        <el-form-item label="器材名称" prop="equipmentName">
          <el-input v-model="editForm.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="器材简介" prop="equipmentIntro">
          <el-input v-model="editForm.equipmentIntro"></el-input>
        </el-form-item>
        <el-form-item label="器材数量" prop="equipmentNum">
          <el-input v-model="editForm.equipmentNum"></el-input>
        </el-form-item>
        <el-form-item label="器材使用方法" prop="equipmentUsage">
          <el-input v-model="editForm.equipmentUsage"></el-input>
        </el-form-item>
        <el-form-item label="器材图片" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/fitness/updateFitness"
            :limit="limitNum"
            :auto-upload="false"
            accept=".jpg"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :file-list="fileList"
          >
            <el-button size="small" plain>选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color:grey;">只能上传jpg文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEquipmentInfo">确 定</el-button>
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
      equipmentlist: [],
      addDialogVisible: false,
      // 图片上传
      limitNum: 1,
      // 添加健身器材的表单数据
      addForm: {
        file: "",
        equipmentName: "",
        equipmentIntro: "",
        equipmentNum: "",
        equipmentUsage: ""
      },
      fileList: [],
      // 添加表单的验证规则对象
      addFormRules: {
        equipmentName: [
          { required: true, message: "请输入器材名称", trigger: "blur" }
        ],
        equipmentIntro: [
          { required: true, message: "请输入器材简介", trigger: "blur" }
        ],
        equipmentNum: [
          { required: true, message: "请输入器材数量", trigger: "blur" }
        ]
      },
      // 控制修改健身器材信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的健身器材订息对象
      editForm: {},
      // 修改健身器材表单的验证规则对象
      editFormRules: {
        equipmentName: [
          { required: true, message: "请输入器材名称", trigger: "blur" }
        ],
        equipmentIntro: [
          { required: true, message: "请输入器材简介", trigger: "blur" }
        ],
        equipmentNum: [
          { required: true, message: "请输入器材数量", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getEquipmentList();
  },
  methods: {
    async getEquipmentList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getFitnessList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取健身器材列表失败！");
      }
      this.$message.success("获取健身器材列表成功！");

      console.log(res);
      this.total = res.count;
      this.equipmentlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getEquipmentList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getEquipmentList();
    },
    // 监听添加健身器材对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 添加健身器材的对话框
    addEquipment() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        let formData = new FormData();
        formData.append("file", this.addForm.file);
        // 可以发起添加健身器材的网络请求
        const {
          data: res
        } = await this.$http.post(
          "http://101.132.135.179:8088/hotel/fitness/insertFitness?" +
            "equipmentName=" +
            this.addForm.equipmentName +
            "&equipmentIntro=" +
            this.addForm.equipmentIntro +
            "&equipmentNum=" +
            this.addForm.equipmentNum +
            "&equipmentUsage=" +
            this.addForm.equipmentUsage,
          formData,
          { "Content-Type": "multipart/form-data" }
        );

        if (res.code == 0) {
          this.$message.success("添加健身器材信息成功！");
        } else if (res.code == 1000) {
          this.$message.warning("对不起，你无权访问，请升级权限");
        } else {
          this.$message.error("添加健身器材信息失败！");
        }

        // 隐藏添加健身器材的对话框
        this.addDialogVisible = false;
        // 重新获取健身器材品列表数据
        this.getEquipmentList();
      });
    },
    // 展示编辑健身器材信息的对话框
    async showEquipmentDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getFitnessById?id=" + id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.success("查询健身器材信息失败！");
      }
      this.$message.success("查询健身器材信息成功！");
      this.editForm = res.data;
      this.editForm.password = "";
      console.log("健身器材数据", res.data);
      this.editDialogVisible = true;
    },
    // 监听修改健身器材对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 修改健身器材信息并提交
    editEquipmentInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改健身器材信息的数据请求
        let formData1 = new FormData();
        formData1.append("file", this.editForm.file);
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/fitness/updateFitness?id=" +
              this.editForm.id +
              "&equipmentName=" +
              this.editForm.equipmentName +
              "&equipmentIntro=" +
              this.editForm.equipmentIntro +
              "&equipmentNum=" +
              this.editForm.equipmentNum +
              "&equipmentUsage=" +
              this.editForm.equipmentUsage +
              "&equipmentStates=" +
              this.editForm.equipmentStates,
            formData1,
            { "Content-Type": "multipart/form-data" }
          )
          .then(res => {
            if (res.data.code !== 0) {
              return this.$message.error("更新健身器材信息失败！");
            }
            // 提示修改成功
            this.$message.success("更新健身器材信息成功！");
            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getEquipmentList();
          })
          .catch(err => {});
      });
    },
    // 根据Id删除对应健身器材信息
    async removeEquipmentById(id) {
      console.log(id);
      // 弹框询问健身器材信息是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该健身器材数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果健身器材信息确认删除，则返回值为字符串 confirm
      // 如果健身器材信息取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post(
          "http://101.132.135.179:8088/hotel/fitness/recycleFitness?id=" + id
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除健身器材成功！");
          }
          this.$message.error("删除健身器材失败！");
        });
      this.getEquipmentList();
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
      this.addForm.file = file.raw;
      console.log(this.addForm.file);
      console.log(fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "jpg") {
        this.$notify.warning({
          title: "警告",
          message: `只能上传jpg（即后缀是.jpg）的文件`
        });
      }
      if (size > 10) {
        this.$notify.warning({
          title: "警告",
          message: `文件大小不得超过10M`
        });
      }
    }
    // // 文件上传成功时的钩子
    // handleSuccess(res, file, fileList) {
    //   this.$notify.success({
    //     title: "成功",
    //     message: `文件上传成功`
    //   });
    // },
    // // 文件上传失败时的钩子
    // handleError(err, file, fileList) {
    //   this.$notify.error({
    //     title: "错误",
    //     message: `文件上传失败`
    //   });
    // }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
