<template>
  <div class="personal">
    <v-header :title="title"></v-header>
    <div class="content-wrapper">
      <el-row>
        <el-col style="text-align:center;" :span="8">
          <el-image style="width:100px;height:100px;" :src="user.avatar" fit="fill"></el-image>
        </el-col>
        <el-col style="padding-left:12px;" :span="12">
          <div class="name">
            <span class="text">
              {{user.name}}
            </span>
          </div>
        </el-col>
        <el-col style="text-align:center;" :span="4" class="edit-btn">
          <el-button type="primary" icon="el-icon-edit" circle @click="toUserEdit"></el-button>
        </el-col>
      </el-row>
      <el-row style="padding:24px;height:24px;">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Username</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">{{user.username}}</el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row style="padding:24px;height:24px;">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Name</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">{{user.name}}</el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row style="padding:24px;height:24px;">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Phone</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">{{user.phone}}</el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row style="padding:24px;height:24px;">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Email</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">{{user.email}}</el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row style="padding:24px;height:24px;" @click.native="toVtonList">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Virtual Try-On</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">
          {{vton.length}}
          <i class="el-icon-arrow-right"></i>
        </el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row style="padding:24px;height:24px;" @click.native="toRetrievalList">
        <el-col style="line-height:24px;font-size:20px;" :span="10">Outfits Retrieval</el-col>
        <el-col style="text-align:right;line-height:24px;font-size:16px;color:rgba(0,0,0,0.4)" :span="14">
          {{retrieval.length}}
          <i class="el-icon-arrow-right"></i>
        </el-col>
        <el-divider></el-divider>
      </el-row>
    </div>
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
        title: 'Personal',
        user: {},
        vton: [],
        retrieval: []
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
              let user = res.data[0]
              let avatar = user.avatar
              if (avatar) {
                user.avatar = `https://outfitapp-sam.herokuapp.com/${avatar}`
              } else {
                user.avatar = 'https://outfitapp-sam.herokuapp.com/uploads/avatar_default.jpg'
              }
              this.user = user
              this.vton = user.vton
              this.retrieval = user.retrieval
            }
          })
      },
      toVtonList() {
        this.$router.push('/vton-list')
      },
      toRetrievalList() {
        this.$router.push('/retrieval-list')
      },
      toUserEdit() {
        this.$router.params = this.user
        this.$router.push('/user-edit')
      }
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal
    align-items: center
    justify-content: center
    text-align: center
    .content-wrapper
      text-align: left
      width: 100%
      height: 100px
      padding-top: 24px
      padding-bottom: 24px
      .name
        font-size: 0
        .text
          font-size: 18px
          font-weight: bold
          line-height: 50px
      .edit-btn
        line-height: 100px
</style>
