<template>
  <div class="retrieval-list">
    <v-header :title="title"></v-header>
    <el-card class="retrieval-item" shadow="always" v-for="(retrieval, index) in retrievalList" :key="index">
      <el-row slot="header" class="clearfix">
        <el-col :span="8" style="text-align: center;">
          <span style="font-size: 18px;">{{index}}</span>
        </el-col>
        <el-col :span="4" style="text-align: center;">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="12" style="text-align: center; padding-left: 12px;">
          <el-button type="danger" class="delete-btn" style="padding: 6px 6px" icon="el-icon-delete" @click="deleteRetrieval(retrieval._id)" circle></el-button>
        </el-col>
      </el-row>
      <el-row :span="8" style="text-align: center;">
        <el-image class="cloth" style="height: 256px;" :src="convBase64ToImage(retrieval.cloth)" fit="fit" lazy></el-image>
      </el-row>
      <el-row :span="16" style="text-align: center;">
        <el-carousel class="slides" height="256px" :interval="3000">
          <el-carousel-item class="result" v-for="(result, index) in retrieval.results" :key="index">
            <el-image style="height: 256px;width: 256px;" :src="convBase64ToImage(result)" fit="fit" lazy></el-image>
          </el-carousel-item>
        </el-carousel>
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
        title: 'Outfits Retrieval History',
        user: {},
        retrievalList: []
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
              this.retrievalList = res.data[0].retrieval
            }
          })
      },
      deleteRetrieval(retrievalid) {
        this.$confirm('This operation will delete the retrieval record, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let retrieval = {}
          retrieval._id = this.user._id
          retrieval.username = this.user.username
          retrieval.retrievalid = retrievalid

          Service.deleteRetrieval(retrieval)
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
  .retrieval-item
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
