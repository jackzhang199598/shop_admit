<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showDialog">添加用户</el-button>
    <template>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <template slot-scope="scope">
            <el-switch
              @change="changeState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click="showedit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
            <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form1" :model="addform" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="form2" :model="editform" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editform.username}}</el-tag>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" placeholder="请输手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false,
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名为空', trigger: 'blur' },
          {
            min: 3,
            max: 9,
            message: '用户名长度在 3 到 9个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 9,
            message: '密码长度在 3 到 9个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { type: 'email', message: '请输入一个合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入一个合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    showedit(row) {
      this.editDialogVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    updateUser() {
      this.$refs.form2.validate(async valid => {
        if (!valid) return false
        let res = this.axios({
          method: 'put',
          url: `users/${this.editform.id}`,
          data: this.editform
        })
        let {
          meta: { status, msg }
        } = res
        if (status === 200) {
          this.getUserList()
          this.$refs.form2.resetFields()
          this.editDialogVisible = false
          this.$message.success('恭喜你，修改成功了')
        } else {
          this.$message.error(msg)
        }
      })
    },
    addUser() {
      this.$refs.form1.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addform
        })
        let {
          meta: { status, msg }
        } = res
        if (status === 201) {
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          this.$refs.form1.resetFields()
          this.addDialogVisible = false
          this.$message.success('添加成功了')
        } else {
          this.$message.error(msg)
        }
      })
    },
    async showDialog() {
      this.addDialogVisible = true
    },
    async changeState({ id, mg_state: mgState }) {
      // console.log(user)
      let res = await this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
        // headers: {
        //   Authorization: localStorage.getItem('token111')
        // }
      })
      console.log(res)
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改成功')
      }
    },
    async delUser(id) {
      try {
        await this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
          // headers: {
          //   Authorization: localStorage.getItem('token111')
          // }
        })

        let {
          meta: { status }
        } = res
        if (status === 200) {
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('恭喜你，删除成功了')
        }
      } catch (e) {
        this.$message.info('取消删除了')
      }
    },
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      // console.log(total)
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
}
.input-with-select {
  width: 400px;
  margin-bottom: 8px;
}
</style>
