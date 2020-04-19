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
        gitlabConfig: {
          app_id: 'd14ac7139b5f2b4feb5eaff6b086e85365007d909e8ed798177ac91a778230a5',
          secret_id: '45cd472c96ff35cf7715cb859bbb49884fc0e1293a897c5201dc06edb24fcdde',
          redirectURL: 'https://outfitapp-sam.firebaseapp.com/admin/gitlabredirect',
          scope: 'read_user+profile',
          state: 'Sam',
          getCodeURL: 'https://gitlab.com/oauth/authorize',
          getAccessTokenURL: 'https://outfitapp-sam.herokuapp.com/loginGitlab',
          getUserURL: '/gitlab/api/v4/user',
          code: null,
          accessToken: null
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.gitlabConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.get(`${this.gitlabConfig.getAccessTokenURL}?client_id=${this.gitlabConfig.app_id}&client_secret=${this.gitlabConfig.secret_id}&code=${this.gitlabConfig.code}&grant_type=authorization_code&redirect_uri=${this.gitlabConfig.redirectURL}`, {}, {
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
