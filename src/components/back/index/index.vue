<template>
  <div class="index">
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      direction="ltr"
      :show-close="false"
      class="drawer-wrapper"
    >
      <div class="content" style="padding-left:20px;padding-right:20px;">
        <h2>Custom Outfit App - Backend</h2>
        <el-divider></el-divider>
        <span>This website acts as the backend of custom outfit app.</span>
        <el-divider></el-divider>
        <span>3 core functions of Vue are applied:</span>
        <el-divider></el-divider>
        <ul>
          <li><a href="https://vuejs.org/index.html" target="_blank">Vue.js</a></li>
          <li><a href="https://router.vuejs.org/" target="_blank">Vue-Router</a></li>
          <li><a href="https://vuex.vuejs.org/guide/" target="_blank">Vuex</a></li>
        </ul>
        <el-divider></el-divider>
        <span>This app is built by <a href="https://github.com/Sam1224" target="_blank">Sam</a>, all rights reserved.</span>
      </div>
    </el-drawer>
    <el-menu
      :default-active="defaultActive"
      class="nav-wrapper"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="display:flex;height:60px;border:none;">
      <div style="flex:0 0 100px;display:flex;justify-content:center;align-items:center;">
        <el-button class="info-btn" type="info" style="background-color:rgba(84,92,100,1);border:none;" @click="toggleDrawer" :icon="drawer ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></el-button>
      </div>
      <el-menu-item index="1">
        <router-link tag="a" to="/admin" class="nav-item">Home</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link tag="a" to="/admin/users" class="nav-item">Users</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link tag="a" to="/admin/admins" class="nav-item">Admins</router-link>
      </el-menu-item>
      <el-menu-item index="4" v-if="!token || Object.keys(account).length === 0" style="position:absolute;right:0;margin-right:10px;width:200px;text-align:center;">
        <router-link tag="a" to="/admin/login" class="nav-item"><i class="fa fa-sign-in"></i> Login</router-link>
      </el-menu-item>
      <el-submenu index="5" v-else style="position:absolute;right:0;margin-right:10px;width:200px;">
        <template slot="title">
          <el-avatar class="avatar" :size="40" :src="account.avatar"></el-avatar>
          <span class="name" style="padding-left:30px;padding-right:40px;">{{account.name}}</span>
        </template>
        <el-menu-item class="nav-item" index="5-1" @click="signOut" style="text-align:center;"><i class="fa fa-sign-out"></i> Logout</el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        drawer: false,
        defaultActive: '1'
      }
    },
    computed: {
      ...mapGetters([
        'token',
        'account'
      ])
    },
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      signOut() {
        this.$message({
          showClose: true,
          message: 'Successfully Logout',
          type: 'success',
          center: true,
          duration: 1000
        })
        this.logout()
        this.setAccount({})
        setTimeout(() => {
          this.$router.push('/admin')
        }, 1500)
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .index
    text-align: center
    .nav-wrapper
      .nav-item
        text-decoration: none
        width: 100%
        height: 100%
        display: inline-table
        text-align: center
</style>
