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
        }
      }
    },
    mounted() {
      let accessToken = this.$route.hash
      accessToken = accessToken.split('&')[0].split('=')[1]
      this.bitbucketConfig.accessToken = accessToken
      if (accessToken) {
        this.getBitbucketInfo()
      }
    },
    methods: {
      getBitbucketInfo() {
        axios.get(`${this.bitbucketConfig.getAccessTokenURL}?access_token=${this.bitbucketConfig.accessToken}`, {}, {
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
