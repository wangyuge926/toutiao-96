<template>
    <div class="fans-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
         <el-tab-pane label="粉丝列表" name="list">
            <div class="fans_list">
                <div class="fans_item">
                    <span class="el-avatar el-avatar--circle" style="height: 80px; width: 80px; line-height: 80px">
                        <img src="http://toutiao.meiduo.site/FnohgHfO0RTdnqx60wAL86e6Kmj5" style="img: cover">
                    </span>
                    <p>哈哈哈</p>
                    <el-button type="button" class="el-button el-button--primary el-button--small is-plain">+关注</el-button>
                </div>
            </div>
         </el-tab-pane>
         <el-tab-pane label="粉丝画像" name="img">
             <!-- 1. 为 ECharts 准备一个具备大小（宽高）的画布容器 DOM -->
            <div ref="main" style="width: 600px;height:400px;"></div>

            <h2>地图图表示例</h2>
            <map-demo />

            <h2>纯粹的百度地图示例</h2>
            <bmap-demo/>
         </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
import MapDemo from './components/map-demo'
import BmapDemo from './components/bmap-demo'

export default {
  name: 'FansIndex',
  components: {
    MapDemo, // 百度地图结合 echarts
    BmapDemo // 纯粹的百度地图
  },
  props: {},
  data () {
    return {
      activeName: 'img'
    }
  },
  computed: {},
  watch: {},
  created () {},
  // 注意：初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    handleClick (tab, event) {
    //   console.log('哈哈哈')
    }
  }
}
</script>

<style scoped lang="less" >
.fans_item {
    width: 120px;
    height: 190;
    border: 1px dashed #ccc;
    text-align: center;
    padding: 10px 0;
    p {
        font-size: 14px;
        text-align: center;
    }
    .button {
        padding: 20px;
    }
}
</style>
