<template>
  <div class="footer">
    <router-link class="footer-item" to="/">
      <i class="iconfont el-icon-s-home"></i>
    </router-link>
    <router-link class="footer-item" to="/vton-list">
      <i class="iconfont el-icon-s-goods"></i>
    </router-link>
    <div class="footer-item">
      <el-popover placement="top" width="100" trigger="click" v-model="visible">
        <el-row>
          <el-col :span="7" style="text-align: center;">
            <router-link class="add-item" to="/vton">
              <el-badge value="+" class="item">
                <i @click="visible = false" class="iconfont el-icon-s-goods" style="font-size: 24px;color: #333;"></i>
              </el-badge>
            </router-link>
          </el-col>
          <el-col :span="1" style="text-align: center;">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="7" style="text-align: center;">
            <router-link class="add-item" to="/vton-diy">
              <el-badge value="diy" class="item">
                <i @click="visible = false" class="iconfont el-icon-s-goods" style="font-size: 24px;color: #333;"></i>
              </el-badge>
            </router-link>
          </el-col>
          <el-col :span="1" style="text-align: center;">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="7" style="text-align: center;">
            <router-link class="add-item" to="/retrieval">
              <el-badge value="+" class="item">
                <i @click="visible = false" class="iconfont el-icon-s-help" style="font-size: 24px;color: #333;"></i>
              </el-badge>
            </router-link>
          </el-col>
        </el-row>
        <i slot="reference" class="iconfont plus el-icon-circle-plus"></i>
      </el-popover>
    </div>
    <router-link class="footer-item" to="/retrieval-list">
      <i class="iconfont el-icon-s-help"></i>
    </router-link>
    <router-link class="footer-item" to="/personal">
      <i class="iconfont el-icon-s-custom"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VFooter',
    data() {
      return {
        visible: false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .footer
    display: flex
    width: 100%
    height: 50px
    background: #fff
    .footer-item
      flex: 1
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      color: #333
      font-size: 12px
      .iconfont
        margin-bottom: 4px
        margin-top: 4px
        font-size: 24px
      .plus
        font-size: 56px
        color: dodgerblue
      &.active
        color: dodgerblue
      .add-item
        color: #333
        &.active
          color: dodgerblue
</style>
