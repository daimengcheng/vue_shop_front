<template>
  <div id="main"></div>
</template>

<script type="text/ecmascript-6">
import * as echarts from 'echarts';
import {reqReports} from '../../API/index'
export default {
  data(){
    return {
      option:{
        tooltip: {
          trigger: 'axis'
        },
        legend:{},
        series:[],
        xAxis:{},
        yAxis:{}
      }
    }
  },

  // 实例化一个echarts对象
  async mounted(){
    const result = await reqReports()
    let myEcharts = echarts.init(document.getElementById('main'))
    const {legend,series,xAxis,yAxis} = result.data
    this.option.legend = legend
    this.option.series = series
    this.option.xAxis = xAxis
    this.option.yAxis = yAxis
    myEcharts.setOption(this.option)

    console.log(result)
  }
}
</script>

<style scoped lang="less">
#main {
  width: 800px;
  height: 600px;
}
</style>
