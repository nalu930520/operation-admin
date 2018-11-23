<template>
  <div class="wraper">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="adminUsers">
          <UserManagement
            :userColumns="userColumns"
            :adminUsers="adminUsers"
            :tableChange="(page, per_page) => { fetchData('adminUsers', page, per_page) }"
          />
        </el-tab-pane>
        <el-tab-pane label="群组管理" name="rolesUsers">
          <GroupManagement
            :groupColumn="groupColumn"
            :rolesUsers="rolesUsers"
            :tableChange="(page, per_page) => { fetchData('rolesUsers', page, per_page) }"
            @updateList="updateList"
          />
        </el-tab-pane>
        <el-tab-pane label="权限管理" name="adminRoles">
          <RoleManagement
            :roleColumn="roleColumn"
            :adminRoles="adminRoles"
            :tableChange="(page, per_page) => { fetchData('adminRoles', page, per_page) }"
            @updateList="updateList"
           />
         </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="修改用户信息" :visible="dialogUserEditVisible" width="500px">
      <el-form :model="userEditform">
        <el-form-item label="邮箱:" :label-width="formLabelWidth">
          {{selectedEmail}}
        </el-form-item>
        <el-form-item label="昵称:" :label-width="formLabelWidth">
          {{selectedName}}
        </el-form-item>
        <el-form-item label="所属群组:" :label-width="formLabelWidth">
          <el-select v-model="selectedUserRolename" placeholder="请选择">
            <el-option
              v-for="item in adminRoles.data"
              :key="item.id"
              :label="item.rolename"
              :value="item.rolename">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUserGroup">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改群组信息" :visible="dialogGroupEditVisible" width="500px">
      <el-form :model="groupEditform">
        <el-form-item label="所属群组:" :label-width="formLabelWidth">
          {{selectGroup}}
        </el-form-item>
        <el-form-item label="成员:" :label-width="formLabelWidth">
          <el-select
            v-model="selestedRoleUsersId"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectedRoleUsers"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoleUsers">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserManagement from '@/views/backManagement/userManagement'
