<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- 表格内容 -->
      <el-table
        :data="RightsData"
        border
        stripe
        v-loading="RightsData.length === 0 ? true : false"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag :type="tagType[scope.row.level]">
              {{ scope.row.level * 1 + 1 }}级
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqRightsList} from '../../API/index'
export default {
  data(){
    return{
      RightsData:[], //表格数据源
      tagType:['','warning','success']
    }
  },

  async mounted(){

    const result = await reqRightsList('list')
    this.RightsData = result.data
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
