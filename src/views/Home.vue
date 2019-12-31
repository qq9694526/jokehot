<template>
  <div class="home">
    <section class="list">
      <div class="title-wrap">
        <div class="title">搜索热点</div>
        <div class="right align-center">
          <span>换一换</span>
          <span class="icon"></span>
        </div>
      </div>
      <div v-for="(item,index) in list" :key="index" class="row">
        <div class="left">
          <span class="tag-index" :class="[index<3,`index${index+1}`]">{{index+1}}</span>
          <span class="text">{{item.title}}</span>
          <span v-if="item.isNew" class="icon-new">新</span>
        </div>
        <div class="right align-center">
          <span>{{item.heat|numToWan}}</span>
          <span class="icon" :style="`opacity: ${item.isRise?'1':'0'};`"></span>
        </div>
      </div>
    </section>
    <section v-if="list[0]" class="input-wrap">
      <div class="label">请输入恶搞信息：</div>
      <input v-model="list[0].title" type="text" placeholder="请输入恶搞信息" />
    </section>
  </div>
</template>

<script>
const axios = require("axios");
var cheerio = require("cheerio"); // Basically jQuery for node.js
export default {
  name: "home",
  data() {
    return {
      list: []
    };
  },
  created() {
    this.baiduTop();
  },
  methods: {
    baiduTop() {
      const self = this;
      axios.get("/baidu/buzz?b=1&c=513&fr=topbuzz_b42_c513", {
        responseType: "blob",
        transformResponse: [
          function(data) {
            let reader = new FileReader();
            reader.readAsText(data, "GBK");
            reader.onload = function(e) {
              self.filterData(reader.result);
            };
            return data;
          }
        ]
      });
    },
    filterData(html) {
      const $ = cheerio.load(html);
      let result = [];
      $(".list-table tr").map((index, item) => {
        if (
          result.length < 10 &&
          $(item)
            .find(".list-title")
            .text()
        ) {
          result.push({
            title: $(item)
              .find(".list-title")
              .text(),
            heat: Number(
              $(item)
                .find(".last")
                .text()
            ),
            isNew: $(item)
              .find(".list-title")
              .siblings()
              .hasClass("icon-new"),
            isRise:
              $(item)
                .find(".last>span")
                .attr("class") === "icon-rise"
          });
        }
      });
      this.list = result;
      console.log(JSON.stringify(result));
    }
  },
  filters: {
    numToWan(num) {
      return Math.round(num / 10000) + "万";
    }
  }
};
</script>
<style lang="less" scoped>
.input-wrap{
  display: flex;
  margin-top: 30px;
  width: calc(100% - 30px);
  max-width: 350px;
  font-size: 14px;
}
.align-center {
  display: flex;
  align-items: center;
}
.list {
  width: calc(100% - 30px);
  max-width: 350px;
  padding-left: 17px;
  margin-top: 30px;
  border-left: 1px solid #e1e1e1;
}
.title-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5px;
  font-size: 14px;
  line-height: 1.29;
  .title {
    font-weight: 700;
  }
  .right {
    color: rgb(0, 0, 204);
    .icon {
      background-image: url(../assets/refresh.png);
      background-size: 100% 100%;
      margin-left: 3px;
      width: 16px;
      height: 16px;
    }
  }
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6.5px;
  padding-bottom: 6.5px;
  line-height: 1.54;
  font-size: 13px;
  border-bottom: 1px solid #f3f3f3;
  text-align: left;
  .tag-index {
    display: inline-block;
    padding: 1px 0;
    color: #fff;
    width: 14px;
    line-height: 100%;
    font-size: 12px;
    text-align: center;
    background-color: #8eb9f5;
    margin-right: 5px;
    &.index1 {
      background-color: #f54545;
    }
    &.index2 {
      background-color: #ff8547;
    }
    &.index3 {
      background-color: #ffac38;
    }
  }
  .left {
    display: flex;
    align-items: center;
    .text {
      color: rgb(0, 0, 204);
    }
    .icon-new {
      display: inline-block;
      padding: 2px;
      text-align: center;
      font-size: 12px;
      line-height: 100%;
      font-style: normal;
      font-weight: 400;
      color: #fff;
      overflow: hidden;
      background-color: #f13f40;
      position: relative;
      margin-left: 5px;
    }
  }
  .right {
    .icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: text-bottom;
      font-style: normal;
      overflow: hidden;
      background: url(../assets/icons.png) no-repeat 0 0;
      background-position: -720px -168px;
      margin-bottom: 2px;
      margin-left: 3px;
    }
  }
}
</style>
