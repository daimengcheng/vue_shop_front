<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="6">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            width="300px"
            :clearable="true"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search"></el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/home/goods/add')">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据 -->
      <el-table
        :data="goodsList"
        border
        width="100%"
        v-loading="goodsList.length === 0 ? true : false"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          width="600px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="75px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoods(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 编辑商品信息提示框 -->
      <el-dialog :visible.sync="editDialogVisible">
        <el-form :model="editForm" :rules="editFormRule" ref="editFormRef">
          <el-form-item label="商品名称">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input
              type="textarea"
              v-model="editForm.goods_introduce"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editGoodsInfo">确定</el-button>
            <el-button @click="editDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqDeleteGoods,reqEditGoods} from '../../API/index'
import {mapState} from 'vuex'
export default {
  data(){
    return {
      queryInfo:{
        query:'',//商品查询参数
        pagenum:1, //请求的
        pagesize:5,
      },
      goods_id:0, //当前商品的id
      editForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        goods_introduce:'',
        pics:{},
        attrs:[],
      },
      editFormRule:{
        goods_name:[{}]
      },
      editDialogVisible:false, //是否展示添加商品提示框

    }
  },
  computed:{
    ...mapState(['goodsList','total'])
  },
  async created(){
    this.$store.dispatch('getGoodsList')
  },
  methods:{
    // 监听当前页展示的条数是否发生改变
    async handleSizeChange(newPageSize){
      this.$store.commit('changePageSize',newPageSize)
      this.$store.dispatch('getGoodsList')
    },
    // 监听当前页码是否发生改变
    async handleCurrentChange(newPageNum){
      this.$store.commit('changePageNum',newPageNum)
      this.$store.dispatch('getGoodsList')
    },
    // 删除商品
    deleteGoods(goods){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await reqDeleteGoods(goods.goods_id)
        this.$store.dispatch('getGoodsList')
      }).catch(() => {
        return
      });
    },
    // 展示编辑商品框
    showEditGoods(good){
      // let {goods_name,goods_price,goods_weight,goods_number,goods_introduce} = this.editForm
      this.editForm.goods_name = good.goods_name
      this.editForm.goods_price = good.goods_price
      this.editForm.goods_weight = good.goods_weight
      this.editForm.goods_number = good.goods_number
      this.editForm.goods_introduce = good.goods_introduce
      this.id= good.goods_id
      this.editDialogVisible = true
    },
    // 编辑商品信息
    async editGoodsInfo(){
      // let {goods_name,goods_price,goods_weight,goods_number,goods_introduce} = this.editForm

      const result = await reqEditGoods(this.id,this.editForm)
      console.log(result);
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
</style>
