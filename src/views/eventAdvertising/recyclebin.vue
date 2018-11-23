<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="24">
      <div class="grid-content bg-purple-light">
        <el-button type="primary" @click="allMethods(1)">
          全部恢复
        </el-button>
        <el-button type="danger" @click="allMethods(0)">
          全部删除
        </el-button>
      </div>
    </el-col>
  </el-row>
  <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" :hasSelection="true" @myEvent="batchDeletion" />
</div>
</template>

<script lang="ts" scoped>
import {
  recyclebinDelete,
  recyclebin
} from '@/api/eventAdvertising'
import TableCom from '@/components/TableCom'
import {
  Component,
  Vue
} from 'vue-property-decorator'
import * as moment from 'moment'
@Component({
  components: {
    TableCom
  }
})
export default class Index extends Vue {
  // 首次数据
  list: Object = {}
  tableData: any[] = []
  listLoading = true
  listQuery = 1
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'activity_name', // <String>  对应属性名
    label: '所属活动' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'advertisement_name', // <String>  对应属性名
    label: '广告名称' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'a_type', // <String>  对应属性名
    label: '广告形式', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      console.log(cellValue)
      switch (cellValue) {
        case 1:
          return '文本'
        case 2:
          return '主界面'
        case 3:
          return '主界面'
        default:
          return '-'
      }
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'update_at', // <String>  对应属性名
    label: '更新时间', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      console.log(typeof cellValue)
      if (!cellValue) return '-'
      return moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'update_user', // <String>  对应属性名
    label: '操作人' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'opration', // <String   >  对应属性名
    label: '操作', // <String>表头标签
    operations: (row) => {
      return [{
        label: '恢复',
        color: 'primary',
        func: (index, row) => {
          this.restoreData(row.id)
        }
      }, {
        label: '删除',
        color: 'danger',
        func: (index, row) => {
          this.removeData(row.id)
        }
      }]
    }
  }]
  created() {
    this.fetchData(1, 10)
  }
  fetchData(page, per_page) {
    this.listLoading = true
    recyclebin({
      page: page,
      per_page: per_page
    }).then(response => {
      this.list = {
        data: response.data.ad_list,
        page: response.data.page,
        per_page: response.data.per_page,
        total: response.data.total
      }
      this.listLoading = false
    })
  }
  // 删除
  removeData(index) {
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.fetchPublic(0, [index], '删除成功!')
    })
  }
  // 恢复
  restoreData(index) {
    this.fetchPublic(1, [index], '恢复成功!')
  }
  // 全部删除/恢复
  allMethods(num) {
    if (this.tableData.length > 0) {
      num >= 1 ? this.fetchPublic(1, this.tableData, '恢复成功') : this.fetchPublic(0, this.tableData, '删除成功')
    } else {
      this.$message.error('请选择内容')
    }
  }
  batchDeletion(elm) {
    this.tableData = elm.map(element => element.id)
    console.log(this.tableData)
  }
  fetchPublic(num, arr, str) {
    recyclebinDelete({
      handle_type: num,
      advertisement_list: arr
    }).then(response => {
      if (response.ret === 1) {
        this.$message({
          type: 'success',
          message: str
        })
        this.fetchData(1, 10)
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
}
</script>

<style scoped>
.header-bom {
  margin-bottom: 20px;
}

.block {
  margin-top: 10px;
}

.bg-purple-light {
  text-align: right;
}
</style>
