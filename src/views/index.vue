<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="24">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in images" :key="item.name">
            <img :src="item.src" style="height:100%;width:100%;object-fit:cover"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>近七日采摘情况</span>
          </div>
          <div id="pickEchart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>近七日销售情况</span>
          </div>
          <div id="saleEchart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>捐赠支持</span>
          </div>
          <div class="body">
            <img
              src="https://oscimg.oschina.net/oscnet/up-d6695f82666e5018f715c41cb7ee60d3b73.png"
              alt="donate"
              width="100%"
            />
            <span style="display: inline-block; height: 30px; line-height: 30px"
            >你可以请作者喝杯咖啡表示鼓励</span
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        // 版本号
        version: '3.3.0',
        images: [
          {
            name: 'IMG_20220404_141355',
            src: require('@/assets/carousel/IMG_20220404_141355.jpg'),
            title: 'IMG_20220404_141355'
          },
          {
            name: 'IMG_20220501_093550',
            src: require('@/assets/carousel/IMG_20220501_093550.jpg'),
            title: 'IMG_20220501_093550'
          },
          {
            name: 'IMG_20220501_095659',
            src: require('@/assets/carousel/IMG_20220501_095659.jpg'),
            title: 'IMG_20220501_095659'
          },
          {
            name: 'IMG_20220502_110437_1',
            src: require('@/assets/carousel/IMG_20220502_110437_1.jpg'),
            title: 'IMG_20220502_110437_1'
          },
          {
            name: 'IMG_20220502_110555',
            src: require('@/assets/carousel/IMG_20220502_110555.jpg'),
            title: 'IMG_20220502_110555'
          },
          {
            name: 'IMG_20220502_110907',
            src: require('@/assets/carousel/IMG_20220502_110907.jpg'),
            title: 'IMG_20220502_110907'
          }
        ]
      }
    },

    mounted () {
      this.staticsPickForEchart()
      this.staticsSalesForEchart();
    },

    methods: {
      staticsPickForEchart () {
        let myChart = echarts.init(document.getElementById('pickEchart'))
        let option = {
          title: {
            text: 'Stacked Line'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Search Engine',
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              smooth: true
            }
          ]
        }
        myChart.setOption(option)
      },

      staticsSalesForEchart(){
        let myChart = echarts.init(document.getElementById('saleEchart'))
        let option = {
          title: {
            text: 'Stacked Line'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Search Engine',
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              smooth: true
            }
          ]
        }
        myChart.setOption(option)
      }
    },
  }
</script>

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }

    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }

    .col-item {
      margin-bottom: 20px;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
      list-style-type: none;
    }

    h4 {
      margin-top: 0px;
    }

    h2 {
      margin-top: 10px;
      font-size: 26px;
      font-weight: 100;
    }

    p {
      margin-top: 10px;

      b {
        font-weight: 700;
      }
    }

    .update-log {
      ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
      }
    }
  }
</style>

