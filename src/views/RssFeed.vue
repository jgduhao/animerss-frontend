<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="addRssFeed('rssFeedForm')"
      >新增RSS订阅</el-button
    >
  </div>
  <!--大页面时展示四列-->
  <el-table
    :data="rssFeedTableData"
    class="width-100-percent margin-top-20 hidden-xs-only"
  >
    <el-table-column prop="rssFeedUpdateDate" label="更新时间" width="180">
    </el-table-column>
    <el-table-column prop="rssFeedCreateDate" label="添加时间" width="180">
    </el-table-column>
    <el-table-column prop="rssFeedName" label="订阅名称"> </el-table-column>
    <el-table-column label="操作" width="270">
      <template #default="scope">
        <el-button
          size="mini"
          :loading="isOpeningRssFeedForm"
          @click="editRssFeed(scope.row)"
          >编辑</el-button
        >
        <el-button size="mini" type="danger" @click="deleteRssFeed(scope.row)"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="clearRssFeedAnime(scope.row)"
          >清空</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!--小页面时展示两列-->
  <el-table
    :data="rssFeedTableData"
    class="width-100-percent margin-top-20 hidden-sm-and-up"
  >
    <el-table-column prop="rssFeedName" label="订阅名称"> </el-table-column>
    <el-table-column label="操作" width="235">
      <template #default="scope">
        <el-button
          size="mini"
          :loading="isOpeningRssFeedForm"
          @click="editRssFeed(scope.row)"
          >编辑</el-button
        >
        <el-button size="mini" type="danger" @click="deleteRssFeed(scope.row)"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="clearRssFeedAnime(scope.row)"
          >清空</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!--大页面时展示完整分页-->
  <div class="margin-top-20">
    <el-pagination
      class="hidden-xs-only"
      @size-change="handleRssFeedTableSizeChange"
      @current-change="handleRssFeedTableCurrentChange"
      v-model:currentPage="rssFeedPage.pageNum"
      :page-size="rssFeedPage.pageSize"
      layout="sizes, total, prev, pager, next"
      :page-sizes="[10, 15, 20, 25, 30]"
      :total="rssFeedPage.totalElements"
    >
    </el-pagination>
    <!--小页面时展示精简分页-->
    <el-pagination
      class="hidden-sm-and-up"
      @size-change="handleRssFeedTableSizeChange"
      @current-change="handleRssFeedTableCurrentChange"
      v-model:currentPage="rssFeedPage.pageNum"
      :page-size="rssFeedPage.pageSize"
      layout="prev, pager, next"
      :page-sizes="[10, 15, 20, 25, 30]"
      :total="rssFeedPage.totalElements"
      :pager-count="4"
    >
    </el-pagination>
  </div>
  <el-dialog title="RSS订阅" v-model="rssFeedFormVisible" width="80%">
    <el-form :model="rssFeedForm" :rules="rssFeedFormRules" ref="rssFeedForm">
      <el-form-item
        label="订阅名称："
        :label-width="rssFeedFormLabelWidth"
        prop="rssFeedName"
      >
        <el-input
          v-model="rssFeedForm.rssFeedName"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="订阅地址："
        :label-width="rssFeedFormLabelWidth"
        prop="rssFeedUrl"
      >
        <el-input
          v-model="rssFeedForm.rssFeedUrl"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRssFeedForm('rssFeedForm')">取消</el-button>
        <el-button
          type="primary"
          :loading="rssFeedIsSubmiting"
          @click="submitRssFeedForm('rssFeedForm')"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<style>
.width-100-percent {
  width: 100%;
}
.margin-top-20 {
  margin-top: 20px;
}
</style>

