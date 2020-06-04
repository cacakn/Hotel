<template>
  <div class="diagram">
    <div class="total">
      <div class="select-wrapper">
        <el-button type="text">今日</el-button>
        <el-button type="text">本周</el-button>
        <el-button type="text">本月</el-button>
        <el-button type="text">全年</el-button>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :editable=false
          size="small"
          :picker-options="datePickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane label="访客" name="invoke">
          <ve-line
            :data="invokeChartData"
            :settings="invokeChartSettings"
            ref="invoke"
          >
          </ve-line>
        </el-tab-pane>
        <el-tab-pane label="住宿房间" name="sale">
          <ve-line
            :data="saleChartData"
            :settings="saleChartSettings"
            ref="sale"
          >
          </ve-line>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Diagram',
  data () {
    this.invokeChartSettings = {
      dimension: ['时间'],
      scale: [true, true],
      area: true
    }
    this.saleChartSettings = {
      dimension: ['时间'],
      scale: [true, true],
    }
    return {
      activeName: 'invoke',
      dateValue: '',
      // 限制只能选择当前之前的时间
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      invokeChartData: {
        columns: ['时间', '普通用户', 'VIP用户', '新用户'],
        rows: [
          { '时间': '10:00', '普通用户': 2800, 'VIP用户': 1000, '新用户': 900 },
          { '时间': '11:00', '普通用户': 2600, 'VIP用户': 1200, '新用户': 1400 },
          { '时间': '12:00', '普通用户': 2700, 'VIP用户': 1600, '新用户': 1200 },
          { '时间': '13:00', '普通用户': 3000, 'VIP用户': 1100, '新用户': 1600 },
          { '时间': '14:00', '普通用户': 3100, 'VIP用户': 1700, '新用户': 1900 },
          { '时间': '15:00', '普通用户': 2900, 'VIP用户': 2000, '新用户': 1800 },
          { '时间': '16:00', '普通用户': 3300, 'VIP用户': 1500, '新用户': 2200 },
        ]
      },
      saleChartData: {
        columns: ['时间', '单人间', '双人间', 'XX套房',"XXXX"],
        rows: [
          { '时间': '10:00', '单人间': 280, '双人间': 100, 'XX套房': 90, 'XXXX': 90 },
          { '时间': '11:00', '单人间': 260, '双人间': 120, 'XX套房': 140, 'XXXX': 90  },
          { '时间': '12:00', '单人间': 270, '双人间': 160, 'XX套房': 120 , 'XXXX': 90 },
          { '时间': '13:00', '单人间': 300, '双人间': 110, 'XX套房': 160 , 'XXXX': 90 },
          { '时间': '14:00', '单人间': 310, '双人间': 170, 'XX套房': 190 , 'XXXX': 90 },
          { '时间': '15:00', '单人间': 290, '双人间': 200, 'XX套房': 180 , 'XXXX': 90 },
          { '时间': '16:00', '单人间': 330, '双人间': 150, 'XX套房': 220 , 'XXXX': 90 },
        ]
      }
    }
  },
  watch: {
    // 切换tab时更新charts
    activeName (v) {
      this.$nextTick(() => {
        this.$refs[`${v}`].echarts.resize()
      })
    }
  },
  methods: {
    handleTab (tab) {
      console.log(tab.name);
    }
  }
}
</script>

<style lang="stylus">
  .diagram
    width 100%
    // max-width 1200px
    // margin auto
    .total
      height 440px
      width 100%
      background #fff
      padding 10px 12px
      margin-bottom 20px
      position relative
      box-sizing border-box
      .select-wrapper
        position absolute
        right 10px
        top 6px
        padding 0 .4rem
        z-index 9
        .el-button
          margin-right 6px
      .el-tabs__item
        font-size 16px
    .products
      min-height 400px
      background #fff
      padding 10px 16px
      margin-bottom 20px
      position relative
      h4
        font-size 18px
        font-weight bold
        padding 0 0 12px 0
      .diagram
        height 100px
        padding-bottom 12px
        .swiper-container
          height 100px
          .swiper-slide
            background #d7f1e966
            border-radius 8px
            padding 10px
            box-sizing border-box
            display flex
            align-items center
            justify-content space-around
            cursor pointer
            &.active
              background #9df5da
            .text
              color #555
              font-size 16px
              p
                font-size 14px
                color #666
                padding 16px 0
              span
                font-size 20px
                font-weight bold
                color #333
      .charts
        h5
          font-weight bold



  @media (max-width: 920px)
    .select-wrapper
      display none

</style>
