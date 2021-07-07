<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../common/images/logo.png" alt="logo" />
        <span>后台管理</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#202121"
          text-color="#fff"
          active-text-color="#1989fa"
          router
          :default-active="activePath"
          ref="menuRef"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(menu, index) in menuList"
            :key="menu.id"
            :index="index + ''"
          >
            <template slot="title">
              <i class="iconfont" :class="menuIcon[index]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group v-for="child in menu.children" :key="child.id">
              <el-menu-item :index="'/home/' + child.path">
                <i class="iconfont el-icon-menu"></i>
                <span @click="saveActivePath('/home/' + child.path)">{{
                  child.authName
                }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 退出登录提示框 -->
  </el-container>
</template>

<script type="text/ecmascript-6">
import {mapState} from  'vuex'
export default {
  data(){
    return{
      menuIcon:['icon-yonghu1','icon-quanxian','icon-shangpinguanli','icon-dingdan','icon-shujutongji'],
      activePath:'', //当前选中的menu标签
    }
  },
  computed:{
    ...mapState(['menuList'])
  },
  methods:{
    // 将选中的menu路径保存到浏览器中
    saveActivePath(path){
      console.log(path)
      window.sessionStorage.setItem('activePath',path)
    },
    // 退出登录
    logout(){

      this.$confirm('确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.sessionStorage.setItem('token','')
          window.sessionStorage.setItem('activePath','')
          this.$router.replace('/login')
        })
    }
  },
  mounted(){

    //获取菜单栏列表
    this.$store.dispatch('getMenuList')

    this.activePath = window.sessionStorage.getItem('activePath',)
  }
}
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
  font-size: 20px;
  color: #fff;
  .el-header {
    background-color: #273247;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 5px;
    div {
      display: flex;

      align-items: center;

      img {
        width: 60px;
        height: 60px;
      }
    }
  }
  .el-aside {
    background-color: #202121;
    .el-menu {
      border: 0;
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .el-main {
    background-color: #eef1f5;
  }
}
</style>
