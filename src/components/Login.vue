<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
      <img src="@/assets/avatar.jpg" alt srcset>
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          @keyup.enter.native="login"
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名为空', trigger: 'blur' },
          {
            min: 3,
            max: 9,
            message: '用户名长度在 3 到 9个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 9,
            message: '密码长度在 3 到 9个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        let {
          meta: { status, msg },
          data: { token }
        } = res
        if (status === 200) {
          // this.$message.success('登录成功')
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          })
          localStorage.setItem('token111', token)
          this.$router.push('/home')
        } else {
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang='less'>
.login {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .el-button:nth-child(2) {
      margin-left: 80px;
    }
  }
}
</style>
