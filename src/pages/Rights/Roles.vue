<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card试视图 -->
    <el-card>
      <el-button type="primary" @click="addRoleVisible = true"
        >添加用户</el-button
      >
      <!-- 表格数据 -->
      <el-table
        :data="roleList"
        border
        v-loading="roleList.length === 0 ? true : false"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <!-- 分级展示列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(child1, index) in scope.row.children"
              :key="index"
              class="bd-top Vcenter"
            >
              <!-- 一级权限渲染 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, child1.id)"
                  >{{ child1.authName }}</el-tag
                >
              </el-col>
              <!-- 二级.三级权限渲染 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(child2, index) in child1.children"
                  :key="index"
                  :class="{ 'bd-top': index != 0 }"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, child2.id)"
                      >{{ child2.authName }}</el-tag
                    >
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(child3, index) in child2.children"
                      :key="index"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, child3.id)"
                      >{{ child3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showRolesInfo(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="showAllocation(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="addRoleVisible"
        width="30%"
        :closeOnClickModal="false"
      >
        <el-form
          :model="addRoleruleForm"
          :rules="addRoleRules"
          ref="addRoleruleFormRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input type="text" v-model="addRoleruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="text" v-model="addRoleruleForm.roleDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRoles">确定</el-button>
            <el-button @click="addRoleVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑用户弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="updateRoleVisible"
        width="30%"
        :closeOnClickModal="false"
      >
        <el-form
          :model="updateRoleruleForm"
          :rules="addRoleRules"
          ref="updateRoleruleFormRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              type="text"
              v-model="updateRoleruleForm.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input
              type="text"
              v-model="updateRoleruleForm.roleDesc"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateRoleInfo()">确定</el-button>
            <el-button @click="updateRoleVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="allocationRoleVisible"
        width="30%"
        :closeOnClickModal="false"
      >
        <el-tree
          :data="allocationData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedData"
          ref="treeRef"
        >
        </el-tree>
        <el-button type="primary" @click="UpdateAllocation">确定</el-button>
        <el-button @click="hiddenAllocation">取消</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {reqRolesList,reqRemoveRight,reqAddRoles,reqDeleteRoles, reqUpdateRoles,reqRightsList,reqApportionRight} from '../../API/index'
export default {
  data(){
    return{
      roleList:[], //角色列表数据源 reqUpdateRoles
      addRoleVisible:false, //是否展示添加用户弹框
      updateRoleVisible:false, //是否展示更新用户信息弹框
      allocationRoleVisible:false, //是否展示分配权限弹框
      roleId:'', //角色id
      addRoleruleForm:{ //添加框数据源
        roleName:'',
        roleDesc:''
      },
      updateRoleruleForm:{ //更新信息框数据源
        roleName:'',
        roleDesc:'',
        roleId:'',
      },
      allocationData:[], //分配权限数据源
      defaultProps:{
        children:'children',
        label:'authName'
      },
      checkedData:[],  //该角色拥有的权限
      addRoleRules:{
          roleName:[{required:true,message:'必须输入角色名称'}],
          roleDesc:[{message:'可省略'}]
      },
      typeList:['list','tree']
    }
  },
  async mounted(){

    const result = await reqRolesList()
    this.roleList = result.data
    console.log(this.$route)

  },
  methods:{

    //删除角色指定权限
    removeRightById(role,rightId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then( async () => {

          const result = await reqRemoveRight(role.id,rightId)
          role.children = result.data
        })
        .catch(() => {
          return ''

        });
      },
    // 添加角色
     addRoles(){
      const {roleName,roleDesc} = this.addRoleruleForm

      this.$refs.addRoleruleFormRef.validate(async (validate)=> {
        if(validate){
          const result = await reqAddRoles(roleName,roleDesc)
          this.roleList.push(result.data)
          this.$refs.addRoleruleFormRef.resetFields()
          this.addRoleVisible = false
        }
      })

    },
    // 删除角色
    async deleteRoles(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          await reqDeleteRoles(id)
          // 重新获取角色列表
          const result = await reqRolesList()
          this.roleList = result.data
        }).catch(() => {
        });
    },
    // 展示编辑弹框信息
    showRolesInfo(role){
      this.updateRoleVisible = true
      this.updateRoleruleForm.roleName = role.roleName
      this.updateRoleruleForm.roleDesc = role.roleDesc
      this.updateRoleruleForm.roleId = role.id
    },
    // 修改信息
     updateRoleInfo(){
      this.$refs.updateRoleruleFormRef.validate(async (validate)=> {
        if(validate){
          const {roleId,roleName,roleDesc} = this.updateRoleruleForm
          const result =  await reqUpdateRoles(roleId,{roleName,roleDesc})
          this.roleList.push(result.data)
          this.updateRoleVisible = false
        }else{
          this.$message('角色名不能为空')
        }
      })

    },
    // 弹出分配权限弹框
    async showAllocation(node){
    this.roleId = node.id
      const result = await reqRightsList(this.typeList[1])
      this.allocationData = result.data
      this.getNode(this.checkedData,node)
      this.allocationRoleVisible = true
    },
    // 隐藏权限列表弹框
    hiddenAllocation(){
      this.checkedData = []
      this.allocationRoleVisible = false
    },
    // 更新权限
    async UpdateAllocation(){
      let keys = []
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
      keys = [...checkedKeys,...halfCheckedKeys]

      // 将keys 用,拼接
      const strID = keys.join(',')
      // console.log(strID)
      const result = await reqApportionRight(this.roleId,strID)
      if(result.meta.status === 200){
        const result = await reqRolesList()
        this.roleList = result.data
      }
      this.checkedData = []
      this.allocationRoleVisible = false

    },
    // 获取所有三级节点下的权限的id
    getNode(arr,node){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach((item)=> {
        this.getNode(arr,item)
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 15px;
  .el-table {
    margin-top: 10px;
  }
  .el-tag {
    margin: 20px 20px 0 0;
  }
  .bd-top {
    border-top: 1px solid #eee;
  }
  .bd-bottom {
    border-bottom: 1px solid #eee;
  }
  .Vcenter {
    display: flex;
    align-items: center;
  }
}
</style>
