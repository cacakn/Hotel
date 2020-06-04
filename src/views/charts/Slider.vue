<template>
  <div class="slider">
    <div class="products">
      <h4>各产品访客</h4>
      <div class="slider">
        <swiper :options="productSwiperOption">
          <swiper-slide
            v-for="(item, index) in sliderProducts"
            :key="index"
            :class="{'active': productIsActive === index}"
            @click.native="selectProducts(index)"
          >
            <div class="text">
              <h5>{{item.code}}</h5>
              <p>访客占比</p>
              <span>{{item.radio}}%</span>
            </div>
            <div class="circle">
              <el-progress type="circle" :stroke-width="8" :width="70"  :percentage="item.radio"></el-progress>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="charts">
        <h5>各地区访客</h5>
        <ve-line
          :data="productChartData"
          :settings="productChartSettings"
          ref="products"
        >
        </ve-line>
      </div>
    </div>
    <TableAndRing
      :tableTitle='hotProducts.tableTitle'
      :ringTitle='hotProducts.ringTitle'
      :tableData='hotProducts.tableData'
      :chartData='hotProducts.chartData'
      :chartSettings='hotProducts.chartSettings'
    >
    </TableAndRing>
    <TableAndRing
      :tableTitle='bigCustomer.tableTitle'
      :ringTitle='bigCustomer.ringTitle'
      :tableData='bigCustomer.tableData'
      :chartData='bigCustomer.chartData'
      :chartSettings='bigCustomer.chartSettings'
    >
    </TableAndRing>
  </div>
</template>

<script>
import TableAndRing from '@/components/slider/TableAndRing'

