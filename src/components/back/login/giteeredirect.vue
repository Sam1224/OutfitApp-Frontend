<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0

  export default {
    data() {
      return {
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
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.giteeConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.get(`${this.giteeConfig.getAccessTokenURL}?grant_type=authorization_code&code=${this.giteeConfig.code}&client_id=${this.giteeConfig.client_id}&redirect_uri=${this.giteeConfig.redirect_uri}&client_secret=${this.giteeConfig.client_secret}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
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
              this.setAccount(res.account)
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
      },
      ...mapMutations({
        login: 'LOGIN',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
