<template>
  <div class="edit-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="userForm" :model="userForm" status-icon label-width="100px" class="user-table" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="userForm.username" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="userForm.phone" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input class="email" v-model="userForm.email" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="userForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input class="name" v-model="userForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="avatar">
        <el-upload ref="avatarUploader" class="upload-wrapper" drag action="https://outfitapp-sam.herokuapp.com/upload" show-file-list
                   accept="image/png, image/jpeg"
                   :on-success="handleAvatarSuccess"
                   :on-remove="handleAvatarRemove"
                   :disabled="avatarStatus"
                   :file-list="avatarList"
                   list-type="picture"
                   :limit="Number(1)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drag picture here, or <em>click to upload</em></div>
          <div class="el-upload__tip" slot="tip">Only .jpg and .png files accepted</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button class="edit-btn" type="primary" @click="editUser">Edit User</el-button>
        <el-button class="cancel-btn" @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters, mapMutations } from 'vuex'
  import statusCode from '@/common/js/status'

  const ERR_NOK = statusCode.ERR_NOK
  const ERR_OK = statusCode.ERR_OK

  export default {
    props: {
      id: String
    },
    data() {
      return {
        title: 'Edit User',
        loading: true,
        user: {},
        isPasswordModified: false,
        avatarStatus: false,
        avatarList: [],
        avatarFormData: '',
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
      _initializeUser(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/users')
        }
        Service.getOneUserById(id)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.userForm = res.data[0]
              this.user = res.data[0]
              let avatar = res.data[0].avatar
              if (avatar) {
                let pendingAvatar = {}
                let url = `https://outfitapp-sam.herokuapp.com/${avatar}`
                pendingAvatar.name = url.split('/')[-1]
                pendingAvatar.url = url
                this.avatarList.push(pendingAvatar)
              }
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
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
      handleAvatarRemove(file, fileList) {
        this.userForm.avatar = null
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

        Service.updateUser(this.$router.params, user)
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
                this.$router.push('/admin/users')
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
      cancel() {
        this.$router.push('/admin/users')
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .edit-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .user-table
      position: relative
      width: 60%
      top: 50px
      margin: 0 auto
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
