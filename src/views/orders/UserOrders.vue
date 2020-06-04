<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户订单</el-button>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="orderNumber"></el-table-column>
        <el-table-column label="食品名称" prop="foodName"></el-table-column>
        <el-table-column label="食品数量" prop="foodNum"></el-table-column>
        <el-table-column label="食品单价" prop="foodUnitPrice"></el-table-column>
        <el-table-column
          label="是否完成"
          prop="orderOverdueStates"
          sortable
          :filters="[{text: '未付款', value: '未付款'}, {text: '已付款', value: '已付款'}]"
          width="120px"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.orderOverdueStates === '1'">已完成</el-tag>
            <el-tag type="danger" v-else>未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否完成"
          prop="pay_status"
          sortable
          :filters="[{text: '未付款', value: '未付款'}, {text: '已付款', value: '已付款'}]"
          width="120px"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.orderStates === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="下单时间" prop="create_time" width="155px" sortable>
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>-->
        <el-table-column label="下单时间" prop="create_time" width="155px" sortable>
          <template slot-scope="scope">{{scope.row.orderTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="danger"
              icon="el-icon-delete"
              @click="removeOrderById(scope.row.id)"
            ></el-button>
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

    <!-- 添加用户订单的对话框 -->
    <el-dialog title="添加用户订单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="addForm.userId"></el-input>
        </el-form-item>
        <el-form-item label="餐厅物品id" prop="productId">
          <el-input v-model="addForm.restaurantId"></el-input>
        </el-form-item>
        <el-form-item label="食品数量" prop="foodNum">
          <el-input v-model="addForm.foodNum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
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
      orderlist: [],
      addDialogVisible: false,
      // 添加订单的表单数据
      addForm: {
        id: "",
        userId: "",
        restaurantId: "",
        foodNum: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        userId: [{ required: true, message: "请输入用户id", trigger: "blur" }],
        restaurantId: [
          { required: true, message: "请输入餐厅物品id", trigger: "blur" }
        ],
        foodNum: [
          { required: true, message: "请输入食品数量", trigger: "blur" }
        ]
      },
      editForm:{}
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get(
        "http://101.132.135.179:8088/hotel/select/getUserRestaurantList",
        {
          params: this.queryInfo
        }
      );
      if (res.code != 0) {
        return this.$message.error("获取用户订单列表失败！");
      }
      this.$message.success("获取用户订单列表成功！");

      console.log("用户订单列表", res);
      this.total = res.count;
      this.orderlist = res.data;
    },
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getOrderList();
    },
    // 监听添加用户订单对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户订单的对话框
    addOrder() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/userRestaurant/insertUserRestaurant?" +
              "userId=" +
              this.addForm.userId +
              "&restaurantId=" +
              this.addForm.restaurantId +
              "&foodNum=" +
              this.addForm.foodNum
          )
          .then(res => {
            console.log("添加用户订单", res);
            if (res.data.code == 0) {
              this.$message.success("添加用户订单成功！");
            } else if (res.data.code == 500) {
              this.$message.error("订单已存在");
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
    // 根据Id删除对应的用户订单信息
    async removeOrderById(id) {
      console.log(id);
      const { data: demo } = await this.axios.post(
        "http://101.132.135.179:8088/hotel/select/getUserRestaurantById?id=" + id
      );

      console.log("根据id查询数据", demo);
      if (demo.code != 0) {
        return this.$message.success("查询用户订单信息失败！");
      }
      this.$message.success("查询用户订单信息成功！");
      this.editForm = demo.data;
      this.editForm.password = "";
      console.log("用户订单数据", demo.data);
      this.editDialogVisible = true;
      // 弹框询问订单是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该订单, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果订单确认删除，则返回值为字符串 confirm
      // 如果订单取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.axios
        .post(
          "http://101.132.135.179:8088/hotel/userRestaurant/deleteUserRestaurant?id=" +
            id +
            "&restaurantId=" +
            this.editForm.restaurantId +
            "&foodNum=" +
            this.editForm.foodNum
        )
        .then(res => {
          console.log("res", res);
          if (res.code != 0) {
            return this.$message.success("删除用户订单成功！");
          }
          this.$message.error("删除用户订单失败！");
        });
      this.getOrderList();
    }
  }
};
</script>

<style lang="stylus">
.el-cascader {
  width: 100%;
}
</style>
