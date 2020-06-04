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
      <!-- 房间列表数据 -->
      <el-table :data="roomlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roomFloor" label="房间楼层"></el-table-column>
        <el-table-column prop="roomNumber" label="房间号"></el-table-column>
        <el-table-column prop="roomPicture" label="房间图片">
          <template slot-scope="scope">
            <img :src="'http://101.132.135.179:8080'+scope.row.roomPicture" />
          </template>
        </el-table-column>
        <el-table-column prop="roomIntro" label="房间描述" width="150px"></el-table-column>
        <el-table-column
          prop="roomType"
          label="房间类型"
          width="150"
          column-key="roomType"
          :filters="[{text: '休闲房', value: '休闲房'}, {text: '高级房', value: '高级房'}, {text: '生活房', value: '生活房'}]"
        ></el-table-column>
        <el-table-column
          prop="roomBedType"
          label="床型"
          width="150"
          column-key="roomBedType"
          :filters="[{text: '双人床', value: '双人床'}, {text: '单人床', value: '单人床'}]"
        ></el-table-column>
        <el-table-column prop="roomPrice" label="房间单价" sortable></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoomDialog(scope.row.id)"
            >还原</el-button>
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
      roomlist: []
    };
  },
  created() {
    this.getRoomList();
  },
  methods: {
    async getRoomList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getRecycleRoomList",
        {
          params: this.queryInfo
        }
      );

      if (res.code !== 0) {
        return this.$message.error("获取回收房间列表失败！");
      }
      this.$message.success("获取回收房间列表成功！");

      console.log(res);
      this.total = res.count;
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

    // 展示编辑房间信息的对话框
    async showRoomDialog(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将还原该房间, 是否继续?",
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
        "http://101.132.135.179:8088/hotel/room/recoveryRecycleRoom?id=" + id
      );

      if (res.code != 0) {
        return this.$message.error("还原房间失败！");
      }
      this.$message.success("还原房间成功！");
      this.getRoomList();
    },
    // 根据Id删除对应房间信息
    async removeRoomById(id) {
      console.log(id);
      // 弹框询问房间信息是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该房间数据, 是否继续?",
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
        .post("http://101.132.135.179:8088/hotel/room/deleteRoom?id=" + id)
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除房间成功！");
          }
          this.$message.error("删除房间失败！");
        });
      this.getRoomList();
    }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
