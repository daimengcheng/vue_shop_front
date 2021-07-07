<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card class="box-card">
      <el-button type="primary" @click="showCategory">添加分类</el-button>
      <!-- 表格数据 -->
      <tree-table
        :data="cateroriesData"
        :columns="columnsConfig"
        show-index
        :selection-type="false"
        :expand-type="false"
        tree-type
        show-row-hover
        v-loading="cateroriesData.length === 0 ? true : false"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <!-- 是否有效列 -->
        <template slot="valid" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          >
          </i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">
            二级
          </el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="opation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCategory(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加商品分类弹框 -->
      <el-dialog title="提示" :visible.sync="addCategoryVisible">
        <el-form
          ref="addCategoryFormRef"
          :model="addCategoryForm"
          label-width="80px"
          :rules="categoryRule"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCategoryForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader
              v-model="selectValue"
              :options="options"
              :props="cascaderConfig"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategoryVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除分类提示框 -->
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqCategoryList,reqAddCategory,reqDeleteCategory} from '../../API/index'
export default {
  data(){
    return {
      cateroriesData:[], //商品分类数据列表
      queryInfo:{  //商品分类请求参数
        type:'3',
        pagenum:1, // 当前页码值
        pagesize:5 // 每页显示多少条数据
      },
      columnsConfig:[ //表格各列的配置
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          prop:'cat_deleted',
          type:'template',  //列类型为一个自定义模板
          template:'valid' //作用域插槽
        },
        {
          label:'排序',
          prop:'cat_level',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'opation'
        }
      ],
      total:0, //总的商品分类条数
      addCategoryVisible:false, // 是否展示添加分类弹框
      addCategoryForm: { //添加分类的表单数据对象
        cat_name:'', //添加分类名称
        cat_pid:0, //父级分类id
        cat_level:0, //分类层级
      },
      categoryRule:{ //添加分类框表单验证规则
        cat_name:[{required:true ,message:'必须输入分类名称',trigger:'blur'}]
      },

      fCategoryList:[], //父级分类列表
      fQueryInfo:{ //父级分类列表请求参数
        type:'2',
      },
      options:[ //选择器数据源

      ],
      cascaderConfig: { //级联选择器配置
          expandTrigger:'hover',
          checkStrictly:true,
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
      selectValue:[], //选择项绑定值
    }
  },
  // computed:{
  //   checked(){

  //   }
  // },
  async mounted(){
    // this.$nextTick(()=> {
    //   this.getCategoryList()
    // })
    // const result = await reqCategoryList(this.queryInfo)
    // this.total = result.data.total
    // this.cateroriesData = result.data.result
    // console.log(this.cateroriesData)
    this.getCategoryList()
  },

  methods:{
  // 获取商品分类列表

    async getCategoryList(){
    const result = await reqCategoryList(this.queryInfo)
    this.cateroriesData = result.data.result
    this.total = result.data.total
  },
    //  监听每页显示条目个数是否发生改变
    handleSizeChange(pageSize){
      this.queryInfo.pagesize = pageSize
      this.getCategoryList()
    },
    // 监听当前页是否改变
    handleCurrentChange(currentPage){
      this.queryInfo.pagenum = currentPage
      this.getCategoryList()
    },
    // 展示添加分类提示框
    async showCategory(){
      const result = await reqCategoryList(this.fQueryInfo)
      this.options = result.data
      this.addCategoryVisible = true
    },
    // 监听选项改变
    handleChange(value){
      this.selectValue = value
    },
    // 添加分类
    addCategory(){
      this.$refs.addCategoryFormRef.validate(async (validate)=> {
        if(validate){
          console.log(validate)
          if(!this.selectValue.length){
             await reqAddCategory(this.addCategoryForm)
          }else{
            this.addCategoryForm.cat_pid = this.selectValue[this.selectValue.length-1]
            this.addCategoryForm.cat_level = this.selectValue.length
            await reqAddCategory(this.addCategoryForm)
          }
          this.selectValue = []
          this.addCategoryForm.cat_pid = 0
          this.addCategoryForm.cat_level = 0
          this.addCategoryForm.cat_name = ''
        }
      })
    },
    // 删除分类
    deleteCategory(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await reqDeleteCategory(id)
          this.getCategoryList()
        }).catch(() => {
          return ''
        });
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  .add {
    margin-bottom: 15px;
  }
}
</style>
