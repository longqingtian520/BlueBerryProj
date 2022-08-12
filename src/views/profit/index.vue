<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <p :style="{'float':'left'}">成本统计</p>
              <p :style="{'float':'right'}">{{costAmount}} 元</p>
            </div>
            <div id="costEchart" style="height:500px;"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <p :style="{'float':'left'}">销售统计</p>
              <p :style="{'float':'right'}">{{saleAmount}} 元</p>
            </div>
            <div id="saleEchart" style="height:500px;"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <p>利润统计</p>
            </div>
            <div id="profitEchart" style="height:500px;"></div>
          </el-card>
        </el-col>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import {queryCostEchartDatas, querySaleEchartDatas} from '../../api/profit'

  export default {
    name: 'Profit',
    data () {
      return {
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: [],
        // 成本
        costAmount: 0,
        // 销售
        saleAmount: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          buyTime: undefined,

        },
      }
    },

    mounted () {
      let rq = {}
      rq.beginDate = ''
      rq.endDate = ''
      this.drawEchart(rq)
    },

    methods: {
      handleQuery () {
        let rq = this.addDateRange(this.queryParams, this.dateRange)
        this.drawEchart(rq)
      },

      resetQuery(){
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },

      drawEchart (rq) {
        queryCostEchartDatas(rq).then(resp => {
          this.costAmount= 0;
          let data = resp.data
          console.log(resp)
          let values = []
          let colNames = Object.keys(data)
          Object.keys(data).forEach(key => {
            let v = {}
            v.name = key
            v.value = data[key]
            values.push(v)
            this.costAmount += parseFloat(v.value)
          })

          this.statisticsCostData(colNames, values)
        })

        querySaleEchartDatas(rq).then(resp => {
          this.saleAmount = 0;
          let data = resp.data
          console.log(resp)
          let values = []
          let colNames = Object.keys(data)
          Object.keys(data).forEach(key => {
            let v = {}
            v.name = key
            v.value = data[key]
            values.push(v)
            this.saleAmount += parseFloat(v.value)
          })

          this.statisticsSaleData(colNames, values)
        })
      },

      statisticsSaleData (colNames, values) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('saleEchart'))

        // 指定图表的配置项和数据
        let option = {
          title: {
            text: 'Sale Statistics',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: colNames
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: values,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },

      statisticsCostData (colNames, values) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('costEchart'))

        let option = {
          title: {
            text: 'Cost Statistics',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: colNames
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: values,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      }

    }
  }
</script>

<style scoped>

</style>
