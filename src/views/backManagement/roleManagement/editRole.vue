<template>
  <div class="editRoleWraper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加/编辑权限</span>
      </div>
      <h2>角色群组：{{rolename}}</h2>
      <el-tree
        :data="roleListData"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckKeys"
        ref="tree"
        :props="defaultProps">
      </el-tree>
      <div class="buttonWraper">
        <el-button type="primary" @click="submitRoles">修改</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { queryRoleList, updateAdminRole } from '@/api/backManagement'
@Component
export default class editRole extends Vue {
  roleListData: Array<any> = []
  defaultCheckKeys: Array<number> = []
  rolename: String = ''
  defaultProps: Object = {
    children: 'children',
    label: 'name'
  }
  created() {
    this.initData()
  }
  async initData() {
    this.rolename = this.$route.params.rolename
    const resQueryRoleList = await queryRoleList({ rolename: this.$route.params.rolename })
    const { permissions } = resQueryRoleList.data
    let defaultCheckKeys: any = []
    const formaterData = data => {
      return data.map((item) => {
        const result = {
          label: item.name,
          ...item
        }
        if (item.children && item.children.length !== 0) {
          item.children = formaterData(item.children)
        }
        if (item.permission === true && !item.children) {
          defaultCheckKeys.push(item.id)
        }
        return result
      })
    }
    this.roleListData = formaterData(permissions)
    this.defaultCheckKeys = defaultCheckKeys
  }
  async submitRoles () {
    const tree: any = this.$refs.tree
    const selectKey: Array<number> = tree.getCheckedKeys(true)
    const remove_permission_ids = this.defaultCheckKeys.filter(id => !selectKey.includes(id))
    await updateAdminRole({
      add_permission_ids: selectKey,
      remove_permission_ids,
      rolename: this.rolename
    })
    this.initData()
    this.$message({
      type: 'success',
      message: '修改成功!'
    })
  }
  async cancel () {
    this.$router.push('/system/management?adminRole=true')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.editRoleWraper {
  padding: 15px;
}
.buttonWraper {
  text-align: center;
  margin-top: 20px;
}
</style>
