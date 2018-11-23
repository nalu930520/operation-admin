<template>
  <div class="groupManagementWraper">
    <!-- <el-button
      type="primary"
      icon="el-icon-plus" 
      @click="showAddGroupDialog"
    >添加群组</el-button> -->
    <TableCom
      :dataSource="rolesUsers"
      :columns="groupColumn"
      :handleTableChange="tableChange"
    />
    <el-dialog title="添加群组" :visible.sync="dialogFormVisible">
      <el-form :model="addGroupform" ref="addGroupform">
        <el-form-item label="群组名称" :label-width="formLabelWidth">
          <el-input v-model="addGroupform.rolename" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加成员" :label-width="formLabelWidth">
          <el-select
            v-model="addGroupform.add_users"
            placeholder="选择成员"
            multiple
          >
            <el-option
              v-for="item in adminUsersPublic"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import {
  fetchAdminUsersPublic,
  createRole,
  editRolesUsers
} from '@/api/backManagement'
@Component({
  components: {
    TableCom
  }
})
export default class GroupManagement extends Vue {
  @Prop() groupColumn: Array<any>
  @Prop() rolesUsers: Object
  @Prop() tableChange: Function
  dialogFormVisible: Boolean = false
  addGroupform: any = {
    rolename: '',
    add_users: []
  }
  adminUsersPublic: Array<any> = []
  formLabelWidth: String = '120px'
  async showAddGroupDialog() {
    const resAdminUsersPublic: any = await fetchAdminUsersPublic()
    this.adminUsersPublic = resAdminUsersPublic.users
    this.dialogFormVisible = true
  }
  async submitCreateRole() {
    await createRole({ rolename: this.addGroupform.rolename })
    if (this.addGroupform.add_users.length) {
      // 有选择用户就创建
      await editRolesUsers(this.addGroupform)
    }
    this.dialogFormVisible = false
    this.addGroupform.rolename = ''
    this.addGroupform.add_users = []
    this.$emit('updateList')
    this.$message({
      type: 'success',
      message: '创建成功!'
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
