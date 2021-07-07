<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row>
        <el-col :span="5">
          <el-input type="text" placeholder="请输入要查询的订单号"></el-input>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search"></el-button></el-col>
      </el-row>
      <!-- table表格 -->
      <el-table
        :data="orderList"
        border
        v-loading="orderList.length === 0 ? true : false"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="300px"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="150px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="!scope.row.pay_status">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | getTime() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-position"
              size="mini"
              @click="getLogisticsInfo(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqOrderList,reqLookLogisticsInfo} from '../../API/index'
import Moment from 'moment'
export default {
  data(){
    return {
      orderList:[],//table表格数据源
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10,
        user_id:'',
        pay_status:'',
        is_send:"",
        order_fapiao_title:"",
        order_fapiao_company:"",
        order_fapiao_content:"",
        consignee_addr:""
      },
      total:0,//总的数据条数
    }
  },
  filters:{
    getTime(create_time){
      return Moment(create_time).format('YYYY-M-D h:mm:ss')
    }
  },
  async mounted(){
    const data = await this.getOrderList()
    this.total = data.total
  },
  methods:{
    // 获取订单数据列表
    async getOrderList(){
      const result = await reqOrderList(this.queryInfo)
      this.orderList = result.data.goods
      return result.data
  },
    // 当前页显示条数的监听
    async handleSizeChange(newPageSize){
      this.queryInfo.pagesize = newPageSize
      await this.getOrderList()
    },
    // 当前页码的监听
    async handleCurrentChange(newPageNum){
      this.queryInfo.pagenum = newPageNum
      await this.getOrderList()
    },
    // 查看物流信息
    async getLogisticsInfo(order){
      const result = await reqLookLogisticsInfo(order.order_id)
      console.log(result)
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 15px;
  .el-table {
    margin-top: 15px;
  }
}
</style>
