<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">
        首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card class="box-card">
      <!-- alter提示 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row>
        <span>选择商品分类:</span>
        <!-- 级联选择器 -->
        <el-cascader
          v-model="selectValue"
          :options="paramsOptions"
          :props="propsConfig"
          @change="handleChange"
        ></el-cascader>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many" :disabled="isDisabled"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="showEdit"
            >添加属性</el-button
          >
          <!-- 动态属性表格数据 -->
          <el-table
            :data="dynamicTableData"
            border
            v-show="!isDisabled"
            v-loading="dynamicTableData.length === 0 ? true : false"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditProps(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-edit"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only" :disabled="isDisabled"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="showEdit"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table
            :data="staticTableData"
            border
            v-loading="staticTableData.length === 0 ? true : false"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditProps(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-edit"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加参数提示框 -->
        <el-dialog
          :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
          :visible.sync="addDialogVisible"
          :closeOnClickModal="false"
        >
          <el-form :model="addForm" ref="addFormRef" :rules="FormRule">
            <el-form-item
              :label="activeName === 'many' ? '动态参数' : '静态属性'"
              prop="attr_name"
            >
              <el-input type="text" v-model="addForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addProps">确定</el-button>
              <el-button @click="addDialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 编辑参数提示框 -->
        <el-dialog
          :title="activeName === 'many' ? '编辑动态参数' : '编辑静态属性'"
          :visible.sync="editDialogVisible"
          :closeOnClickModal="false"
        >
          <el-form :model="editForm" ref="editFormRef" :rules="FormRule">
            <el-form-item
              :label="activeName === 'many' ? '动态参数' : '静态属性'"
              prop="attr_name"
            >
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editParams">确定</el-button>
              <el-button @click="editDialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqCategoryList,reqParamsList,reqDelateParams,reqAddParams,reqEditParams} from '../../API/index'
export default {
  data(){
    return {
      propsConfig:{ //级联选择器配置项
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      paramsOptions:[], // 级联选择器数据源
      selectValue:[], //级联选择器选中的值,
      activeName:'many', //tabs标签页的绑定值
      staticTableData:[], //静态属性表格数据源
      dynamicTableData:[], //动态属性表格数据
      id:0, //分类id
      attrId:0, //属性id
      addForm:{ //编辑表单数据
        attr_name:''
      },
      FormRule:{
        attr_name:[{required:true,message:'请输入参数名',trigger:'blur'}]
      },

      addDialogVisible:false, //是否展示参数添加框
      editDialogVisible:false,//是否展示编辑框
      editForm:{ //参数添加框表单数据
        attr_name:'',
      },
    }
  },
  computed:{
    //是否禁用添加属性按钮
    isDisabled(){
      if(!this.selectValue.length){
        return true
      }else{
        return false
      }
    }
  },
  mounted(){
    this.getCategoryList()
  },
  methods:{
    // 获取所有的商品分类
    async getCategoryList(){
      const result = await reqCategoryList({})
      this.paramsOptions = result.data
    },
    // 获取参数分类列表
    async getParamsList(id,sel){
      const result = await reqParamsList(id,sel)
      return result.data
    },
    // 级联选择器 选项改变时的回调
    async handleChange(value){
      this.id = value[value.length - 1]
      if(this.activeName === 'many'){
        this.dynamicTableData = await this.getParamsList(this.id,this.activeName)
      }else{
        this.staticTableData = await this.getParamsList(this.id,this.activeName)
      }
    },
    // 监听tabs标签页
    async handleClick(tabs){
      let sel = tabs.paneName
      this.id = this.selectValue[this.selectValue.length - 1]
      if(sel === 'many'){
        this.dynamicTableData = await this.getParamsList(this.id,sel)
      }else{
        this.staticTableData = await this.getParamsList(this.id,sel)
      }
    },
    // 删除属性参数
    deleteParams(staticParams){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await reqDelateParams(this.id,staticParams.attr_id)
          if(this.activeName === 'many'){
            this.dynamicTableData = await this.getParamsList(this.id,this.activeName)
          }else{
            this.staticTableData = await this.getParamsList(this.id,this.activeName)
          }
        }).catch(() => {
          return ''
        });

    },
    // 展示属性编辑框
    showEdit(){
      this.addDialogVisible = true
    },
    // 添加属性参数
    async addProps(){
      let attr_name = this.addForm.attr_name
      let attr_sel = this.activeName
      this.$refs.addFormRef.validate(async (validate)=> {
        if(!validate) return ''
          const result = await reqAddParams(this.id,{attr_name,attr_sel})
          if(attr_sel === 'many'){
            this.dynamicTableData.push(result.data)
          }else{
            this.staticTableData.push(result.data)
          }
          this.addDialogVisible = false
      })

    },
    // 展示编辑属性
    showEditProps(prop){
      this.attrId = prop.attr_id
      this.editForm.attr_name = prop.attr_name
      this.editDialogVisible = true
    },
    // 编辑属性参数
     async editParams(){
      let attr_name = this.editForm.attr_name
      let attr_sel = this.activeName
      this.$refs.editFormRef.validate( async(validate)=> {
        if(!validate){
          return ''
        }else{
          await reqEditParams(this.id,this.attrId,attr_name,attr_sel)
          if(this.activeName === 'many'){
            this.dynamicTableData = await this.getParamsList(this.id,this.activeName)
          }else{
            this.staticTableData = await this.getParamsList(this.id,this.activeName)
          }
          this.editDialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 15px;
  .el-row {
    margin-top: 10px;
    span {
      margin-right: 5px;
    }
  }
}
.el-table {
  margin-top: 10px;
}
</style>
