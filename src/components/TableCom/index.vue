<template>
<div>
  <el-table :data="dataSource.data" style="width:100%" @selection-change="handleSelectionChange">
    <el-table-column v-if="hasSelection" type="selection" width="55">
    </el-table-column>
    <template v-for="(column) in columns">
      <el-table-column  v-if="column.operations" :prop="column.prop" :width="column.width" :key="column.id" :label="column.label">
        <template slot-scope="scope">
          <el-button :disabled="operate.disabled === 'true' ? true :false  || false"  v-for="operate in column.operations(scope.row)" :key="operate.id" size="small"
            @click="operate.func(scope.$index, scope.row)" :type="operate.color">{{operate.label}}</el-button>
        </template>
      </el-table-column>
      <el-table-column :key="column.id" v-else :prop="column.prop" :width="column.width" :label="column.label" :formatter="column.formatter">
      </el-table-column>
    </template>
  </el-table>
  <div class="block">
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="dataSource.page"
      :page-size="dataSource.per_page"
      layout="total, prev, pager, next"
      :total="dataSource.total">
    </el-pagination>
  </div>
</div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch
} from 'vue-property-decorator'
@Component
export default class tableCom extends Vue {
  @Prop() handleTableChange: Function
  @Prop() hasSelection: boolean
  @Prop({
    default: []
  })
  columns: any[]
  @Prop({
    default: []
  })
  dataSource: any
  multipleSelection: any[] = []
  @Watch('multipleSelection')
  onChildChanged(val: string, oldVal: string) {
    this.$emit('myEvent', val)
  }
  handleSizeChange(val) {
    console.log(`每页 ${val} 条`)
  }
  handleSelectionChange(val) {
    this.multipleSelection = val
  }
  handleCurrentChange(val) {
    this.handleTableChange(val, this.dataSource.per_page)
    console.log(`当前页: ${val}`)
  }
  handleDelete(index, dom) {
    console.log(index) // 当前索引
    console.log(dom) // 当前DOM数据
  }
}
</script>

<style>
.block {
  text-align: right;
  margin-top: 20px;
}
</style>
