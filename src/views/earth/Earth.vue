<template>
  <div id='GEOVISContainer'>
  </div>
</template>

<script>
  let momnet = require('moment');
  export default {
    name: 'Earth',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },

    mounted() {
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOGEzNjYxMy01NDU2LTQ3N2ItYjNlNi1kNDI0YjIyYjAwMTciLCJpZCI6NzQ2NjksImlhdCI6MTYzNzk0MTk1NX0.5_v9eIx3agmiAW9Pm43ZT_fSm-hClEJqGpU2RPtk6xU";
      let viewer = new Cesium.Viewer('GEOVISContainer', {
        animation: true,
        timeline: true,
        baseLayerPicker: false
      });
      viewer.imageryLayers.get(0).show = false;

       let osm = new Cesium.OpenStreetMapImageryProvider({
         url: "https://a.tile.openstreetmap.org/",
         minimumLevel: 0,
         maximumLevel: 18,
         fileExtension: "png",
       });
       viewer.imageryLayers.addImageryProvider(osm);

/*      //加载地图
      let imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: "/api/map/GoogleEarth/{z}/{x}/{reverseY}.jpg",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'jpg',
        minimumLevel: 0,
        maximumLevel: 20
      });
      viewer.scene.imageryLayers.addImageryProvider(imageryProvider);

      //加载地图标注
      let biaozhu = new Cesium.UrlTemplateImageryProvider({
        url: "/api/map/tianditu2/{z}/{x}/{reverseY}.png",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'png',
        minimumLevel: 0,
        maximumLevel: 20
      });
      viewer.scene.imageryLayers.addImageryProvider(biaozhu);

      //加载国界标注
      let guojie = new Cesium.UrlTemplateImageryProvider({
        url: "/api/map/tiandituBZ/{z}/{x}/{reverseY}.png",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'png',
        minimumLevel: 0,
        maximumLevel: 20
      });
      viewer.scene.imageryLayers.addImageryProvider(guojie);*/

      // 定位
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(107.16, 32.71, 15000000.0)
      });

      this.huifang(viewer);

      /*    //主线程采用new命令，调用Worker()构造函数，新建一个 Worker 线程
          let worker = new Worker('worker.js');
    //然后，主线程调用worker.postMessage()方法，向 Worker 发消息
          worker.postMessage('Hello World');
          worker.postMessage({method: 'echo', args: ['Work']});
    //接着，主线程通过worker.onmessage指定监听函数，接收子线程发回来的消息
          worker.onmessage = function (event) {
            console.log('Received message ' + event.data);
            doSomething();
          }

          function doSomething() {
            // 执行任务
            worker.postMessage('Work done!');
          }

    //Worker 完成任务以后，主线程就可以把它关掉
          worker.terminate();
    */

    },

    methods: {
      huifang(viewer) {
        viewer.scene.globe.enableLighting = true;
        let data = [];
        data[0] = [{longitude: 116.405419, dimension: 39.918034, height: 0, time: 0}, {
          longitude: 116.2821,
          dimension: 39.918145,
          height: 0,
          time: 40
        }, {longitude: 115.497402, dimension: 39.344641, height: 70000, time: 100}, {
          longitude: 107.942392,
          dimension: 29.559967,
          height: 70000,
          time: 280
        }, {longitude: 106.549265, dimension: 29.559967, height: 0, time: 360}];
        data[1] = [{longitude: 116.405419, dimension: 39.918034, height: 0, time: 0}, {
          longitude: 117.034586,
          dimension: 39.881202,
          height: 0,
          time: 40
        }, {longitude: 116.340088, dimension: 38.842224, height: 70000, time: 100}, {
          longitude: 113.489176,
          dimension: 23.464017,
          height: 70000,
          time: 280
        }, {longitude: 113.262084, dimension: 23.13901, height: 0, time: 360}];
        data[2] = [{longitude: 118.838979, dimension: 32.073514, height: 0, time: 0}, {
          longitude: 118.438838,
          dimension: 32.03777,
          height: 0,
          time: 40
        }, {longitude: 117.802406, dimension: 31.91231, height: 70000, time: 100}, {
          longitude: 104.043645,
          dimension: 35.993845,
          height: 70000,
          time: 280
        }, {longitude: 101.807224, dimension: 36.660972, height: 0, time: 360}];
        // 起始时间
        let start = Cesium.JulianDate.fromDate(new Date(2022, 1, 1));
        // 结束时间
        let stop = new Cesium.JulianDate();
        Cesium.JulianDate.addSeconds(start, 360, stop);

        console.log(momnet(Cesium.JulianDate.toDate(start).getTime()).format('YYYY-MM-DD HH:mm:ss'), momnet(Cesium.JulianDate.toDate(stop).getTime()).format('YYYY-MM-DD HH:mm:ss'));

        // 设置始时钟始时间
        viewer.clock.startTime = start.clone();
        // 设置时钟当前时间
        viewer.clock.currentTime = start.clone();
        // 设置始终停止时间
        viewer.clock.stopTime = stop.clone();
        // 时间速率，数字越大时间过的越快
        viewer.clock.multiplier = 10;

        viewer.clock.animation = true;
        // 时间轴
        viewer.timeline.zoomTo(start, stop);
        // 循环执行,即为2，到达终止时间，重新从起点时间开始
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

// viewer.camera.flyTo({
//     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,20000)
// })
        for (let j = 0; j < data.length; j++) {
          let property = this.computeFlight(data[j], start);
          console.log('----------->', property);
          // 添加模型
          let planeModel = viewer.entities.add({
            // 和时间轴关联
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
              start: start,
              stop: stop
            })]),
            position: property,
            // 根据所提供的速度计算模型的朝向
            orientation: new Cesium.VelocityOrientationProperty(property),
            // 模型数据
            model: {
              uri: '../../static/imgs/wx.glb',
              minimumPixelSize: 128
            }
          });

        }

      },

      computeFlight(source, start) {
        // 取样位置 相当于一个集合
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
          let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
          let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
          // 添加位置，和时间对应
          property.addSample(time, position);
        }
        return property;
      }
    }
  }
</script>
<style>
  html,
  body,
  #GEOVISContainer {
    z-index: 100;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

</style>
