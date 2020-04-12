<template>
  <div class="vton-list">
    <v-header :title="title"></v-header>
    <el-card class="box-card" shadow="never">
      <el-row class="vton-item" v-for="(vton, index) in vtonList" :key="index">
        <el-col :span="8" style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.pose)"></el-image>
        </el-col>
        <el-col :span="8" style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.cloth)"></el-image>
        </el-col>
        <el-col :span="8" style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.result)"></el-image>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'
  import statusCode from '@/common/js/status'
  import VHeader from '@/components/front/v-header/v-header'

  export default {
    data() {
      return {
        title: 'Virtual Try-On History',
        vtonList: []
      }
    },
    created () {
      this._initializeUser()
    },
    computed: {
      ...mapGetters([
        'account'
      ])
    },
    methods: {
      _initializeUser() {
        let query = this.account.username
        let type = statusCode.USERNAME
        Service.getOneUser(type, query)
          .then((response) => {
            let res = response.data
            if (res.code === statusCode.ERR_OK) {
              this.vtonList = res.data[0].vton
            }
          })
      },
      convBase64ToImage(base64) {
        return `data:image/png;base64,${base64}`
      }
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
