<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- 表头区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="keyWord"
            clearable
            @clear="queryUser(keyWord)"
          >
          </el-input>
        </el-col>

        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button icon="el-icon-search" @click.native="queryUser(keyWord)">
            </el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table
        style="width: 100%"
        :data="a"
        border
        v-loading="a ? false : true"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="联系方式" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="recevieChangeState(scope.row.mg_state, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="create_time">
          <template>
            <span>{{ FormData }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="mobile" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="reqQueryInfo(scope.row.id)"
            >
            </el-button>
            <el-tooltip class="item" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="showAllocationRole(scope.row)"
              >
              </el-button>
            </el-tooltip>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="open(scope.row.id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 2, 5, 10]"
          :current-page="$store.state.pageNum"
          :page-size="$store.state.pageSize"
          :total="$store.state.userList.total"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <!--添加用户 提示框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="30%"
        show-close
        @close="handleClose"
      >
        <!-- 添加用户表单 主体 -->
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="ruleFormRef"
          class="demo-ruleForm"
        >
          <el-form-item prop="username" label="用户名" clearValidate resetField>
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码" clearValidate>
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号" clearValidate>
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" clearValidate>
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加用户表单 footer部分 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser(addForm)">确定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户提示框 -->
      <el-dialog
        title="提示"
        :visible.sync="updateDialogVisible"
        width="30%"
        show-close
        :close-on-click-modal="false"
      >
        <!-- 修改用户表单 主体 -->
        <el-form :model="updateForm" :rules="addRules" ref="updateFormRef">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="updateForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="updateForm.mobile"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="updateForm.email"></el-input>
          </el-form-item>
        </el-form>
        <!-- 修改用户表单 footer部分 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确定</el-button>
        </span>
      </el-dialog>
      <!-- 删除提示框 -->
      <template>
        <el-button type="text" @click="open"></el-button>
      </template>
      <!-- 分配角色提示框 -->
      <el-dialog title="提示" :visible.sync="AllocationRoleVisible">
        <p>用户名:xxx</p>
        <p>角色:xxx</p>
        <el-select
          v-model="roleId"
          placeholder="请选择"
          ref="allocationRoleRef"
          @change="getRoleId"
        >
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AllocationRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
// import {mapState} from 'vuex'
import moment from 'moment'
import {reqUpdateState,reqAddUser,reqQueryInfo,reqUpdateUser,reqDeleteUser,reqRolesList,reqAllocationRole} from '../../API/index'

import {CHANGE_PAGE_NUM, CHANGE_PAGE_SIZE,CHANGE_MG_STATE,CHANGE_QUERYKEYWORD} from '../../vuex/mutation-type'
export default {
  data(){
    return{
      keyWord:"", //根据关键字查询数据 reqUpdateUser reqDeleteUser
      addDialogVisible:false, //是否显示添加用户提示框
      AllocationRoleVisible:false, //是否展示分配角色提示框
      isLoading:false, //
      addForm:{ //添加用户的需要的数据
        username:'',
        password:'',
        mobile:'',
        email:''
      },
      addRules:{  //添加用户页面的规则校验
        username:[
          {required:true,message:'请输入用户名',trigger:'change'},
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'change'},
          {min:3,max:6,message:'长度在3到6个字符之间',trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入电话号',trigger:'change'},
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'change'},
        ],
      },
      updateDialogVisible:false, //是否显示编辑用户的提示框
      updateForm:{ //编辑用户需要的数据
        mobile:'',
        email:'',
        username:'',
        id:''
      },
      deleteDialogVisible:false, //是否显示删除提示框
      roleList:'', //所有的角色列表
      roleId:'', //角色id
      id:'', //用户id
    }
  },
  computed:{
    // 表单数据源
      a(){
        return this.$store.state.userList.users
      },

      FormData(){
        return moment().format('YYYY-M-D')
    }
  },

  created(){
    this.$store.dispatch('getUserList')
    console.log(this.$route)
  },
  methods:{
    // 监听当前页数显式条数
    handleSizeChange(newPageSize){
        this.$store.commit(CHANGE_PAGE_SIZE,newPageSize)
        this.$store.dispatch('getUserList')
    },
    // 监听当前页码
    handleCurrentChange(newPageSize){
      this.$store.commit(CHANGE_PAGE_NUM,newPageSize)

      this.$store.dispatch('getUserList')
    },
    // 监听状态数据的改变,并存入数据库
    async recevieChangeState(newMgState,id){
      this.$store.commit(CHANGE_MG_STATE,newMgState)
      const result = await reqUpdateState(id,newMgState)
      console.log(result);
    },
    // 根据关键字查询用户列表
    queryUser(keyWord){
      this.$store.commit(CHANGE_QUERYKEYWORD,keyWord)
      this.$store.dispatch('getUserList')
    },
    // 监听提示框关闭前的回调函数
    handleClose(){
      this.$refs.ruleFormRef.resetFields()
      console.log(111)
    },
    // 添加用户
    async addUser(addForm){
      this.addDialogVisible = false
      await reqAddUser(addForm)
      this.$store.dispatch('getUserList')
    },
    // 展示修改用户提示框
    async reqQueryInfo(id){
      this.updateDialogVisible = !this.updateDialogVisible
      const {data} = await reqQueryInfo(id)
      this.updateForm = data
    },
    // 编辑用户信息id,{mobile,email}
     updateUser(){
      const {id,mobile,email} = this.updateForm
      this.$refs.updateFormRef.validate(async (validate)=> {
        if (validate){
          await reqUpdateUser(id,{mobile,email})
          this.$store.dispatch('getUserList')
        }
      })
      this.updateDialogVisible = false
    },
    // 删除单个用户
    open(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await reqDeleteUser(id)
          this.$store.dispatch('getUserList')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 展示角色分配框
    async showAllocationRole(role){
      this.id = role.id
      const result = await reqRolesList()
      this.roleList = result.data
      this.getRoleId()
      this.AllocationRoleVisible = true
    },
    // 获取角色id
    getRoleId(roleId){
      this.roleId = roleId
    },
    // 更新角色
    async updateRole(){
      await reqAllocationRole(this.id,this.roleId)
      this.$store.dispatch('getUserList')
      this.AllocationRoleVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
