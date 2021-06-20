<template>
  <!--大页面下更新按钮和下拉框一行-->
  <el-row type="flex" justify="space-between">
    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
      <span class="line-height-40 hidden-xs-only">RSS订阅: </span>
      <el-select
        v-model="nowSelectRssFeed"
        @change="selectRssFeedChanged"
        placeholder="请选择"
      >
        <el-option
          v-for="item in selectRssFeeds"
          :key="item.rssFeedId"
          :label="item.rssFeedName"
          :value="item.rssFeedId"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
      <el-button
        class="float-right hidden-xs-only"
        type="primary"
        icon="el-icon-refresh"
        :loading="rssFeedIsUpdating"
        @click="updateRssFeed"
        >更新{{ refeshButtonText }}</el-button
      >
    </el-col>
  </el-row>
  <!--小页面下更新按钮另起一行-->
  <el-row
    type="flex"
    justify="space-between"
    class="hidden-sm-and-up margin-top-20"
  >
    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
      <el-button
        type="primary"
        icon="el-icon-refresh"
        :loading="rssFeedIsUpdating"
        @click="updateRssFeed"
        >更新{{ refeshButtonText }}</el-button
      >
    </el-col>
  </el-row>
  <!--大页面下列表两列内容-->
  <el-table :data="animeTableData" class="width-100-percent hidden-xs-only">
    <el-table-column type="expand">
      <template #default="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="网页链接:">
            <el-link
              type="primary"
              :href="props.row.animePageUrl"
              target="_blank"
              >{{ props.row.animePageUrl }}</el-link
            >
          </el-form-item>
          <el-form-item label="下载链接:">
            <span>{{ props.row.downloadUrl }}</span>
          </el-form-item>
          <br />
          <el-button
            icon="el-icon-download"
            :loading="isSending2Aria"
            @click="send2Aira(props.row)"
            type="primary"
            >使用aria2下载</el-button
          >
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      width="180"
      label="发布时间"
      prop="animePublishDate"
    ></el-table-column>
    <el-table-column label="标题" prop="animeTitle"></el-table-column>
  </el-table>
  <!--小页面下列表一列内容-->
  <el-table :data="animeTableData" class="width-100-percent hidden-sm-and-up">
    <el-table-column type="expand">
      <template #default="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="网页链接:">
            <el-link
              type="primary"
              :href="props.row.animePageUrl"
              target="_blank"
              >{{ props.row.animePageUrl }}</el-link
            >
          </el-form-item>
          <el-form-item label="下载链接:">
            <span>{{ props.row.downloadUrl }}</span>
          </el-form-item>
          <br />
          <el-button
            icon="el-icon-download"
            :loading="isSending2Aria"
            @click="send2Aira(props.row)"
            type="primary"
            >使用aria2下载</el-button
          >
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="标题" prop="animeTitle"></el-table-column>
  </el-table>
  <div class="margin-top-20 margin-left-20">
    <!--大页面时展示完整分页-->
    <el-pagination
      class="hidden-xs-only"
      @size-change="handleAnimeTableSizeChange"
      @current-change="handleAnimeTableCurrentChange"
      v-model:currentPage="animePage.pageNum"
      :page-size="animePage.pageSize"
      layout="sizes, total, prev, pager, next"
      :page-sizes="[10, 15, 20, 25, 30]"
      :total="animePage.totalElements"
    >
    </el-pagination>
    <!--小页面时展示精简分页-->
    <el-pagination
      class="hidden-sm-and-up"
      @size-change="handleAnimeTableSizeChange"
      @current-change="handleAnimeTableCurrentChange"
      v-model:currentPage="animePage.pageNum"
      :page-size="animePage.pageSize"
      layout="prev, pager, next"
      :page-sizes="[10, 15, 20, 25, 30]"
      :total="animePage.totalElements"
      :pager-count="4"
    >
    </el-pagination>
  </div>
</template>

<style>
.line-height-40 {
  line-height: 40px;
}
.float-right {
  float: right;
}
.width-100-percent {
  width: 100%;
}
.margin-top-20 {
  margin-top: 20px;
}
.margin-left-20 {
  margin-left: 20px;
}
</style>