export default {
  name: 'Slider',
  components: {
    TableAndRing
  },
  data () {
    this.productChartSettings = {
      dimension: ['时间'],
      scale: [true, true],
      area: true
    }
    this.formChartSettings = {
      dimension: ['时间'],
      scale: [true, true],
      area: true
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
      productChartData: {
        columns: ['时间', '北京', '上海', '青岛'],
        rows: [
          { '时间': '2019-03-01', '北京': 75700, '上海': 4311, '青岛': 1000 },
          { '时间': '2019-03-02', '北京': 72936, '上海': 6650, '青岛': 1307 },
          { '时间': '2019-03-03', '北京': 76636, '上海': 7085, '青岛': 1707 },
          { '时间': '2019-03-04', '北京': 66536, '上海': 6085, '青岛': 2105 },
          { '时间': '2019-03-05', '北京': 77516, '上海': 5105, '青岛': 1505 },
          { '时间': '2019-03-06', '北京': 80536, '上海': 8015, '青岛': 1750 },
        ]
      },
      formChartData: {
        columns: ['时间', '单人间', '双人间', '总统套房', 'Y0906'],
        rows: [
          { '时间': '2019-03-01', '单人间': 56000, '双人间': 22000, '总统套房': 8888, 'Y0906': 666 },
          { '时间': '2019-03-02', '单人间': 44000, '双人间': 24000, '总统套房': 5888, 'Y0906': 766 },
          { '时间': '2019-03-03', '单人间': 51000, '双人间': 21000, '总统套房': 6888, 'Y0906': 1166 },
          { '时间': '2019-03-04', '单人间': 59000, '双人间': 27000, '总统套房': 8888, 'Y0906': 966 },
          { '时间': '2019-03-05', '单人间': 66000, '双人间': 12000, '总统套房': 6888, 'Y0906': 1266 },
          { '时间': '2019-03-06', '单人间': 52000, '双人间': 29000, '总统套房': 7888, 'Y0906': 1066 },
        ]
      },
      // swiper轮播图
      productSwiperOption: {
        slidesPerView: 4,
        spaceBetween: 30,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 40
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      },
      formSwiperOption: {
        slidesPerView: 4,
        spaceBetween: 30,
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 40
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      },
      productIsActive: 0,
      productInvokeCode: '单人间',
      formIsActive: 0,
      formInvokeName: '北京',
      sliderProducts: [
        {
          code: '单人间',
          radio: 63
        },
        {
          code: '双人间',
          radio: 15
        },
        {
          code: '双人间',
          radio: 2
        },
        {
          code: '双人间',
          radio: 1
        }
      ],
      sliderForms: [
        {
          code: '北京',
          radio: 72
        },
        {
          code: '上海',
          radio: 12
        },
        {
          code: '上海淇毓',
          radio: 9
        },
        {
          code: '北京济南',
          radio: 6
        }
      ],
      // 热门产品和各产品关注占比
      hotProducts: {
        tableTitle: '热门产品',
        ringTitle: '各产品关注占比',
        tableData: [{
          id: 1,
          name: '单人间',
          amount: '82093',
          increase: '128%'
        }, {
          id: 2,
          name: '双人间',
          amount: '77093',
          increase: '33%'
        }, {
          id: 3,
          name: '三日人间',
          amount: '66752',
          increase: '25%'
        }, {
          id: 4,
          name: '总统套房',
          amount: '57890',
          increase: '55%'
        }, {
          id: 5,
          name: 'XXXX间',
          amount: '5567',
          increase: '67%'
        }],
        chartData: {
          columns: ['产品', '关注'],
          rows: [
            { '产品': '单人', '关注': 1393 },
            { '产品': '双人', '关注': 3530 },
            { '产品': '三人', '关注': 2923 },
            { '产品': '总统', '关注': 1723 },
            { '产品': 'xxxx', '关注': 3792 },
          ]
        },
        chartSettings: {
          dimension: '产品',
          metrics: '关注',
          offsetY: 180
        }
      },
      // 大客户和各客户关注占比
      bigCustomer: {
        tableTitle: '大客户',
        ringTitle: '各客户关注占比',
        tableData: [{
          id: 1,
          name: '北京',
          amount: '82093',
          increase: '183%'
        }, {
          id: 2,
          name: '济南',
          amount: '77093',
          increase: '33%'
        }, {
          id: 3,
          name: '苏州',
          amount: '66752',
          increase: '25%'
        }, {
          id: 4,
          name: '大连',
          amount: '57890',
          increase: '55%'
        }, {
          id: 5,
          name: '西安',
          amount: '5567',
          increase: '67%'
        }],
        chartData: {
          columns: ['公司', '关注'],
          rows: [
            { '产品': '北京', '关注': 10093 },
            { '产品': '济南', '关注': 5530 },
            { '产品': '苏州', '关注': 2923 },
            { '产品': '大连', '关注': 1723 },
            { '产品': '西安', '关注': 992 },
            { '产品': '浙江', '关注': 992 },
          ]
        },
        chartSettings: {
          dimension: '产品',
          metrics: '关注',
          offsetY: 180
        }
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
    },
    selectProducts (index) {
      console.log(index)
      this.productIsActive = index
      if (index === 0) {
        this.productInvokeCode = 'XXXX'
        this.productChartData = {
          columns: ['时间', '北京', '上海', '青岛'],
          rows: [
            { '时间': '2019-03-01', '北京': 75700, '上海': 4311, '青岛': 1000 },
            { '时间': '2019-03-02', '北京': 72936, '上海': 6650, '青岛': 1307 },
            { '时间': '2019-03-03', '北京': 76636, '上海': 7085, '青岛': 1707 },
            { '时间': '2019-03-04', '北京': 66536, '上海': 6085, '青岛': 2105 },
            { '时间': '2019-03-05', '北京': 77516, '上海': 5105, '青岛': 1505 },
            { '时间': '2019-03-06', '北京': 80536, '上海': 8015, '青岛': 1750 },
          ]
        }
      } else if (index === 1) {
        this.productInvokeCode = '双人间'
        this.productChartData = {
          columns: ['时间', '北京', '上海', '青岛'],
          rows: [
            { '时间': '2019-03-01', '北京': 15700, '上海': 800, '青岛': 200 },
            { '时间': '2019-03-02', '北京': 11936, '上海': 650, '青岛': 307 },
            { '时间': '2019-03-03', '北京': 12636, '上海': 785, '青岛': 197 },
            { '时间': '2019-03-04', '北京': 14536, '上海': 885, '青岛': 215 },
            { '时间': '2019-03-05', '北京': 15516, '上海': 705, '青岛': 155 },
            { '时间': '2019-03-06', '北京': 16536, '上海': 805, '青岛': 250 },
          ]
        }
      } else if (index === 2) {
        this.productInvokeCode = '双人间'
        this.productChartData = {
          columns: ['时间', '北京', '上海', '青岛'],
          rows: [
            { '时间': '2019-03-01', '北京': 650, '上海': 300, '青岛': 300 },
            { '时间': '2019-03-02', '北京': 736, '上海': 250, '青岛': 307 },
            { '时间': '2019-03-03', '北京': 636, '上海': 285, '青岛': 297 },
            { '时间': '2019-03-04', '北京': 536, '上海': 285, '青岛': 215 },
            { '时间': '2019-03-05', '北京': 516, '上海': 205, '青岛': 255 },
            { '时间': '2019-03-06', '北京': 636, '上海': 305, '青岛': 350 },
          ]
        }
      } else if (index === 3) {
        this.productInvokeCode = '双人间'
        this.productChartData = {
          columns: ['时间', '北京', '上海', '青岛'],
          rows: [
            { '时间': '2019-03-01', '北京': 157, '上海': 100, '青岛': 300 },
            { '时间': '2019-03-02', '北京': 136, '上海': 150, '青岛': 307 },
            { '时间': '2019-03-03', '北京': 166, '上海': 115, '青岛': 297 },
            { '时间': '2019-03-04', '北京': 156, '上海': 125, '青岛': 215 },
            { '时间': '2019-03-05', '北京': 156, '上海': 105, '青岛': 555 },
            { '时间': '2019-03-06', '北京': 136, '上海': 135, '青岛': 250 },
          ]
        }
      }

    },
    selectForms (index) {
      console.log(index)
      this.formIsActive = index
      if (index === 0) {
        this.formInvokeName = '北京'
        this.formChartData = {
          columns: ['时间', 'xxxx', 'xxxx', 'xxxxx', 'xxxxx'],
          rows: [
            { '时间': '2019-03-01', '单人间': 56000, '双人间': 22000, 'XXXX': 8888, 'Y0906': 666 },
            { '时间': '2019-03-02', '单人间': 44000, '双人间': 24000, 'XXXX': 5888, 'Y0906': 766 },
            { '时间': '2019-03-03', '单人间': 51000, '双人间': 21000, 'XXXX': 6888, 'Y0906': 1166 },
            { '时间': '2019-03-04', '单人间': 59000, '双人间': 27000, 'XXXX': 8888, 'Y0906': 966 },
            { '时间': '2019-03-05', '单人间': 66000, '双人间': 12000, 'XXXX': 6888, 'Y0906': 1266 },
            { '时间': '2019-03-06', '单人间': 52000, '双人间': 29000, 'XXXX': 7888, 'Y0906': 1066 },
          ]
        }
      } else if (index === 1) {
        this.formInvokeName = '上海'
        this.formChartData = {
          columns: ['时间', '单人间', '双人间', 'XXXX', 'Y0906'],
          rows: [
            { '时间': '2019-03-01', '单人间': 12000, '双人间': 7000, 'XXXX': 300, 'Y0906': 500 },
            { '时间': '2019-03-02', '单人间': 14000, '双人间': 6000, 'XXXX': 388, 'Y0906': 666 },
            { '时间': '2019-03-03', '单人间': 11000, '双人间': 6600, 'XXXX': 338, 'Y0906': 466 },
            { '时间': '2019-03-04', '单人间': 19000, '双人间': 5500, 'XXXX': 298, 'Y0906': 566 },
            { '时间': '2019-03-05', '单人间': 16000, '双人间': 6900, 'XXXX': 388, 'Y0906': 466 },
            { '时间': '2019-03-06', '单人间': 12000, '双人间': 7900, 'XXXX': 488, 'Y0906': 666 },
          ]
        }
      }  else if (index === 2) {
        this.formInvokeName = '上海淇毓'
        this.formChartData = {
          columns: ['时间', '单人间', '双人间', '双人间', 'Y0906'],
          rows: [
            { '时间': '2019-03-01', '单人间': 10000, '双人间': 3000, 'XXXX': 2008, 'Y0906': 500 },
            { '时间': '2019-03-02', '单人间': 14000, '双人间': 4000, 'XXXX': 1588, 'Y0906': 466 },
            { '时间': '2019-03-03', '单人间': 11000, '双人间': 2700, 'XXXX': 1888, 'Y0906': 566 },
            { '时间': '2019-03-04', '单人间': 12000, '双人间': 2800, 'XXXX': 2288, 'Y0906': 565 },
            { '时间': '2019-03-05', '单人间': 13000, '双人间': 3300, 'XXXX': 2388, 'Y0906': 555 },
            { '时间': '2019-03-06', '单人间': 14000, '双人间': 3400, 'XXXX': 2288, 'Y0906': 666 },
          ]
        }
      } else if (index === 3) {
        this.formInvokeName = '北京济南'
        this.formChartData = {
          columns: ['时间', '单人间', '双人间', 'XXXX', 'Y0906'],
          rows: [
            { '时间': '2019-03-01', '单人间': 9000, '双人间': 2000, 'XXXX': 1000, 'Y0906': 333 },
            { '时间': '2019-03-02', '单人间': 8000, '双人间': 1800, 'XXXX': 1188, 'Y0906': 466 },
            { '时间': '2019-03-03', '单人间': 9000, '双人间': 2100, 'XXXX': 1118, 'Y0906': 466 },
            { '时间': '2019-03-04', '单人间': 9900, '双人间': 1800, 'XXXX': 888, 'Y0906': 555 },
            { '时间': '2019-03-05', '单人间': 8800, '双人间': 1900, 'XXXX': 999, 'Y0906': 444 },
            { '时间': '2019-03-06', '单人间': 9900, '双人间': 2000, 'XXXX': 990, 'Y0906': 666 },
          ]
        }
      }
    },
    bindSelectDate (e) {
      console.log(e)
      if (e === '今日') {
          this.invokeChartData = {
          columns: ['时间', '单人间访客', '双人间访客', 'XXXX'],
          rows: [
            { '时间': '10:00', '单人间访客': 2800, '双人间访客': 1000, 'XXXX': 900 },
            { '时间': '11:00', '单人间访客': 2600, '双人间访客': 1200, 'XXXX': 1400 },
            { '时间': '12:00', '单人间访客': 2700, '双人间访客': 1600, 'XXXX': 1200 },
            { '时间': '13:00', '单人间访客': 3000, '双人间访客': 1100, 'XXXX': 1600 },
            { '时间': '14:00', '单人间访客': 3100, '双人间访客': 1700, 'XXXX': 1900 },
            { '时间': '15:00', '单人间访客': 2900, '双人间访客': 2000, 'XXXX': 1800 },
            { '时间': '16:00', '单人间访客': 3300, '双人间访客': 1500, 'XXXX': 2200 },
          ]
        }
      } else if (e === '今日') {
          this.invokeChartData = {
          columns: ['时间', '单人间访客', '双人间访客', 'XXXX'],
          rows: [
            { '时间': '10:00', '单人间访客': 2800, '双人间访客': 1000, 'XXXX': 900 },
            { '时间': '11:00', '单人间访客': 2600, '双人间访客': 1200, 'XXXX': 1400 },
            { '时间': '12:00', '单人间访客': 2700, '双人间访客': 1600, 'XXXX': 1200 },
            { '时间': '13:00', '单人间访客': 3000, '双人间访客': 1100, 'XXXX': 1600 },
            { '时间': '14:00', '单人间访客': 3100, '双人间访客': 1700, 'XXXX': 1900 },
            { '时间': '15:00', '单人间访客': 2900, '双人间访客': 2000, 'XXXX': 1800 },
            { '时间': '16:00', '单人间访客': 3300, '双人间访客': 1500, 'XXXX': 2200 },
          ]
        }
      }

    }
  }
}
</script>

<style lang="stylus">
  .slider
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
      .slider
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