import GroupManagement from '@/views/backManagement/groupManagement'
import RoleManagement from '@/views/backManagement/roleManagement'
import difference from 'lodash.difference'
import {
  fetchAdminUsers,
  fetchAdminRoles,
  fetchRolesUsers,
  deleteAdminUser,
  // deleteAdminRole,
  editAdminUserRole,
  editRolesUsers
} from '@/api/backManagement'
@Component({
  components: {
    UserManagement,
    GroupManagement,
    RoleManagement
  }
})
export default class BackManagement extends Vue {
  activeName: string = 'adminUsers'
  adminUsers: Object = {}
  rolesUsers: Object = {}
  adminRoles: Object = {}
  dialogUserEditVisible: Boolean = false
  dialogGroupEditVisible: Boolean = false
  roleUsers: Array<any> = []
  selectedName: String = ''
  selectedEmail: String = ''
  selectedUserId: Number = 0
  selectedUserRolename: String = ''
  selectedRoleUsers: Array<any> = []
  selestedRoleUsersId: Array<Number> = []
  selectGroup: String = ''
  formLabelWidth: String = '120px'
  userEditform: any = {}
  groupEditform: any = {}
  userColumns: Array<any> = [
    {
      prop: 'email',
      label: '邮箱'
    },
    {
      prop: 'username',
      label: '昵称'
    },
    {
      prop: 'rolename',
      label: '所属群组'
    },
    {
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        return [
          {
            label: '编辑',
            color: 'primary',
            func: (index, row) => {
              this.showEditUserDialog(row)
            }
          },
          {
            label: '删除',
            color: 'danger',
            func: (index, row) => {
              this.$confirm('确认是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  deleteAdminUser({ user_id: row.id })
                    .then(data => {
                      this.updateList()
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      })
                    })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            }
          }
        ]
      }
    }
  ]
  groupColumn: Array<any> = [
    {
      prop: 'rolename',
      label: '角色群组'
    },
    {
      prop: 'users',
      label: '成员',
      formatter: (row, column, cellValue, index) => {
        return row.users.map(user => user.username).join(',')
      }
    },
    {
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        return [
          {
            label: '编辑',
            color: 'primary',
            func: (index, row) => {
              this.showGroupUserDialog(row)
              // this.showDialog(row)
            }
          }
          // {
          //   label: '删除',
          //   color: 'danger',
          //   func: (index, row) => {
          //     this.$confirm('确认是否删除', '提示', {
          //       confirmButtonText: '确定',
          //       cancelButtonText: '取消',
          //       type: 'warning'
          //     })
          //       .then(() => {
          //         deleteAdminRole({ rolename: row.rolename })
          //           .then(() => {
          //             this.fetchData('rolesUsers', 1, 10)
          //             this.$message({
          //               type: 'success',
          //               message: '删除成功!'
          //             })
          //           })
          //       })
          //       .catch(() => {
          //         this.$message({
          //           type: 'info',
          //           message: '已取消删除'
          //         })
          //       })
          //   }
          // }
        ]
      }
    }
  ]
  roleColumn: Array<any> = [
    {
      prop: 'rolename',
      label: '角色群组'
    },
    {
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        return [
          {
            label: '编辑',
            color: 'primary',
            func: (index, row) => {
              this.pushEditRole(row.rolename)
            }
          }
        ]
      }
    }
  ]
  pushEditRole (rolename) {
    this.$router.push({ path: `/system/editRole/${rolename}` })
  }
  showEditUserDialog(row) {
    this.selectedUserId = row.id
    this.selectedName = row.username
    this.selectedEmail = row.email
    this.selectedUserRolename = row.rolename
    this.dialogUserEditVisible = true
  }
  submitEditUserGroup () {
    editAdminUserRole({
      user_id: this.selectedUserId,
      rolename: this.selectedUserRolename
    }).then(() => {
      this.updateList()
      this.dialogUserEditVisible = false
      this.$message({
        showClose: true,
        message: '修改成功',
        type: 'success'
      })
    })
  }
  submitEditRoleUsers () {
    const preSelectedRoleUserId = this.selectedRoleUsers.map(user => user.id)
    const submitArray = difference(preSelectedRoleUserId, this.selestedRoleUsersId)
    editRolesUsers({
      remove_users: submitArray.join(','),
      rolename: this.selectGroup
    }).then(() => {
      this.updateList()
      this.fetchData('rolesUsers', 1, 10)
      this.dialogGroupEditVisible = false
      this.$message({
        showClose: true,
        message: '修改成功',
        type: 'success'
      })
    })
  }
  showGroupUserDialog(row) {
    this.selectGroup = row.rolename
    this.selectedRoleUsers = row.users
    this.selestedRoleUsersId = row.users.map(user => user.id)
    this.dialogGroupEditVisible = true
  }
  handleClick(tab) {
    this.activeName = tab.name
  }
  created() {
    this.fetchData('adminUsers', 1, 10)
    this.fetchData('adminRoles', 1, 10)
    this.fetchData('rolesUsers', 1, 10)
    if (this.$route.query.adminRole) {
      this.activeName = 'adminRoles'
    }
  }
  updateList () {
    this.fetchData(this.activeName, 1, 10)
  }
  async fetchData(type, page, per_page) {
    let fetchName: Function = () => {}
    let ListKey = ''
    switch (type) {
      case 'adminUsers':
        fetchName = fetchAdminUsers({ page, per_page })
        ListKey = 'users'
        break
      case 'adminRoles':
        fetchName = fetchAdminRoles({ page, per_page })
        ListKey = 'roles'
        break
      case 'rolesUsers':
        fetchName = fetchRolesUsers({ page, per_page })
        ListKey = 'roles_users'
        break
    }
    const resData: any = await fetchName
    if (resData.ret === 1) {
      this[type] = {
        page: resData.data.page,
        per_page: resData.data.per_page,
        total: resData.data.total,
        data: resData.data[ListKey]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wraper {
  padding: 15px;
}
</style>
