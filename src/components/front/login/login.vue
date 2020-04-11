<template>
  <div class="login">
    <v-header :title="title"></v-header>
    <el-form ref="loginForm" v-if="!isLogin" :model="loginForm" status-icon :rules="rules" label-width="80px" class="login-form">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="onSubmit('loginForm')">Login</el-button>
        <el-button class="cancel" @click="cancel">Cancel</el-button>
        <br>
        <router-link to="/register" class="register">No account? Register now</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations, mapGetters } from 'vuex'
  import statusCode from '@/common/js/status'
  import VHeader from '@/components/front/v-header/v-header'

  const ERR_OK = statusCode.ERR_OK
  const AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
  const DEFAULT = 'default'

  export default {
    name: 'Login',
    data () {
      return {
        title: 'Login',
        isLogin: false,
        loginForm: {
          username: '',
          password: '',
          checked: false
        },
        rules: {
          username: [
            { required: true, message: 'Please Enter Username' }
          ],
          password: [
            { required: true, message: 'Please Enter Password' }
          ]
        }
      }
    },
    mounted () {
      this.isLogin = this.token
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let user = {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
            Service.frontLogin(user)
              .then((response) => {
                let res = response.data
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: 'Successfully Login',
                    type: 'success',
                    center: true,
                    duration: 1000
                  })

                  let account = {
                    username: user.username,
                    name: user.username,
                    avatar: AVATAR,
                    type: DEFAULT,
                    end: statusCode.FRONTEND
                  }
                  this.login(res.token)
                  this.setAccount(account)
                  setTimeout(() => {
                    this.$router.push('/home')
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
      cancel() {
        this.$router.push('/')
      },
      ...mapMutations({
        login: 'LOGIN',
        setAccount: 'SET_ACCOUNT'
      })
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .login-form
    position: relative
    top: 60px
    width: 80%
    margin: 20px auto auto
    padding: 20px
    border: 1px solid #ddd
</style>
