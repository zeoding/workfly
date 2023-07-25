import interact from 'interactjs'

interact('.el-table__row')
  .resizable({
    edges: { left: false, right: false, bottom: true, top: false },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],
    inertia: true
  })
  .on('resizemove', function (event) {
    let target = event.target
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'
  })



<template>
  <div class="container">
      <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          v-if="tableShow"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
  </div>
</template>
 
<script>
export default {
  data() {
      return {
          // 表格展示的token
          tableShow: false,
          // 行高改变的一些字段
          targetTd: null,
          coltargetTd: null,
          resizeable: false,
          mousedown: false,
          // 表格样例数据
          tableData: [
              {
                  id: 1,
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
              },
              {
                  id: 2,
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1517 弄"
              },
              {
                  id: 3,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄",
                  children: [
                      {
                          id: 31,
                          date: "2016-05-01",
                          name: "王小虎",
                          address: "上海市普陀区金沙江路 1519 弄"
                      },
                      {
                          id: 32,
                          date: "2016-05-01",
                          name: "王小虎",
                          address: "上海市普陀区金沙江路 1519 弄"
                      }
                  ]
              },
              {
                  id: 4,
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1516 弄"
              }
          ],
      };
  },
  mounted() {
      // 这里比较重要，在表格dom渲染完成后，再进行事件的添加操作
      this.tableShow = true;
      this.$nextTick(() => {
          // 表格添加列宽变化
          this.tableInit();
      });
  },
 
  methods: {
      tableInit() {
          let self = this;
          /* 获取头部td集合,这边是测试表格，只有一个所以直接el-table__body 的0，后续可以在<el-table> 加class，
          再用querySelector
          */
          let tblObj = document.getElementsByClassName("el-table__body")[0];
          //如果不用数组，最后遍历的时候不能有【】这个来选取元素
          let headerRows = new Array();
          for (let i = 0; i < tblObj.rows.length; i++) {
              //只有rows这个能选，col要先选rows，然后用cells
              headerRows[i] = tblObj.rows[i].cells[0];
          }
          // 去头部的位置
          let headerTds = document.getElementsByClassName("el-table__body")[0]
              .rows[0].cells;
          let screenYStart = 0;
          let tdHeight = 0;
          let headerHeight = 0;
 
          for (let i = 0; i < headerRows.length; i++) {
              //添加头部单元格事件
              this.addListener(headerRows[i], "mousedown", onmousedown);
              this.addListener(headerRows[i], "mousemove", onmousemove);
          }
 
          document.onmousedown = function(event) {
              if (this.resizeable) {
                  let evt = event || window.event;
                  this.mousedown = true;
                  screenYStart = evt.screenY;
                  tdHeight = this.targetTd.offsetHeight;
                  headerHeight = tblObj.offsetHeight;
              }
          };
          document.onmousemove = function(event) {
              let evt = event || window.event;
              let srcObj = self.getTarget(evt);
              //rowIndex是未定义！！！cellIndex是好用的。我应该获取的是tr的rowindex
              //获取偏移 这里是鼠标的偏移
              let offsetY = evt.offsetY;
              if (this.mousedown) {
                  let height = tdHeight + (evt.screenY - screenYStart) + "px"; //计算后的新的宽度，原始td+偏移
                  this.targetTd.style.height = height;
                  tblObj.style.height =
                      headerHeight + (evt.screenY - screenYStart) + "px";
              } else {
                  //修改光标样式，ele原来头部的不能影响，于是有一些offset位置的判断，如有更好的方式请留言
                  if (
                      srcObj.offsetHeight - evt.offsetY <= 8 &&
                      srcObj.offsetWidth - evt.offsetX > 8
                  ) {
                      this.targetTd = srcObj;
                      this.resizeable = true;
                      srcObj.style.cursor = "row-resize"; //修改光标样式
                  } else if (evt.offsetY <= 8 && evt.offsetX > 8) {
                      if (srcObj.parentNode.rowIndex) {
                          this.targetTd =
                              tblObj.rows[
                                  srcObj.parentNode.rowIndex - 1
                              ].cells[0];
                          this.resizeable = true;
                          srcObj.style.cursor = "row-resize";
                      }
                  } else if (
                      srcObj.offsetHeight - evt.offsetY > 8 &&
                      srcObj.offsetWidth - evt.offsetX <= 8
                  ) {
                      srcObj.style.cursor = "column-resize"; //修改光标样式
                  } else if (evt.offsetY > 8 && evt.offsetX <= 8) {
                      if (srcObj.parentNode.rowIndex) {
                          srcObj.style.cursor = "column-resize";
                      }
                  } else {
                      this.resizeable = false;
                      srcObj.style.cursor = "default";
                  }
              }
          };
          //放开鼠标恢复原位
          document.onmouseup = function(event) {
              this.tartgetTd = null;
              this.coltargetTd = null;
              this.resizeable = false;
              this.mousedown = false;
              document.body.style.cursor = "default";
          };
      },
      // 得到目标值事件
      getTarget(evt) {
          return evt.target || evt.srcElement;
      },
      // 添加监听
      addListener(element, type, listener, useCapture) {
          //这是两种写法，对应不同浏览器
          element.addEventListener
              ? element.addEventListener(type, listener, useCapture)
              : element.attachEvent("on" + type, listener);
      }
  }
};
</script>
 