<script>
import axios from "axios";
export default {
  setup() {},
  data() {
    return {
      animeTableData: [],
      selectRssFeeds: [],
      nowSelectRssFeed: 0,
      animePage: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 0,
      },
      rssFeedIsUpdating: false,
      refeshButtonText: "全部RSS订阅",
      isSending2Aria: false,
    };
  },
  mounted() {
    this.requestRssFeedsSelect();
    this.requestGetAminePage();
  },
  methods: {
    requestGetAminePage() {
      let vueThis = this;
      axios
        .get(
          "anime?pageSize=" +
            this.animePage.pageSize +
            "&pageNum=" +
            this.animePage.pageNum
        )
        .then((response) => {
          vueThis.animeTableData = response.data.pageData;
          vueThis.animePage.pageSize = response.data.pageSize;
          vueThis.animePage.pageNum = response.data.pageNum;
          vueThis.animePage.totalElements = response.data.totalElements;
        })
        .catch((error) => {
          let showMsg = "请求失败";
          if (error.response) {
            showMsg = error.response.data.message;
          }
          vueThis.$message({
            type: "error",
            message: showMsg,
          });
        });
    },
    selectRssFeedChanged(selectId) {
      let vueThis = this;
      if (selectId == 0) {
        this.refeshButtonText = "全部RSS订阅";
        this.requestGetAminePage();
      } else {
        this.selectRssFeeds.forEach((rssFeed) => {
          if (rssFeed.rssFeedId == selectId) {
            vueThis.refeshButtonText = rssFeed.rssFeedName;
          }
          this.requestGetOneFeedAnimePage();
        });
      }
    },
    requestGetOneFeedAnimePage() {
      let vueThis = this;
      axios
        .get(
          "rssFeeds/" +
            this.nowSelectRssFeed +
            "/anime?pageSize=" +
            this.animePage.pageSize +
            "&pageNum=" +
            this.animePage.pageNum
        )
        .then((response) => {
          vueThis.animeTableData = response.data.pageData;
          vueThis.animePage.pageSize = response.data.pageSize;
          vueThis.animePage.pageNum = response.data.pageNum;
          vueThis.animePage.totalElements = response.data.totalElements;
        })
        .catch((error) => {
          let showMsg = "请求失败";
          if (error.response) {
            showMsg = error.response.data.message;
          }
          vueThis.$message({
            type: "error",
            message: showMsg,
          });
        });
    },
    requestRssFeedsSelect() {
      let vueThis = this;
      axios
        .get("rssFeeds/all")
        .then((response) => {
          let defaultSelect = [{ rssFeedId: 0, rssFeedName: "全部" }];
          vueThis.selectRssFeeds = defaultSelect.concat(response.data);
        })
        .catch((error) => {
          let showMsg = "请求失败";
          if (error.response) {
            showMsg = error.response.data.message;
          }
          vueThis.$message({
            type: "error",
            message: showMsg,
          });
        });
    },
    updateRssFeed() {
      let vueThis = this;
      let patchPath = "";
      if (this.nowSelectRssFeed == 0) {
        patchPath = "anime";
      } else {
        patchPath = "rssFeeds/" + this.nowSelectRssFeed + "/anime";
      }
      this.rssFeedIsUpdating = true;
      axios
        .patch(patchPath, {})
        .then((response) => {
          vueThis.rssFeedIsUpdating = false;
          let resultMessage = "";
          if (response.data.newCount <= 0) {
            resultMessage = "暂无动画更新";
          } else {
            resultMessage = "更新了" + response.data.newCount + "条动画记录";
          }
          vueThis.$notify({
            title: "更新成功",
            message: resultMessage,
          });
          if (vueThis.nowSelectRssFeed == 0) {
            vueThis.requestGetAminePage();
          } else {
            vueThis.requestGetOneFeedAnimePage();
          }
        })
        .catch((error) => {
          vueThis.rssFeedIsUpdating = false;
          let showMsg = "请求失败";
          if (error.response) {
            showMsg = error.response.data.message;
          }
          vueThis.$message({
            type: "error",
            message: showMsg,
          });
        });
    },
    send2Aira(row) {
      let vueThis = this;
      vueThis.isSending2Aria = true;
      axios
        .put("anime/" + row.animeId + "/aria2DownloadMission", {})
        .then(() => {
          vueThis.isSending2Aria = false;
          vueThis.$notify({
            title: "提示",
            message: "下载任务：" + row.animeTitle + " 已发送至Aria2",
          });
        })
        .catch((error) => {
          vueThis.isSending2Aria = false;
          let showMsg = "请求失败";
          if (error.response) {
            showMsg = error.response.data.message;
          }
          vueThis.$message({
            type: "error",
            message: showMsg,
          });
        });
    },
    handleAnimeTableSizeChange(val) {
      this.animePage.pageSize = val;
      this.requestGetAminePage();
    },
    handleAnimeTableCurrentChange(val) {
      this.animePage.pageNum = val;
      this.requestGetAminePage();
    },
  },
};
</script>