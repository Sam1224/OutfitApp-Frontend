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
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.githubConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.get(`${this.githubConfig.getAccessTokenURL}?client_id=${this.githubConfig.client_id}&client_secret=${this.githubConfig.client_secret}&code=${this.githubConfig.code}`, {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }).then((response) => {
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
