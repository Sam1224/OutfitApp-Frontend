<template>
  <div class="user-edit">
    <v-header :title="title"></v-header>
    <el-form ref="userForm" :model="userForm" status-icon label-width="100px" class="user-table" :rules="rules">
      <el-form-item label="Avatar" prop="avatar">
        <el-upload ref="avatarUploader"
                   class="upload-wrapper"
                   :class="{hide: hideUpload}"
                   list-type="picture-card"
                   action="https://outfitapp-sam.herokuapp.com/upload"
                   show-file-list
                   accept="image/png, image/jpeg"
                   :on-success="handleAvatarSuccess"
                   :on-change="handleAvatarChange"
                   :on-remove="handleAvatarRemove"
                   :disabled="avatarStatus"
                   :file-list="avatarList"
                   :limit="Number(1)"
        >
          <i class="el-icon-upload"></i>
        </el-upload>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="userForm.username" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="userForm.phone" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="Email" prop="email">
        <el-input class="email" v-model="userForm.email" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="userForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="Name" prop="name">
        <el-input class="name" v-model="userForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <div class="btns-wrapper" style="padding-bottom: 100px;">
        <el-button class="edit-btn" type="primary" @click="editUser">Submit</el-button>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters, mapMutations } from 'vuex'
  import statusCode from '@/common/js/status'
  import VHeader from '@/components/front/v-header/v-header'

  const ERR_NOK = statusCode.ERR_NOK
  const ERR_OK = statusCode.ERR_OK

  export default {
    data() {
      return {
        title: 'Edit User',
        isPasswordModified: false,
        avatarStatus: false,
        avatarList: [],
        avatarFormData: '',
        hideUpload: false,
        user: {},
        userForm: {
          username: '',
          password: '',
          phone: '',
          email: '',
          name: '',
          avatar: ''
        },
        rules: {
          username: [{
            required: true,
            message: 'Please enter username',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: 'Please enter password',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: 'Please enter phone',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: 'Please enter email',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: 'Please enter name',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    created() {
      this._initializeUser(this.$router.params)
    },
    methods: {
      _initializeUser(user) {
        this.userForm = user
        this.user = user
        // if (user.avatar) {
        //   this.avatarList.push({
        //     name: user.avatar.split('/')[-1],
        //     url: user.avatar
        //   })
        // }
      },
      handleAvatarSuccess(response, file, fileList) {
        if (response.code === ERR_OK) {
          this.userForm.avatar = response.filepath
          this.avatarList = []
          this.avatarList.push({
            name: response.filepath.split('/')[-1],
            url: `https://outfitapp-sam.herokuapp.com/${response.filepath}`
          })
        }
      },
      handleAvatarChange(file, fileList) {
        this.hideUpload = fileList.length >= 1
      },
      handleAvatarRemove(file, fileList) {
        this.userForm.avatar = null
        this.hideUpload = fileList.length >= 1
      },
      editUser() {
        let user = {
          username: this.userForm.username,
          password: this.userForm.password,
          phone: this.userForm.phone,
          email: this.userForm.email,
          name: this.userForm.name,
          avatar: this.userForm.avatar,
          token: this.token
        }

        Service.updateUser(this.user._id, user)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success',
                center: true,
                duration: 1000
              })
              setTimeout(() => {
                this.$router.push('/home')
              }, 1500)
            } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
              this.$message({
                showClose: true,
                message: 'The token has expired, please login again',
                type: 'warning',
                center: true,
                duration: 1000
              })
              setTimeout(() => {
                this.logout()
                this.setAccount({})
                this.$router.push('/admin/login')
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
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-edit
    position: relative
    font-size: 0
    text-align: center
    .user-table
      position: relative
      width: 95%
      padding-top: 24px
      margin: 0 auto
      .hide
        .el-upload--picture-card
          display: none
    .address-item, .pay-item, .favorite-item
      position: relative
      display: flex
      .input-wrapper
        flex: 0 0 90%
      .icon-wrapper
        flex: 1
        position: relative
        .iconBtn
          position: relative
          top: 15px
</style>
