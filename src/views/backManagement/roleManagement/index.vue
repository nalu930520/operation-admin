<template>
  <TableCom
    :dataSource="adminRoles"
    :columns="roleColumn"
    :handleTableChange="tableChange"
  />
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import TableCom from '@/components/TableCom'
  @Component({
    components: {
      TableCom
    }
  })
  export default class RoleManagement extends Vue {
    @Prop()
    adminRoles: Object
    @Prop()
    tableChange: Function
    @Prop()
    roleColumn: Array<any>
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  
</style>