<script>
import axios from "axios";
export default {
  setup() {},
  mounted() {
    this.requestRssFeedPage();
  },
  data() {
    return {
      rssFeedIsUpdating: false,
      rssFeedFormVisible: false,
      rssFeedForm: {
        rssFeedName: "",
        rssFeedUrl: "",
      },
      rssFeedFormRules: {
        rssFeedName: [
          { required: true, message: "请输入订阅名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在必须在1到50个字符",
            trigger: "blur",
          },
        ],
        rssFeedUrl: [
          { required: true, message: "请输入订阅地址", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度在必须在1到500个字符",
            trigger: "blur",
          },
        ],
      },
      rssFeedFormLabelWidth: "95px",
      rssFeedIsSubmiting: false,
      rssFeedTableData: [],
      rssFeedPage: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 0,
      },
      isOpeningRssFeedForm: false,
    };
  },
  methods: {
    requestRssFeedPage() {
      let vueThis = this;
      axios
        .get(
          "rssFeeds?pageSize=" +
            this.rssFeedPage.pageSize +
            "&pageNum=" +
            this.rssFeedPage.pageNum
        )
        .then((response) => {
          vueThis.rssFeedTableData = response.data.pageData;
          vueThis.rssFeedPage.pageSize = response.data.pageSize;
          vueThis.rssFeedPage.pageNum = response.data.pageNum;
          vueThis.rssFeedPage.totalElements = response.data.totalElements;
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
    addRssFeed() {
      this.clearRssFeedForm();
      this.rssFeedFormVisible = true;
    },
    editRssFeed(row) {
      let vueThis = this;
      vueThis.isOpeningRssFeedForm = true;
      axios
        .get("rssFeeds/" + row.rssFeedId)
        .then((response) => {
          vueThis.isOpeningRssFeedForm = false;
          vueThis.rssFeedForm = response.data;
          vueThis.rssFeedFormVisible = true;
        })
        .catch((error) => {
          vueThis.isOpeningRssFeedForm = false;
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
    deleteRssFeed(row) {
      let vueThis = this;
      this.$msgbox({
        title: "确认",
        message: "确认删除RSS订阅" + row.rssFeedName + "吗？",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            axios
              .delete("/rssFeeds/" + row.rssFeedId)
              .then(() => {
                done();
                instance.confirmButtonLoading = false;
              })
              .catch((error) => {
                instance.confirmButtonLoading = false;
                let showMsg = "请求失败";
                if (error.response) {
                  showMsg = error.response.data.message;
                }
                vueThis.$message({
                  type: "error",
                  message: showMsg,
                });
              });
          } else {
            done();
          }
        },
      }).then(() => {
        vueThis.$notify({
          title: "提示",
          message: "删除成功",
        });
        vueThis.requestRssFeedPage();
      });
    },
    clearRssFeedAnime(row) {
      let vueThis = this;
      this.$msgbox({
        title: "确认",
        message: "确认清空RSS订阅" + row.rssFeedName + "下的动画记录吗？",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            axios
              .delete("/rssFeeds/" + row.rssFeedId + "/anime")
              .then(() => {
                done();
                instance.confirmButtonLoading = false;
              })
              .catch((error) => {
                instance.confirmButtonLoading = false;
                let showMsg = "请求失败";
                if (error.response) {
                  showMsg = error.response.data.message;
                }
                vueThis.$message({
                  type: "error",
                  message: showMsg,
                });
              });
          } else {
            done();
          }
        },
      }).then(() => {
        vueThis.$notify({
          title: "提示",
          message: "清空成功",
        });
        vueThis.requestRssFeedPage();
      });
    },
    handleRssFeedTableSizeChange(val) {
      this.rssFeedPage.pageSize = val;
      this.requestRssFeedPage();
    },
    handleRssFeedTableCurrentChange(val) {
      this.rssFeedPage.pageNum = val;
      this.requestRssFeedPage();
    },
    cancelRssFeedForm(formName) {
      this.clearRssFeedForm();
      this.$refs[formName].resetFields();
      this.rssFeedFormVisible = false;
    },
    clearRssFeedForm() {
      this.rssFeedForm = {
        rssFeedName: "",
        rssFeedUrl: "",
      };
    },
    submitRssFeedForm(formName) {
      let vueThis = this;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          vueThis.rssFeedIsSubmiting = true;
          if (
            vueThis.rssFeedForm.rssFeedId == null ||
            vueThis.rssFeedForm.rssFeedId == undefined
          ) {
            axios
              .put("rssFeeds", vueThis.rssFeedForm)
              .then(() => {
                vueThis.rssFeedIsSubmiting = false;
                vueThis.rssFeedFormVisible = false;
                vueThis.$notify({
                  title: "提示",
                  message: "保存成功",
                });
                vueThis.requestRssFeedPage();
              })
              .catch((error) => {
                vueThis.rssFeedIsSubmiting = false;
                vueThis.rssFeedFormVisible = false;
                let showMsg = "请求失败";
                if (error.response) {
                  showMsg = error.response.data.message;
                }
                vueThis.$message({
                  type: "error",
                  message: showMsg,
                });
              });
          } else {
            //console.log(vueThis.rssFeedForm);
            axios
              .patch("rssFeeds", vueThis.rssFeedForm)
              .then(() => {
                vueThis.rssFeedIsSubmiting = false;
                vueThis.rssFeedFormVisible = false;
                vueThis.$notify({
                  title: "提示",
                  message: "保存成功",
                });
                vueThis.requestRssFeedPage();
              })
              .catch((error) => {
                vueThis.rssFeedIsSubmiting = false;
                vueThis.rssFeedFormVisible = false;
                let showMsg = "请求失败";
                if (error.response) {
                  showMsg = error.response.data.message;
                }
                vueThis.$message({
                  type: "error",
                  message: showMsg,
                });
              });
          }
        }
      });
    },
  },
};
</script>