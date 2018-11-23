<template>
  <TableCom
    :dataSource="adminUsers"
    :columns="userColumns"
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
export default class UserManagement extends Vue {
  @Prop() tableChange: Function
  @Prop() adminUsers: Object
  @Prop() userColumns: Array<any>
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
