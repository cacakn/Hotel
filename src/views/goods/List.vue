<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="155px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [
        {
          goods_id: 1799,
          cat_id: null,
          goods_name: "海尔冰箱",
          goods_price: 3000,
          goods_number: 100,
          goods_weight: 300,
          goods_state: null,
          add_time: 1582544426,
          upd_time: 1582544426,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 530,
          cat_id: null,
          goods_name:
            "倍科（BEKO）干衣机 烘干机 冷凝式滚筒干衣机 洗衣机滚筒洗衣机烘干机原装进口7公斤 DCY7402GXB1（浮云白）",
          goods_price: 4299,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257897,
          upd_time: 1514257897,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 529,
          cat_id: null,
          goods_name:
            "长帝(Changdi) 电烤箱 TRTF32 32L 上下管独立调温 低温发酵 旋转烤叉 防爆照明灯 电烤炉",
          goods_price: 0,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257894,
          upd_time: 1514257894,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 528,
          cat_id: null,
          goods_name:
            "格兰仕（Galanz）微波炉 P70D20N1P-G5(W0) 白色 20L 机械版 转盘式",
          goods_price: 329,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257884,
          upd_time: 1514257884,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 525,
          cat_id: null,
          goods_name:
            "纳丽雅 无烟电烧烤炉家用电烤炉韩国烤盘不粘烤肉机鱿鱼铁板烧 烧烤 标配",
          goods_price: 139,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257874,
          upd_time: 1514257874,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 524,
          cat_id: null,
          goods_name:
            "小熊（Bear）DDQ-B01K1打蛋器电动家用打奶油烘焙迷你搅拌打蛋机手持",
          goods_price: 59,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257871,
          upd_time: 1514257871,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 523,
          cat_id: null,
          goods_name:
            "【买二送一】佰生双歧杆菌7菌 菌粉 酸奶发酵剂 菌粉引子 做酸奶天然7菌营养健康 10小袋",
          goods_price: 9,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257868,
          upd_time: 1514257868,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 522,
          cat_id: null,
          goods_name:
            "Eupa/灿坤 TSK-1431B 美式咖啡机家用商用滴漏式蒸汽煮咖啡壶泡茶",
          goods_price: 398,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257865,
          upd_time: 1514257865,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 521,
          cat_id: null,
          goods_name:
            "LittleSwan/小天鹅 TP80-DS905 8kg 双缸强力动力半自动洗衣机",
          goods_price: 599,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257861,
          upd_time: 1514257861,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        },
        {
          goods_id: 520,
          cat_id: null,
          goods_name:
            "飞利浦（philips）空气炸锅 HD9232/30 无油电炸锅机家用大容量韩国二代升级",
          goods_price: 985,
          goods_number: 100,
          goods_weight: 100,
          goods_state: 0,
          add_time: 1514257858,
          upd_time: 1514257858,
          hot_mumber: 0,
          is_promote: false,
          cat_one_id: null,
          cat_two_id: null,
          cat_three_id: null
        }
      ],
      // 总数据条数
      total: 10
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }

      this.$message.success("获取商品列表成功！");
      console.log(res.data);
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }

      const { data: res } = await this.$http.delete(`goods/${id}`);

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }

      this.$message.success("删除成功！");
      this.getGoodsList();
    },
    goAddpage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
