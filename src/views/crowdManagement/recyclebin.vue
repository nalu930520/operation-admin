<template>
  <div class="app-container"  v-loading="listLoading">
    <el-row class="header-bom">
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <el-button @click="recoverAll">全部恢复</el-button>
          <el-button type="danger" @click="deleteAll">全部删除</el-button>
        </div>
      </el-col>
    </el-row>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange = "queryList"/>
  </div>
</template>

<script lang="ts" scoped>
import TableCom from '@/components/TableCom'
import { Component, Vue } from 'vue-property-decorator'
import * as moment from 'moment'
import {
  getCrowdList,
  deleteCrowd,
  trashCrowd,
  batchOperaCrowd
} from '@/api/crowd'
@Component({
  components: {
    TableCom
  }
})
export default class eventAdvertising extends Vue {
  // 首次数据
  list:any = {}
  listLoading: Boolean = false
  page:number = 1
  per_page:number = 10
  tablehead: any[] = [
    {
      hasSort: false, // <Boolean> 是否排序
      isShow: true, // <Boolean> 是否展示
      prop: 'id', // <String>  对应属性名
      label: 'ID' // <String>   表头标签
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'name',
      label: '人群名称'
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'updated_at',
      label: '更新时间',
      formatter(row, column, cellValue, index) {
        return moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'operator_name',
      label: '操作人'
    },
    {
      hasSort: false,
      isShow: true,
      prop: 'opration',
      label: '操作',
      operations: (row) => {
        return [{
          label: '恢复',
          color: 'primary',
          func: (index, row) => {
            this.repayCrowdHandle(index, row)
          }
        }, {
          label: '删除',
          color: 'danger',
          func: (index, row) => {
            this.deleteCrowdHandle(index, row)
          }
        }]
      }
    }
  ]
  mounted() {
    this.queryList(1, 10)
  }
  async queryList(page, per_page) {
    this.listLoading = true
    const status = 0
    const resData = await getCrowdList({ status, page, per_page })
    if (resData.ret === 1) {
      this.list = {
        data: resData.data.crowds,
        page: resData.data.page,
        per_page: resData.data.per_page,
        total: resData.data.total
      }
      this.page = resData.data.page
      this.per_page = resData.data.per_page
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  deleteCrowdHandle(index, rowItem) {
    this.confirmAlert('删除该人群', '已取消删除', () => {
      this.delRequest(rowItem.id)
    })
  }
  repayCrowdHandle(index, rowItem) {
    this.confirmAlert('恢复该人群', '已取消恢复', () => {
      this.recoverRequest(rowItem.id)
    })
  }
  async delRequest(crowd_id) {
    this.listLoading = true
    const resData:any = await deleteCrowd({ crowd_id })
    if (resData.ret === 1) {
      this.messageAlert('删除成功', 'success', false, () => {
        this.page = 1
        this.queryList(this.page, this.per_page)
      })
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  async recoverRequest(recover_id) {
    this.listLoading = true
    const resData:any = await trashCrowd({ recover_id })
    if (resData.ret === 1) {
      this.messageAlert('恢复成功', 'success', false, () => {
        this.page = 1
        this.queryList(this.page, this.per_page)
      })
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  recoverAll() {
    if (this.list && this.list.total === 0) {
      this.messageAlert('当前回收站为空', 'warning')
      return
    }
    this.confirmAlert('恢复所有人群', '已取消恢复', () => {
      this.recoverAllRequest()
    })
  }
  deleteAll() {
    if (this.list && this.list.total === 0) {
      this.messageAlert('当前回收站为空', 'warning')
      return
    }
    this.confirmAlert('删除所有人群', '已取消删除', () => {
      this.deleteAllRequest()
    })
  }
  async recoverAllRequest() {
    this.listLoading = true
    const handle_type = 1
    const resData:any = await batchOperaCrowd({ handle_type })
    if (resData.ret === 1) {
      this.messageAlert('批量恢复成功', 'success', false, () => {
        this.page = 1
        this.queryList(this.page, this.per_page)
      })
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  async deleteAllRequest() {
    this.listLoading = true
    const handle_type = 0
    const resData:any = await batchOperaCrowd({ handle_type })
    if (resData.ret === 1) {
      this.messageAlert('批量删除成功', 'success', false, () => {
        this.page = 1
        this.queryList(this.page, this.per_page)
      })
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  confirmAlert(text: string, cancelText:string, cb?:Function) {
    this.$confirm(`此操作将${text}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      cb && cb()
    }).catch(() => {
      this.messageAlert(cancelText || '已取消', 'info')
    })
  }
  messageAlert(message:string, type?:any, showClose?:boolean, cb?:Function) {
    if (!cb) {
      cb = () => {}
    }
    this.$message({
      message: message,
      type: type || 'warning',
      showClose: showClose || false,
      onClose: cb()
    })
  }
}
</script>

<style scoped>
.header-bom {
  margin-bottom: 20px;
}
.bg-purple-light {
  text-align: right;
}
</style>
