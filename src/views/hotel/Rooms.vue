<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房间管理</el-breadcrumb-item>
      <el-breadcrumb-item>房间列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getRoomList">
            <el-button slot="append" icon="el-icon-search" @click="getRoomList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加房间</el-button>
        </el-col>
      </el-row>

      <!-- 房间列表数据 -->
      <el-table :data="roomlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roomFloor" label="房间楼层" width="80px"></el-table-column>
        <el-table-column prop="roomNumber" label="房间号" width="75px"></el-table-column>
        <el-table-column prop="roomPicture" label="房间图片">
          <template slot-scope="scope">
            <img :src="'http://101.132.135.179:8080'+scope.row.roomPicture" width="90px" height="100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="roomIntro" label="房间描述" width="150px"></el-table-column>
        <el-table-column
          prop="roomType"
          label="房间类型"
          width="90px"
          column-key="roomType"
          :filters="[{text: '休闲房', value: '休闲房'}, {text: '高级房', value: '高级房'}, {text: '生活房', value: '生活房'}]"
        ></el-table-column>
        <el-table-column
          prop="roomBedType"
          label="床型"
          width="80px"
          column-key="roomBedType"
          :filters="[{text: '双人床', value: '双人床'}, {text: '单人床', value: '单人床'}]"
        ></el-table-column>
        <el-table-column prop="roomPrice" label="房间单价" sortable></el-table-column>
        <el-table-column  label="房间状态" prop="roomStates">
           <template slot-scope="scope">
            <el-tag v-if="scope.row.roomStates === 3">已预定</el-tag>
            <el-tag type="success" v-else-if="scope.row.roomStates === 1">无人</el-tag>
            <el-tag type="warning" v-else>有人</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoomDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoomById(scope.row.id)"
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

    <!-- 添加房间的对话框 -->
    <el-dialog title="添加房间信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="房间楼层" prop="roomFloor">
          <el-input v-model="addForm.roomFloor"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="addForm.roomNumber"></el-input>
        </el-form-item>
        <el-form-item label="房间简介" prop="roomIntro">
          <el-input v-model="addForm.roomIntro"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomType">
          <el-input v-model="addForm.roomType"></el-input>
        </el-form-item>
        <el-form-item label="床型" prop="roomBedType">
          <el-input v-model="addForm.roomBedType"></el-input>
        </el-form-item>
        <el-form-item label="房间单价" prop="roomPrice">
          <el-input v-model="addForm.roomPrice"></el-input>
        </el-form-item>
        <el-form-item label="房间图片" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/room/insertRoom"
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
        <el-button type="primary" @click="addRoom">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑房间的对话框 -->
    <el-dialog
      title="修改房间信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="房间楼层" prop="roomFloor">
          <el-input v-model="editForm.roomFloor"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="editForm.roomNumber"></el-input>
        </el-form-item>
        <el-form-item label="房间简介" prop="roomIntro">
          <el-input v-model="editForm.roomIntro"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomType">
          <el-input v-model="editForm.roomType"></el-input>
        </el-form-item>
        <el-form-item label="床型" prop="roomBedType">
          <el-input v-model="editForm.roomBedType"></el-input>
        </el-form-item>
        <el-form-item label="房间单价" prop="roomPrice">
          <el-input v-model="editForm.roomPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="file">
          <el-upload
            ref="upload"
            action="http://101.132.135.179:8088/hotel/room/updateRoom"
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
        <el-button type="primary" @click="editGoodrInfo">确 定</el-button>
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
      roomlist: [],
      addDialogVisible: false,
      // 图片上传
      limitNum: 1,
      // 添加房间的表单数据
      addForm: {
        file: "",
        roomFloor: "",
        roomNumber: "",
        roomIntro: "",
        roomType: "",
        roomPrice: "",
        roomBedType:""
      },
      fileList: [],
      // 添加房间表单的验证规则对象
      addFormRules: {
        roomFloor: [
          { required: true, message: "请输入房间楼层", trigger: "blur" }
        ],
        roomNumber: [
          { required: true, message: "请输入房间号", trigger: "blur" }
        ],
        roomIntro: [
          { required: true, message: "请输入房间简介", trigger: "blur" }
        ],
        roomType: [
          { required: true, message: "请输入房间类型", trigger: "blur" }
        ],
        roomPrice: [
          { required: true, message: "请输入房间单价", trigger: "blur" }
        ],
        roomBedType: [
          { required: true, message: "请输入床型", trigger: "blur" }
        ]
      },
      // 控制修改房间信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的房间订息对象
      editForm: {},
      // 修改房间表单的验证规则对象
      editFormRules: {}
    };
  },
  created() {
    this.getRoomList();
  },
  methods: {
    async getRoomList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRoomList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取房间列表失败！");
      }
      this.$message.success("获取房间列表成功！");

      console.log(res);
      this.total = res.data.length;
      this.roomlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getRoomList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getRoomList();
    },
    // 监听添加房间对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 添加房间的对话框
    addRoom() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        let formData = new FormData();
        formData.append("file", this.addForm.file);
        // 可以发起添加房间的网络请求
        const {
          data: res
        } = await this.$http.post(
          "http://101.132.135.179:8088/hotel/room/insertRoom?" +
            "roomFloor=" +
            this.addForm.roomFloor +
            "&roomNumber=" +
            this.addForm.roomNumber +
            "&roomIntro=" +
            this.addForm.roomIntro +
            "&roomType=" +
            this.addForm.roomType +
            "&roomPrice=" +
            this.addForm.roomPrice+
            "&roomBedType=" +
            this.addForm.roomBedType,
          formData,
          { "Content-Type": "multipart/form-data" }
        );

        if (res.code == 0) {
          this.$message.success("添加房间信息成功！");
        } else if (res.code == 1000) {
          this.$message.warning("对不起，你无权访问，请升级权限");
        } else {
          this.$message.error("添加房间信息失败！");
        }

        // 隐藏添加房间的对话框
        this.addDialogVisible = false;
        // 重新获取房间列表数据
        this.getRoomList();
      });
    },
    // 展示编辑房间信息的对话框
    async showRoomDialog(id) {
      console.log(id);
      const { data: res } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getRoomById?id=" + id
      );

      console.log("根据id查询数据", res);
      if (res.code != 0) {
        return this.$message.success("查询房间信息失败！");
      }
      this.$message.success("查询房间信息成功！");
      this.editForm = res.data;
      console.log("房间数据", res.data);
      this.editDialogVisible = true;
    },
    // 监听修改房间对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 修改房间信息并提交
    editGoodrInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改房间信息的数据请求
        let formData1 = new FormData();
        formData1.append("file", this.editForm.file);
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/room/updateRoom?id=" +
              this.editForm.id +
              "&roomFloor=" +
              this.editForm.roomFloor +
              "&roomNumber=" +
              this.editForm.roomNumber +
              "&roomIntro=" +
              this.editForm.roomIntro +
              "&roomType=" +
              this.editForm.roomType +
              "&roomBedType=" +
              this.editForm.roomBedType+
              "&roomPrice=" +
              this.editForm.roomPrice,
            formData1,
            { "Content-Type": "multipart/form-data" }
          )
          .then(res => {
            if (res.data.code !== 0) {
              return this.$message.error("更新房间信息失败！");
            }
            // 提示修改成功
            this.$message.success("更新房间信息成功！");
            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getRoomList();
          })
          .catch(err => {});
      });
    },
    // 根据Id删除对应房间信息
    async removeRoomById(id) {
      console.log(id);
      // 弹框询问房间信息是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将删除该房间数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果房间信息确认删除，则返回值为字符串 confirm
      // 如果房间信息取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post(
          "http://101.132.135.179:8088/hotel/room/recycleRoom?id=" + id
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除房间成功！");
          }
          this.$message.error("删除房间失败！");
        });
      this.getRoomList();
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
