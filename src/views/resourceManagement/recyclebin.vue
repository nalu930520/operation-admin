<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="24">
      <div class="grid-content bg-purple-light">
        <el-button type="primary" @click="handleAllData(1)">
          批量恢复
        </el-button>
        <el-button type="danger" @click="handleAllData(-1)">
          批量删除
        </el-button>
      </div>
    </el-col>
  </el-row>
  <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="getList" :hasSelection="true" @myEvent="batchDeletion" />
</div>
</template>

<script lang="ts" scoped>
import TableCom from '@/components/TableCom'
import { fetchTrashList, deleteMaterial, updateAllTrashData } from '@/api/material'
import * as moment from 'moment'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    TableCom
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        1: '文本',
        2: '启动图',
        3: '弹窗图',
        4: '推送标题',
        5: '推送内容',
        6: '站内信标题',
        7: '站内信内容'
      }
      return typeMap[type]
    }
  }
})
export default class recyclebin extends Vue {
  // 首次数据
  list: Object = {}
  listLoading = true
  listQuery = 1
  tableData = []
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'classify', // <String>  对应属性名
    label: '素材分类' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'name', // <String>  对应属性名
    label: '素材名称' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'm_type', // <String>  对应属性名
    label: '素材类别', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.typeFilter(row.m_type) : ''
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'update_at', // <String>  对应属性名
    label: '更新时间', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return moment.unix(row.update_at).format('YYYY-MM-DD HH:mm:ss')
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
    width: '250',
    operations: (row) => {
      return [{
        label: '恢复',
        color: 'primary',
        func: (index, row) => {
          this.recoverData(row.id)
        }
      }, {
        label: '永久删除',
        color: 'danger',
        func: (index, row) => {
          this.removeData(row.id)
        }
      }]
    }
  }]
  created() {
    this.getList(1, 10)
  }
  batchDeletion(elm) {
    this.tableData = elm.map(element => element.id)
  }
  // 删除
  removeData(id) {
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteMaterial({
        material_id_list: [id],
        status: -1
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.getList(1, 10)
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
    })
  }
  // 删除
  recoverData(id) {
    deleteMaterial({
      material_id_list: [id],
      status: 1
    }).then(response => {
      if (response.ret === 1) {
        this.$message({
          type: 'success',
          message: `恢复成功!`
        })
        this.getList(1, 10)
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  getList(page, per_page) {
    this.listLoading = true
    fetchTrashList({
      page: page,
      per_page: 10
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.trash_list,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
      }
      this.listLoading = false
    })
  }
  handleAllData(status) {
    const text = status === 1 ? '恢复' : '删除'
    this.$confirm(`你确认要${text}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      updateAllTrashData({
        material_id_list: this.tableData,
        status: status
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: `${text}成功!`
          })
          this.getList(1, 10)
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
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