<style lang="scss" scoped>
</style>


import Vue from 'vue';
let resizeable = false
let mousedown = false
let newindex = null
let targetTd = null
Vue.directive('dragTable', {
  inserted: function(el,binding,vnode,prevVnode) {
    /* 获取头部td集合,这边是测试表格，只有一个所以直接el-table__body 的0，后续可以在<el-table> 加class，
    再用querySelector
    */
    let tblObj = el.getElementsByClassName("el-table__body");
    //如果不用数组，最后遍历的时候不能有【】这个来选取元素
    let headerRows = [];
    for (const item of tblObj) {
      for (const itemElement of item.rows) {
        headerRows[itemElement] = itemElement.cells[0]
      }
    }
    // 去头部的位置
    let headerTds = el.getElementsByClassName("el-table__body")[0]
      .rows[0];
    let screenYStart = 0;
    let tdHeight = 0;

    for (let i = 0; i < headerRows.length; i++) {
      //添加头部单元格事件
      addListener(headerRows[i], "mousedown", onmousedown);
      addListener(headerRows[i], "mousemove", onmousemove);
    }
    //鼠标点击触发事件
    document.onmousedown = function(event) {
      //如果不是tanle就不给他托
      if(!event.target._prevClass || (event.target._prevClass && event.target._prevClass.indexOf('table') === -1)){
        return
      }
      //获取当前行数下标
      let tr = event.target.parentElement
      let td = event.target.parentElement.parentElement.children
      let index = 0
      for (const item of td) {
        item.setAttribute('id',index++)
      }
      newindex = tr.getAttribute('id')
      if (resizeable) {
        let evt = event || window.event;
        mousedown = true;
        screenYStart = evt.screenY;
        tdHeight = targetTd.offsetHeight
      }
    };
    //鼠标拖拽触发事件
    document.onmousemove = function(event) {
      //如果不是table就不给他托
      if(!event.target._prevClass || (event.target._prevClass && event.target._prevClass.indexOf('table') === -1)){
        return
      }
      let evt = event || window.event;
      let srcObj = getTarget(evt);
      //rowIndex是未定义！！！cellIndex是好用的。我应该获取的是tr的rowindex
      //获取偏移 这里是鼠标的偏移
      let offsetY = evt.offsetY;
      if (mousedown) {
        let newHeight = tdHeight + (evt.screenY - screenYStart) + "px"; //计算后的新的宽度，原始td+偏移
        for (const item of tblObj) {
          let trlist = item.getElementsByTagName('tbody')[0].children
          let trIndex = parseInt(newindex)
          trlist[trIndex < 0 ? 0 : trIndex].style.height = newHeight
        }
      } else {
        //修改光标样式，ele原来头部的不能影响，于是有一些offset位置的判断，如有更好的方式请留言
        srcObj.style.cursor = '';
        if (
          srcObj.offsetHeight - evt.offsetY <= 4 &&
          srcObj.offsetWidth - evt.offsetX > 4
        ) {
          srcObj.style.cursor = '';
          targetTd = srcObj
          resizeable = true;
          srcObj.style.cursor = "row-resize"; //修改光标样式
        } else if (evt.offsetY <= 4 && evt.offsetX > 4) {
          srcObj.style.cursor = '';
          if (srcObj.parentNode.rowIndex) {
            resizeable = true;
            // srcObj.style.cursor = "row-resize";
          }
        } else if (
          srcObj.offsetHeight - evt.offsetY > 4 &&
          srcObj.offsetWidth - evt.offsetX <= 4
        ) {
          srcObj.style.cursor = '';
          srcObj.style.cursor = "column-resize"; //修改光标样式
        }
        else if (evt.offsetY > 4 && evt.offsetX <= 4) {
          srcObj.style.cursor = '';
          if (srcObj.parentNode.rowIndex) {
            // srcObj.style.cursor = "column-resize";
          }
        } else {
          srcObj.style.cursor = '';
          resizeable = false;
          srcObj.style.cursor = "default";
        }
      }
    };
    //放开鼠标恢复原位
    document.onmouseup = function(event) {
      resizeable = false;
      mousedown = false;
      document.body.style.cursor = "default";
    };
    // 得到目标值事件
    function getTarget(evt) {
      return evt.target || evt.srcElement;
    }
    // 添加监听
    function addListener(element, type, listener, useCapture) {
      //这是两种写法，对应不同浏览器
      element.addEventListener
        ? element.addEventListener(type, listener, useCapture)
        : element.attachEvent("on" + type, listener);
    }
  },
});