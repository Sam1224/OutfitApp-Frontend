<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations } from 'vuex'
  import axios from 'axios'
  import statusCode from '@/common/js/status'

  const ERR_OK = statusCode.ERR_OK

  export default {
    data() {
      return {
        weiboConfig: {
          client_id: '2882795678',
          client_secret: '281d4c035a31ec837576c177afb40041',
          redirect_uri: 'https://outfitapp-sam.firebaseapp.com/admin/weiboredirect',
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
    mounted() {
      let code = this.$route.query.code
      this.weiboConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.get(`${this.weiboConfig.getAccessTokenURL}?grant_type=authorization_code&code=${this.weiboConfig.code}&client_id=${this.weiboConfig.client_id}&redirect_uri=${this.weiboConfig.redirect_uri}&client_secret=${this.weiboConfig.client_secret}`, {}, {
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
              res.account.end = statusCode.BACKEND
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
