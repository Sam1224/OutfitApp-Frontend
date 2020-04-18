<template>
  <div class="edit-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="adminForm" :model="adminForm" status-icon label-width="100px" class="admin-table" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="adminForm.username" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="adminForm.phone" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input class="email" v-model="adminForm.email" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="adminForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="edit-btn" type="primary" @click="editAdmin">Edit Admin</el-button>
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

  export default {
    props: {
      id: String
    },
    data() {
      return {
        title: 'Edit Admin',
        loading: true,
        admin: {},
        isPasswordModified: false,
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
    created() {
      this._initializeAdmin(this.$router.params)
    },
    methods: {
      _initializeAdmin(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/admins')
        }
        Service.getOneAdminById(id, this.token)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.adminForm = res.data[0]
              this.admin = res.data[0]
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      editAdmin() {
        let admin = {
          username: this.adminForm.username,
          password: this.adminForm.password,
          phone: this.adminForm.phone,
          email: this.adminForm.email,
          token: this.token
        }

        Service.updateAdmin(this.$router.params, admin)
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
                this.logout()
                this.setAccount({})
                this.$router.push('/admin/admins')
              }, 1500)
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
  .edit-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .admin-table
      position: relative
      width: 60%
      top: 50px
      margin: 0 auto
</style>
