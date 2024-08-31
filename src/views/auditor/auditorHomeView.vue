<template>
  <div>
    <!-- Header -->
    <el-header class="header">
      <div class="container-fluid">
        <div class="header-content">
          <p class="logo">Certificate of copyright on the chain</p>

          <el-dropdown class="header-actions">
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-button class="logout-button" @click="outlogin">
                <i class="el-icon-s-home logout-icon"></i> 登出
              </el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- Main Content -->
    <div class="main-container">
      <div class="content-wrapper">
        <!-- File Browser -->
        <el-card class="file-browser">
          <el-row :gutter="20">
            <el-col :span="16">
              <div>
                <h2>欢迎 {{ username }} </h2>
                <p>
                  负责人 <span>|</span>邮箱:
                  githup147@qq.com<span>|</span>审核机构
                </p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stats">
                <div>
                  <p>待审核</p>
                  <span>{{
                    worksData.filter((item) => item.status === "pending").length
                  }}</span>
                  / <i>{{ worksData.length }}</i>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- Tables -->
        <el-row :gutter="20">
          <el-col :span="14">
            <el-card>
              <div slot="header" class="clearfix">
                <span>待审核</span>
              </div>
              <el-table :data="paginatedUnconfirmedData">
                <el-table-column
                  prop="creatorName"
                  label="用户"
                ></el-table-column>
                <el-table-column prop="title" label="作品"></el-table-column>
                <el-table-column prop="status" label="审核状态">
                  <template slot-scope="scope">
                    <el-tag type="warning">{{
                      getStatusLabel(scope.row.status)
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="method" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="success"
                      @click="repetition(scope.row.id)"
                      :loading="isLoading"
                      :disabled="isLoading"
                    >
                      查重
                    </el-button>
                    <el-button
                      type="success"
                      @click="approve(scope.row.id, true)"
                      :loading="isLoading"
                      :disabled="isLoading"
                    >
                      同意
                    </el-button>
                    <el-button
                      type="danger"
                      @click="approve(scope.row.id, false)"
                      :loading="isLoading"
                      :disabled="isLoading"
                    >
                      拒绝
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChangeUnconfirmed"
                @current-change="handleCurrentChangeUnconfirmed"
                :current-page="currentPageUnconfirmed"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSizeUnconfirmed"
                layout="total, sizes, prev, pager, next, jumper"
                :total="unconfirmedData.length"
              >
              </el-pagination>
            </el-card>
          </el-col>

          <el-col :span="10">
            <el-card>
              <div slot="header" class="clearfix">
                <span>已审核</span>
              </div>
              <el-table :data="paginatedConfirmedData">
                <el-table-column
                  prop="creatorName"
                  label="用户"
                ></el-table-column>
                <el-table-column prop="title" label="作品"></el-table-column>
                <el-table-column prop="status" label="审核状态">
                  <template slot-scope="scope">
                    <el-tag :type="getTagType(scope.row.status)">{{
                      getStatusLabel(scope.row.status)
                    }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChangeConfirmed"
                @current-change="handleCurrentChangeConfirmed"
                :current-page="currentPageConfirmed"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSizeConfirmed"
                layout="total, sizes, prev, pager, next, jumper"
                :total="confirmedData.length"
              >
              </el-pagination>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      username: "",
      worksData: [],
      isLoading: false,
      currentPageUnconfirmed: 1,
      pageSizeUnconfirmed: 5,
      currentPageConfirmed: 1,
      pageSizeConfirmed: 5,
    };
  },
  computed: {
    // 过滤器
    unconfirmedData() {
      return this.worksData.filter((item) => item.status === "pending");
    },
    confirmedData() {
      return this.worksData.filter(
        (item) => item.status === "approved" || item.status === "rejected"
      );
    },
    // 分页显示
    paginatedUnconfirmedData() {
      const start =
        (this.currentPageUnconfirmed - 1) * this.pageSizeUnconfirmed;
      const end = start + this.pageSizeUnconfirmed;
      return this.unconfirmedData.slice(start, end);
    },
    paginatedConfirmedData() {
      const start = (this.currentPageConfirmed - 1) * this.pageSizeConfirmed;
      const end = start + this.pageSizeConfirmed;
      return this.confirmedData.slice(start, end);
    },
  },
  methods: {
    // 登出
    outlogin() {
      if (window.confirm("您确定要退出登录吗？")) {
        localStorage.clear();
        this.$router.push("/").catch(err => {
        console.error("Redirect failed:", err);
      });
      }
    },
    // 获取已提交审核的作品
    getAllWorks() {
      request
        .get("/works/creator/all")
        .then((response) => {
          this.worksData = response.data.data;
        })
        .catch((error) => {
          console.error("获取数据时出错:", error);
        });
    },
    getStatusLabel(status) {
      const labels = {
        pending: "待审核",
        approved: "同意",
        rejected: "拒绝",
      };
      return labels[status] || "未知";
    },
    getTagType(status) {
      switch (status) {
        case "approved":
          return "success";
        case "rejected":
          return "danger";
        default:
          return "warning";
      }
    },
    // 审核作品
    approve(worksId, approval) {
      this.isLoading = true;
      request
        .get("/works/auditor/reviewCopyright", {
          params: {
            workId: worksId,
            approval: approval,
          },
        })
        .then((r) => {
          if (r.data.code === 200) {
            this.$message.success(r.data.data);
            this.getAllWorks();
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.error("审核时出错:", error);
          this.$message.error("审核失败");
          this.isLoading = false;
        });
    },


    // 计算作品查重
    repetition(id) {
      request
      .get("/api/check/plagiarism",{
        params: {
            id: id
          },
      }).then((re =>{
        if (re.data.code === 200) {
          this.$message.success(re.data.data);
        }else{
          this.$message.error(re.data.msg);
        }
      }))

    },
    // 计算分页
    handleSizeChangeUnconfirmed(val) {
      this.pageSizeUnconfirmed = val;
      this.currentPageUnconfirmed = 1;
    },
    handleCurrentChangeUnconfirmed(val) {
      this.currentPageUnconfirmed = val;
    },
    handleSizeChangeConfirmed(val) {
      this.pageSizeConfirmed = val;
      this.currentPageConfirmed = 1;
    },
    handleCurrentChangeConfirmed(val) {
      this.currentPageConfirmed = val;
    },
  },
  created() {
    this.getAllWorks();
    this.username = localStorage.getItem("username")
  },
};
</script>
<style scoped>
@import "@/assets/css/auditorStyle.css";
</style>
