<template>
  <div class="login-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <el-form ref="loginForm" :model="loginForm" status-icon :rules="rules" label-width="80px" class="login-table">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="loginForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="onSubmit('loginForm')">Login</el-button>
      </el-form-item>
      <el-form-item label="OtherLogin" prop="otherlogin">
        <div class="icon-wrapper">
          <span class="icon" @click="loginGoogle">
            <img :src="googleIcon" class="img" alt="Google">
          </span>
          <span class="icon" @click="loginGithub">
            <img :src="githubIcon" class="img" alt="Github">
          </span>
          <span class="icon" @click="loginGitlab">
            <img :src="gitlabIcon" class="img" alt="Gitlab">
          </span>
          <span class="icon" @click="loginGitee">
            <img :src="giteeIcon" class="img" alt="Gitee">
          </span>
          <span class="icon" @click="loginBitbucket">
            <img :src="bitbucketIcon" class="img" alt="Bitbucket">
          </span>
          <span class="icon" @click="loginWeibo">
            <img :src="weiboIcon" class="img" alt="Weibo">
          </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations, mapGetters } from 'vuex'

  const ERR_OK = 0
  const AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
  const DEFAULT = 'default'
  const GOOGLE = 'google'
  // eslint-disable-next-line no-unused-vars
  const GITHUB = 'github'
  // eslint-disable-next-line no-unused-vars
  const GITLAB = 'gitlab'
  // eslint-disable-next-line no-unused-vars
  const GITEE = 'gitee'
  // eslint-disable-next-line no-unused-vars
  const BITBUCKET = 'bitbucket'
  // eslint-disable-next-line no-unused-vars
  const WEIBO = 'weibo'

  export default {
    name: 'Login',
    data () {
      return {
        messageTitle: 'Login',
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
        },
        googleIcon: require('../../../assets/google-icon.png'),
        githubIcon: require('../../../assets/github-icon.png'),
        githubConfig: {
          client_id: 'd3b96a64fc89f3db3ef8',
          client_secret: '16acb70fd7064984beb2dc7575b0e4f54e507014',
          scope: 'user:email',
          state: 'Sam',
          getCodeURL: 'https://github.com/login/oauth/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginGithub',
          getUserURl: 'https://api.github.com/user',
          redirectURL: 'http://localhost:8080/admin/githubredirect',
          code: null,
          accessToken: null,
          signState: false
        },
        gitlabIcon: require('../../../assets/gitlab-icon.png'),
        gitlabConfig: {
          app_id: 'd14ac7139b5f2b4feb5eaff6b086e85365007d909e8ed798177ac91a778230a5',
          secret_id: '45cd472c96ff35cf7715cb859bbb49884fc0e1293a897c5201dc06edb24fcdde',
          redirectURL: 'http://localhost:8080/admin/gitlabredirect',
          scope: 'read_user+profile',
          state: 'Sam',
          getCodeURL: 'https://gitlab.com/oauth/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginGitlab',
          getUserURL: '/gitlab/api/v4/user',
          code: null,
          accessToken: null
        },
        giteeIcon: require('../../../assets/gitee-icon.png'),
        giteeConfig: {
          client_id: 'ae3939548aef89816a4eea7c585725f3bcc64ba765ddd2f5140cf9d55837de41',
          client_secret: '632125aac2341fe5029290b5e0079914dc1e961592f8602777730db242a58205',
          redirect_uri: 'http://localhost:8080/admin/giteeredirect',
          scope: 'user_info',
          state: 'Sam',
          getCodeURL: 'https://gitee.com/oauth/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginGitee',
          getUserURL: '/gitee/api/v5/user',
          code: null,
          accessToken: null
        },
        bitbucketIcon: require('../../../assets/bitbucket-icon.png'),
        bitbucketConfig: {
          client_id: 'ktjC8BVNyPtJjnZzQ3',
          client_secret: 'xtJ9FRBG6hAUWUfuHyDn8wRyPpbdzNh8',
          redirect_uri: 'http://localhost:8080/admin/bitbucketredirect',
          scope: 'account',
          state: 'Sam',
          getCodeURL: 'https://bitbucket.org/site/oauth2/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginBitbucket',
          getUserURL: '/bitbucket/api/v5/user',
          code: null,
          accessToken: null
        },
        weiboIcon: require('../../../assets/weibo-icon.png'),
        weiboConfig: {
          client_id: '2882795678',
          client_secret: '281d4c035a31ec837576c177afb40041',
          redirect_uri: 'http://127.0.0.1:8080/admin/weiboredirect',
          scope: 'all',
          state: 'Sam',
          getCodeURL: 'https://api.weibo.com/oauth2/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginWeibo',
          getUserURL: '/weibo/2/users/show.json',
          code: null,
          accessToken: null
        }
      }
    },
    created () {
      this._initializeData()
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeData() {
        if (this.token) {
          this.$router.push('/admin/home')
        }
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let admin = {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
            Service.backLogin(admin)
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
                    username: admin.username,
                    name: admin.username,
                    avatar: AVATAR,
                    type: DEFAULT
                  }
                  this.login(res.token)
                  this.setAccount(account)
                  setTimeout(() => {
                    this.$router.push('/admin/home')
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
      loginGoogle() {
        this.$gAuth.signIn()
          .then((googleUser) => {
            let profile = googleUser.getBasicProfile()
            let account = {
              username: profile.U3,
              name: profile.ig,
              avatar: profile.Paa,
              type: GOOGLE
            }
            Service.getAdminToken(account.username)
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
                  this.login(res.token)
                  this.setAccount(account)
                  setTimeout(() => {
                    this.$router.push('/admin/home')
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
          })
      },
      loginGithub() {
        window.location.href = `${this.githubConfig.getCodeURL}?response_type=code&client_id=${this.githubConfig.client_id}&redirect_url=${this.githubConfig.redirectURL}&state=${this.githubConfig.state}&scope=${this.githubConfig.scope}`
      },
      loginGitlab() {
        window.location.href = `${this.gitlabConfig.getCodeURL}?response_type=code&client_id=${this.gitlabConfig.app_id}&redirect_uri=${this.gitlabConfig.redirectURL}&state=${this.gitlabConfig.state}&scope=${this.gitlabConfig.scope}`
      },
      loginGitee() {
        window.location.href = `${this.giteeConfig.getCodeURL}?client_id=${this.giteeConfig.client_id}&redirect_uri=${this.giteeConfig.redirect_uri}&response_type=code&scope=${this.giteeConfig.scope}`
      },
      loginBitbucket() {
        window.location.href = `${this.bitbucketConfig.getCodeURL}?client_id=${this.bitbucketConfig.client_id}&redirect_uri=${this.bitbucketConfig.redirect_uri}&response_type=token&scope=${this.bitbucketConfig.scope}`
      },
      loginWeibo() {
        window.location.href = `${this.weiboConfig.getCodeURL}?client_id=${this.weiboConfig.client_id}&redirect_uri=${this.weiboConfig.redirect_uri}&response_type=code`
      },
      ...mapMutations({
        login: 'LOGIN',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  span:hover
    cursor: pointer
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 30px
  .login-table
    width: 40%
    margin: 0 auto
    .icon-wrapper
      position: relative
      display: flex
      margin-top: 8px
      margin-left: 20px
      .icon
        display: 0 0 25px
        margin-right: 15px
        .img
          width: 25px
          height: 25px
          border-radius: 50%
</style>
