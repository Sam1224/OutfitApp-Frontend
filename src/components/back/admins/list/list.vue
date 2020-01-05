<template>
  <div class="adminslist-wrapper" v-show="!loading">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="admins-table">
      <v-client-table v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" :columns="columns" :data="admins" :options="options" label-width="auto">
        <div slot="child_row" slot-scope="props">
          <el-form :model="props.row" status-icon label-width="100px" style="position:relative;width: 50%;margin:auto;">
            <el-form-item label="Username" prop="username">
              <el-card shadow="never">
                <span>{{props.row.username}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Phone" prop="phone">
              <el-card shadow="never">
                <span>{{props.row.phone}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-card shadow="never">
                <span>{{props.row.email}}</span>
              </el-card>
            </el-form-item>
          </el-form>
        </div>
        <a slot="edit" slot-scope="props" class="el-icon-setting" @click="editAdmin(props.row._id)"></a>
        <a slot="remove" slot-scope="props" class="el-icon-delete" @click="deleteAdmin(props.row._id)"></a>
      </v-client-table>
      <div class="tab-wrapper">
        <div class="tab-item">
          <router-link class="add" to="/admin/admins/add" tag="a">Add Admin</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import Vue from 'vue'
  import VueTables from 'vue-tables-2'
  import { mapGetters } from 'vuex'
  import statusCode from '@/common/js/status'

  Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

  const ERR_OK = statusCode.ERR_OK

  export default {
    data() {
      return {
        messageTitle: 'Admin List',
        loading: true,
        admins: [],
        errors: [],
        columns: ['_id', 'username', 'phone', 'email', 'edit', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            username: 'Username',
            phone: 'Phone',
            email: 'Email'
          },
          sortables: ['username', 'phone', 'email'],
          perPage: 10,
          filterable: ['username', 'phone', 'email'],
          uniqueKey: '_id'
        },
        props: [
          '_id'
        ]
      }
    },
    created () {
      this._initializeAdmins()
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeAdmins() {
        Service.getAdmins(this.token)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.admins = res.data
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      deleteAdmin(id) {
        this.$confirm('This operation will delete the admin, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let admin = {}
          admin.token = this.token
          Service.deleteAdmin(id, admin)
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
                  this._initializeAdmins()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel deleting'
          })
        })
      },
      editAdmin(id) {
        this.$router.params = id
        this.$router.push('/admin/admins/edit')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .admins-table
    width: 80%
    margin: 0 auto
    .slot
      display: table
      margin: 0 auto
    .tab-wrapper
      display: flex
      position: relative
      bottom: 50px
      float: right
      height: 40px
      line-height: 40px
      .tab-item
        flex: 1
        text-align: center
        border-radius: 10px
        padding-left: 5px
        padding-right: 5px
        border: solid black 1px
        .add
          display: block
          text-decoration: none
          font-size: 18px
          color: rgb(77, 85, 93)
</style>
