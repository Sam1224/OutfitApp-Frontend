<template>
  <div class="vton-list">
    <v-header :title="title"></v-header>
    <el-card class="vton-item" shadow="always" v-for="(vton, index) in vtonList" :key="index">
      <el-row slot="header" class="clearfix">
        <el-col :span="8" style="text-align: center;">
          <span style="font-size: 18px;">{{index}}</span>
        </el-col>
        <el-col :span="4" style="text-align: center;">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="12" style="text-align: center; padding-left: 12px;">
          <el-button type="danger" style="padding: 6px 6px" icon="el-icon-delete" @click="deleteVton(vton._id)" circle></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.pose)" fit="fill"></el-image>
        </el-col>
        <el-col :span="12" style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.cloth)" fit="fill"></el-image>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
          <el-image :src="convBase64ToImage(vton.result)" fit="fill"></el-image>
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
        user: {},
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
              this.user = res.data[0]
              this.vtonList = res.data[0].vton
            }
          })
      },
      deleteVton(vtonid) {
        this.$confirm('This operation will delete the retrieval record, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let vton = {}
          vtonid._id = this.user._id
          vtonid.username = this.user.username
          vtonid.vtonid = vtonid

          Service.deleteVton(vton)
            .then((response) => {
              let res = response.data
              if (res.code === statusCode.ERR_OK) {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success',
                  center: true,
                  duration: 1000
                })
                setTimeout(() => {
                  this._initializeUsers()
                }, 1500)
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success',
                  center: true,
                  duration: 1000
                })
              }
            })
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
  .vton-item
    width: 100%
    .clearfix
      position: relative
      &::after
        display: table
        content: ""
        clear: both
    .slides
      background: rgba(0, 0, 0, 0.1)
</style>
