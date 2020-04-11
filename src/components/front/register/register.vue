<template>
  <div id="register">
    <v-header :title="title"></v-header>
    <el-form ref="regForm" :model="regForm" status-icon :rules="rules" label-width="80px" class="reg-form">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="regForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="regForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="password_confirm">
        <el-input class="confirm-password" type="password" v-model="regForm.password_confirm" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="regForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input class="email" v-model="regForm.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input class="name" v-model="regForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="onSubmit('regForm')">Register</el-button>
        <el-button class="cancel" @click="cancel">Cancel</el-button>
        <br>
        <router-link to="/login" class="login">Already Registered？Login Now</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import statusCode from '@/common/js/status'
  import VHeader from '@/components/front/v-header/v-header'

  const ERR_OK = statusCode.ERR_OK

  export default {
    name: 'Register',
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter password'))
        } else {
          if (this.regForm.password_confirm !== '') {
            this.$refs.regForm.validateField('password_confirm')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter password again'))
        } else if (value !== this.regForm.password) {
          callback(new Error('Two passwords are different'))
        } else {
          callback()
        }
      }
      return {
        title: 'Register',
        regForm: {
          username: '',
          password: '',
          password_confirm: '',
          phone: '',
          email: '',
          name: ''
        },
        rules: {
          username: [
            { required: true, message: 'Please enter username' }
          ],
          password: [
            { required: true, validator: validatePass }
          ],
          password_confirm: [
            { required: true, validator: validatePass2 }
          ],
          phone: [
            { required: true, message: 'Please enter your phone number' }
          ],
          email: [
            { required: true, message: 'Please enter your email' }
          ],
          name: [
            { required: true, message: 'Please enter your nickname' }
          ]
        }
      }
    },
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let user = {
              username: this.regForm.username,
              password: this.regForm.password,
              phone: this.regForm.phone,
              email: this.regForm.email,
              name: this.regForm.name
            }
            Service.addUser(user)
              .then((response) => {
                let res = response.data
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: 'Successfully register, please activate in time',
                    type: 'success',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.$router.push({ path: '/login' })
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
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push('/login')
      }
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .reg-form
    position: relative
    top: 60px
    width: 80%
    margin: 20px auto auto
    padding: 20px
    border: 1px solid #ddd
</style>
