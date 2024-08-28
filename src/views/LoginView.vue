<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <!-- 登录表单 -->
        <el-form
          class="sign-in-form"
          v-model="loginForm"
          @keyup.enter.native="login"
        >
          <h2 class="title">登录</h2>
          <div class="input-field">
            <i class="el-icon-star-on"></i>
            <input type="text" placeholder="邮箱" v-model="loginForm.email" />
          </div>
          <div class="input-field">
            <i class="el-icon-view"></i>
            <input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            />
          </div>
          <div>
            <i class="fas fa-briefcase"></i>
            <el-radio-group v-model="loginForm.role" class="role-radio-group">
              <el-radio label="creator">内容创作者</el-radio>
              <el-radio label="auditor">审核机构</el-radio>
            </el-radio-group>
          </div>
          <el-button
            type="submit"
            class="btn solid"
            icon="el-icon-s-promotion"
            @click.prevent="login"
          >
            登录
          </el-button>
        </el-form>

        <!-- 注册表单 -->
        <el-form
          class="sign-up-form"
          v-model="registerForm"
          @keyup.enter.native="register"
        >
          <h2 class="title">注册</h2>
          <div class="input-field">
            <i class="el-icon-s-custom"></i>
            <input
              type="text"
              placeholder="用户名"
              v-model="registerForm.username"
            />
          </div>
          <div class="input-field">
            <i class="el-icon-star-on"></i>
            <input
              type="email"
              placeholder="Email"
              v-model="registerForm.email"
            />
          </div>
          <div class="input-field">
            <i class="el-icon-view"></i>
            <input
              type="password"
              placeholder="密码"
              v-model="registerForm.password"
            />
          </div>
          <el-button
            type="submit"
            class="btn"
            icon="el-icon-s-promotion"
            @click.prevent="register"
          >
            注册
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>欢迎回来</h3>
          <p>
            继续创作或审核，您的灵感和才华值得被认可与保护。输入您的账号信息，继续探索版权的世界。
          </p>
          <el-button
            class="btn transparent"
            id="sign-up-btn"
            @click="toggleForms"
            icon="el-icon-s-promotion"
          >
            注册
          </el-button>
        </div>
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>加入我们</h3>
          <p>
            开始保护您的创意作品并探索无限的可能性。注册一个新账号，与全球创作者和审核机构共同打造数字版权生态。
          </p>
          <el-button
            class="btn transparent"
            id="sign-in-btn"
            @click="toggleForms"
            icon="el-icon-s-promotion"
          >
            登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
        role: "creator",
      },
      registerForm: {
        username: "",
        password: "",
        email: "",
      },
    };
  },
  methods: {
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },

    isValidPassword(password) {
      return password.length >= 6 && password.length <= 187;
    },

    toggleForms() {
      const container = document.querySelector(".container");
      container.classList.toggle("sign-up-mode");
    },

    login() {
      if (!this.loginForm.email || !this.loginForm.password) {
        this.$message.error("邮箱和密码不能为空");
        return;
      }

      if (!this.isValidEmail(this.loginForm.email)) {
        this.$message.error("邮箱格式不正确");
        return;
      }

      if (!this.isValidPassword(this.loginForm.password)) {
        this.$message.error("密码长度应在6到187位之间");
        return;
      }

      request
        .post("/users/login", this.loginForm)
        .then((response) => {
          if (response.data.code === 200) {
            localStorage.setItem("id", response.data.data.id);
            localStorage.setItem("username", response.data.data.username);
            const userType = response.data.data.role;
            switch (userType) {
              case "creator":
                this.$message.success("登录成功");
                this.$router.push("/creatorHomeView");
                break;
              case "auditor":
                this.$message.success("登录成功");
                this.$router.push("/auditorhomeView");
                break;
            }
          } else if (response.data.code === -1) {
            this.$message.error(response.data.msg);
          } else if (response.data.code === -2) {
            this.$message.error("密码错误");
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    register() {
      if (
        !this.registerForm.username ||
        !this.registerForm.password ||
        !this.registerForm.email
      ) {
        this.$message.error("用户名、密码和邮箱不能为空");
        return;
      }

      if (!this.isValidEmail(this.registerForm.email)) {
        this.$message.error("邮箱格式不正确");
        return;
      }

      if (!this.isValidPassword(this.registerForm.password)) {
        this.$message.error("密码长度应在6到187位之间");
        return;
      }

      request
        .post("/users/register", this.registerForm)
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success("注册成功");
            this.toggleForms();
            this.registerForm = {
              username: "",
              password: "",
              email: "",
            };
          } else if (response.data.code === -1) {
            this.$message.error(response.data.msg);
          } else if (response.data.code === -2) {
            this.$message.error(response.data.msg);
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


<style scoped>
@import "@/assets/css/style.css";
</style>
