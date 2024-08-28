<template>
  <div>
    <!-- Header section (unchanged) -->
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

    <!-- Main content section -->
    <div class="container-fluid">
      <div class="main-container">
        <div class="content-wrapper">
          <div class="card-body">
            <div class="bxx">
              <img
                src="@/assets/img/user.jpg"
                alt="User Avatar"
                class="user-avatar"
              />
              <div class="user-info">
                <h3>欢迎 {{ username }}</h3>
                <el-row class="info-row">
                  <el-col :span="8">
                    <strong>作品数量：</strong> {{ myWorks.length }}
                  </el-col>
                  <el-col :span="8">
                    <strong>拥有版权数量：</strong>{{ appliedWorks.length }}
                  </el-col>
                  <el-col :span="8">
                    <strong
                      >待审核数量：{{ pendingAppliedWorks.length }}</strong
                    >
                    <el-button
                      class="uploadBt"
                      type="primary"
                      size="small"
                      @click="openUploadDialog"
                    >
                      上传作品
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </div>

            <el-tabs v-model="activeTab" class="custom-tabs">
              <el-tab-pane label="我的作品" name="yun1">
                <!-- <div class="search-bar">
                  <el-input
                    v-model="searchTitle"
                    placeholder="输入作品标题进行搜索"
                    style="width: 250px; margin-right: 10px;"
                  />
                  <el-button
                    type="primary"
                    @click="searchData"
                  >
                    搜索
                  </el-button>
                </div> -->
                <el-table :data="paginatedMyWorks" stripe class="custom-table">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    :index="
                      (index) =>
                        index + 1 + (currentPageNotAppliedWorks - 1) * pageSize
                    "
                  >
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="作品编号"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="title" label="作品"></el-table-column>
                  <el-table-column
                    prop="description"
                    label="作品描述"
                  ></el-table-column>
                  <el-table-column label="操作">
                    <template v-slot="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="viewDetails(scope.row)"
                      >
                        查看信息
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  class="pagination-container"
                  @current-change="handlePageChange('myWorks', $event)"
                  :current-page="currentPageMyWorks"
                  :page-size="pageSize"
                  :total="totalMyWorks"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>

              <el-tab-pane label="已申请版权作品" name="yun2">
                <el-table
                  :data="paginatedApprovedWorks"
                  stripe
                  class="custom-table"
                >
                  <!-- Serial Number Column -->
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    :index="
                      (index) =>
                        index + 1 + (currentPageApprovedWorks - 1) * pageSize
                    "
                  >
                  </el-table-column>

                  <!-- Existing Columns -->
                  <el-table-column
                    prop="id"
                    label="作品编号"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="title" label="作品"></el-table-column>
                  <el-table-column
                    prop="description"
                    label="作品描述"
                  ></el-table-column>

                  <!-- Operations Column -->
                  <el-table-column label="操作">
                    <template v-slot="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="viewDetails2(scope.row.id)"
                      >
                        链上信息
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- Pagination -->
                <el-pagination
                  class="pagination-container"
                  @current-change="handlePageChange('approvedWorks', $event)"
                  :current-page="currentPageApprovedWorks"
                  :page-size="pageSize"
                  :total="totalApprovedWorks"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>

              <el-tab-pane label="未申请版权作品" name="yun3">
                <el-table
                  :data="paginatedNotAppliedWorks"
                  stripe
                  class="custom-table"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    :index="
                      (index) =>
                        index + 1 + (currentPageNotAppliedWorks - 1) * pageSize
                    "
                  >
                  </el-table-column>

                  <!-- Existing Columns -->
                  <el-table-column
                    prop="id"
                    label="作品编号"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="title" label="作品"></el-table-column>
                  <el-table-column
                    prop="description"
                    label="作品描述"
                  ></el-table-column>

                  <!-- Operations Column -->
                  <el-table-column label="操作">
                    <template v-slot="scope">
                      <el-button
                        :type="
                          scope.row.status === 'pending' ? 'danger' : 'success'
                        "
                        size="small"
                        @click="
                          scope.row.status === 'pending'
                            ? cancelCopyrightApplication(scope.row)
                            : submitCopyrightApplication(scope.row)
                        "
                      >
                        {{
                          scope.row.status === "pending"
                            ? "取消申请"
                            : "申请版权"
                        }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- Pagination -->
                <el-pagination
                  class="pagination-container"
                  @current-change="handlePageChange('notAppliedWorks', $event)"
                  :current-page="currentPageNotAppliedWorks"
                  :page-size="pageSize"
                  :total="totalNotAppliedWorks"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="uploadDialogVisible"
      title="欢迎上传作品"
      width="30%"
    >
      <el-form :model="newWork">
        <el-form-item label="作品标题">
          <el-input
            v-model="newWork.title"
            placeholder="请输入作品标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="作品描述">
          <el-input
            v-model="newWork.description"
            type="textarea"
            placeholder="请输入作品描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadWork">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
  :visible.sync="dialogVisible"
  title="作品详情"
  width="60%"
  custom-class="custom-dialog"
>
  <el-table :data="[selectedWork]" border style="width: 100%">
    <el-table-column label="属性" width="150">
      <template>
        <div>作品编号</div>
        <div>作品</div>
        <div>作者</div>
        <div>作品描述</div>
        <div>是否申请版权</div>
        <div>状态</div>
        <div>上传时间</div>
        <div>最后修改时间</div>
      </template>
    </el-table-column>
    <el-table-column label="详情">
      <template>
        <div>{{ selectedWork.id }}</div>
        <div>{{ selectedWork.title }}</div>
        <div>{{ username }}</div>
        <div>{{ selectedWork.description }}</div>
        <div>{{ selectedWork.copyrightApplied }}</div>
        <div>{{ getStatusLabel(selectedWork.status) }}</div>
        <div>{{ selectedWork.createdAt }}</div>
        <div>{{ selectedWork.updatedAt }}</div>
      </template>
    </el-table-column>
  </el-table>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
  </span>
</el-dialog>

<el-dialog
  :visible.sync="dialogVisible2"
  title="版权详情"
  width="60%"
  custom-class="custom-dialog"
>
  <el-table :data="[selectedWork2]" border style="width: 100%">
    <el-table-column label="属性" width="150">
      <template>
        <div>链上编号</div>
        <div>作品</div>
        <div>作者</div>
        <div>作品描述</div>
        <div>是否申请版权</div>
        <div>状态</div>
        <div>版权编号</div>
        <div>申请时间</div>
      </template>
    </el-table-column>
    <el-table-column label="详情">
      <template>
        <div>{{ selectedWork2.chainId }}</div>
        <div>{{ selectedWork2.title }}</div>
        <div>{{ selectedWork2.creatorUsername }}</div>
        <div>{{ selectedWork2.description }}</div>
        <div>{{ selectedWork2.applied }}</div>
        <div>{{ selectedWork2.status === 1 ? '同意' : '拒绝' }}</div>
        <div>{{ selectedWork2.copyrightNumber }}</div>
        <div>{{ selectedWork2.createdAt }}</div>
      </template>
    </el-table-column>
  </el-table>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false" type="primary">关闭</el-button>
  </span>
</el-dialog>



  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      username: "",
      myWorks: [],
      appliedWorks: [],
      pendingAppliedWorks: [],
      notAppliedWorks: [],
      // searchTitle: "", // 搜索作品
      activeTab: "yun1", // 默认选中的tab
      dialogVisible: false, // 控制弹框的显示
      dialogVisible2: false, // 控制弹框的显示
      selectedWork: [], // 存储选中的作品详情
      selectedWork2: [], // 存储选中的作品详情
      pageSize: 10, // 每页条数
      currentPageMyWorks: 1, // 当前页码（我的作品）
      currentPageApprovedWorks: 1, // 当前页码（已申请版权作品）
      currentPageNotAppliedWorks: 1, // 当前页码（未申请版权作品）
      totalMyWorks: 0, // 总条数（我的作品）
      totalApprovedWorks: 0, // 总条数（已申请版权作品）
      totalNotAppliedWorks: 0, // 总条数（未申请版权作品）
      uploadDialogVisible: false, // 控制上传作品弹框的显示
      newWork: {
        title: "",
        description: "",
      },
    };
  },
  computed: {
    approvedWorks() {
      return this.myWorks.filter((work) => work.status === "approved");
    },
    paginatedMyWorks() {
      return this.myWorks.slice(
        (this.currentPageMyWorks - 1) * this.pageSize,
        this.currentPageMyWorks * this.pageSize
      );
    },
    paginatedApprovedWorks() {
      return this.approvedWorks.slice(
        (this.currentPageApprovedWorks - 1) * this.pageSize,
        this.currentPageApprovedWorks * this.pageSize,
      );
    },
    paginatedNotAppliedWorks() {
      return this.notAppliedWorks.slice(
        (this.currentPageNotAppliedWorks - 1) * this.pageSize,
        this.currentPageNotAppliedWorks * this.pageSize,
      );
    },
  },
  methods: {
    // 搜索作品
    // searchData() {
    //   request.get(`/works/creator/searchTitle?title=${this.searchTitle}`, {
    //   }).then(r => {
    //     this.tableData = r.data.data;
    //   }).catch(error => {
    //     console.error('Error fetching data:', error);
    //   });
    // },
    uploadWork() {
      const payload = {
        id: localStorage.getItem("id"),
        title: this.newWork.title,
        description: this.newWork.description,
      };

      request
        .post("/works/creator/upload", payload)
        .then((r) => {
          if (r.data.code === 200) {
            this.$message.success(r.data.data);

            // 关闭弹框并清除数据
            this.uploadDialogVisible = false;
            this.newWork.title = "";
            this.newWork.description = "";

             // 确认后刷新数据或页面
        this.$confirm('作品上传成功，点击确定以刷新数据。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          // 调用刷新数据的方法
          this.getMyWorks(); // 如果有单独的数据更新方法，可以调用这个方法

          // 或者刷新整个页面
          // location.reload();
        }).catch(() => {
          // 用户取消了刷新操作
        });

            
          } else {
            this.$message.error("上传失败");
          }
        })
        .catch((error) => {
          this.$message.error("请求失败");
        });
    },
    // 打开上传作品的弹框
    openUploadDialog() {
      this.uploadDialogVisible = true;
      this.newWork.title = "";
      this.newWork.description = "";
    },
    outlogin() {
      if (window.confirm("您确定要退出登录吗？")) {
        localStorage.clear();
        this.$router.push("/").catch((err) => {
          console.error("Redirect failed:", err);
        });
      }
    },
    getStatusLabel(status) {
      const labels = {
        pending: "待审核",
        approved: "同意",
        rejected: "拒绝",
      };
      return labels[status] || "未知";
    },

    getMyWorks() {
      const creatorId = localStorage.getItem("id");
      if (!creatorId) {
        console.error("Creator ID not found in localStorage");
        return;
      }
      request.get(`/works/creator/show?creatorId=${creatorId}`).then((r) => {
        if (r.data.code === 200) {
          this.myWorks = r.data.data;
          this.totalMyWorks = this.myWorks.length; // Set total count
          this.filterWorks();
        }
      });
    },
    filterWorks() {
      this.appliedWorks = this.myWorks.filter(
        (work) => work.status === "approved"
      );
      this.notAppliedWorks = this.myWorks.filter(
        (work) => work.status !== "approved"
      );
      this.pendingAppliedWorks = this.myWorks.filter(
        (work) => work.status == "pending"
      );
      this.totalApprovedWorks = this.appliedWorks.length;
      this.totalNotAppliedWorks = this.notAppliedWorks.length;
    },
    submitCopyrightApplication(work) {
      work.status = "pending"; // 更新状态为待审核

      // 申请操作
      request
        .get(`/works/creator/appliedTrue?workId=${work.id}`)
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success("申请成功,请等待审核机构审核");
            this.getMyWorks(); // 更新数据
          } else {
            this.$message.error("申请失败");
            work.status = null; // 如果失败，回退状态
          }
        })
        .catch((error) => {
          this.$message.error("请求出错");
          work.status = null; // 如果请求出错，回退状态
        });
    },
    cancelCopyrightApplication(work) {
      work.status = null; // 更新状态为未申请

      // 取消操作
      request
        .get(`/works/creator/applicationFalse?workId=${work.id}`)
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success("取消成功");
            this.getMyWorks(); // 更新数据
          } else {
            this.$message.error("取消失败");
            work.status = "pending"; // 如果失败，回退状态
          }
        })
        .catch((error) => {
          this.$message.error("请求出错");
          work.status = "pending"; // 如果请求出错，回退状态
        });
    },
    viewDetails(work) {
      this.selectedWork = work;
      this.dialogVisible = true;
    },
    viewDetails2(workId) {
      this.dialogVisible2 = true;
      request.get(`/works/creator/info?workId=${workId}`).then((r) => {
        if (r.data.code === 200) {
          this.selectedWork2 = r.data.data;
        } else {
          this.$message.error(r.data.data);
        }
      });
    },
    handlePageChange(type, page) {
      if (type === "myWorks") {
        this.currentPageMyWorks = page;
      } else if (type === "approvedWorks") {
        this.currentPageApprovedWorks = page;
      } else if (type === "notAppliedWorks") {
        this.currentPageNotAppliedWorks = page;
      }
    },
  },
  created() {
    this.username = localStorage.getItem("username");
    this.getMyWorks();
  },
};
</script>


<style scoped>
@import "@/assets/css/creatorStyle.css";
</style>
