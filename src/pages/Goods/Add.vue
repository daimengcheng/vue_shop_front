<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- alter提示框 -->
      <el-alert
        :closable="false"
        center
        title="添加商品信息"
        type="info"
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form 表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRule"
        ref="addGoodsFromRef"
      >
        <!-- tabs栏 -->
        <el-tabs :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品基本信息表单 -->
            <el-form-item label="商品名称">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selectValue"
                :options="options"
                :props="propsConfig"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="产品参数" name="1">产品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
          <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqCategoryList} from '../../API/index'
export default {
  data(){
    return {
      addGoodsForm:{ //添加商品表单数据
        goods_name:'',
        goods_cat:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',
      },
      addGoodsFormRule:{
        goods_name:[{}]
      },
      activeIndex:'0',
      propsConfig:{
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      options:[],
      selectValue:[],
    }
  },
  async mounted(){
    // 获取商品分类列表
    const result = await reqCategoryList({})
    this.options = result.data
  },
  methods:{
    // 监听级联选择器选项发生改变时
    handleChange(){

    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 15px;
}
.el-col {
  margin: 0 10px 20px 10px;
}
.el-steps {
  margin: 10px 0;
}
</style>
