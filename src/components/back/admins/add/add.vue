<template>
  <div class="add-wrapper">
    <h2 class="title">{{title}}</h2>
    <el-form ref="adminForm" :model="adminForm" status-icon label-width="100px" class="admin-table" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="adminForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="adminForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="adminForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input class="email" v-model="adminForm.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="add-btn" type="primary" @click="addAdmin">Add Admin</el-button>
        <el-button class="reset-btn" @click="reset">Reset</el-button>
        <el-button class="cancel-btn" @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters, mapMutations } from 'vuex'
  import statusCode from '@/common/js/status'

  const ERR_NOK = statusCode.ERR_NOK
  const ERR_OK = statusCode.ERR_OK
  const USER_DUP = statusCode.USERNAME_DUP

  export default {
    data() {
      return {
        title: 'Add Admin',
        user: {},
        adminForm: {
          username: '',
          password: '',
          phone: '',
          email: ''
        },
        rules: {
          username: [{
            required: true,
            message: 'Please enter username',
            trigger: 'blur'
          }, {
            min: 5,
            message: 'The length of username should be at least 5 characters'
          }],
          password: [{
            required: true,
            message: 'Please enter password',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: 'Please enter phone',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: 'Please enter email',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      addAdmin() {
        this.$refs.adminForm.validate((valid) => {
          if (valid) {
            let admin = {
              username: this.adminForm.username,
              password: this.adminForm.password,
              phone: this.adminForm.phone,
              email: this.adminForm.email,
              token: this.token
            }

            Service.addAdmin(admin)
              .then((response) => {
                let res = response.data
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.$router.push('/admin/admins')
                  }, 1500)
                } else if (res.code === USER_DUP) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'warning',
                    center: true,
                    duration: 1000
                  })
                } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
                  this.$message({
                    showClose: true,
                    message: 'The token has expired, please login again',
                    type: 'warning',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.logout()
                    this.setAccount({})
                    this.$router.push('/admin/login')
                  }, 1500)
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'warning',
                    center: true,
                    duration: 1000
                  })
                }
              })
          } else {
            return false
          }
        })
      },
      reset() {
        this.$refs.adminForm.resetFields()
      },
      cancel() {
        this.$router.push('/admin/admins')
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .admin-table
      position: relative
      width: 40%
      top: 50px
      margin: 0 auto
</style>
