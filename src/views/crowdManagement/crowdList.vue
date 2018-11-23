/* eslint-disable */
<template>
  <div class="app-container" v-loading="listLoading">
    <el-row class="header-bom">
      <el-col :span="18">
        <el-alert :title='title' type="success" :closable="false" show-icon>
        </el-alert>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-button>
            <router-link to="/crowdManagement/recyclebin">回收站</router-link>
          </el-button>
          <el-button type="primary">
            <router-link to="/crowdManagement/crowdEdit">添加人群</router-link>
          </el-button>
        </div>
      </el-col>
    </el-row>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange = "queryList"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as moment from 'moment'
import TableCom from '@/components/TableCom'
import {
  getCrowdList,
  delToReycleBin
} from '@/api/crowd'
@Component({
  components: {
    TableCom
  }
})
export default class CrowdList extends Vue {
  tableNotice: string = ''
  listLoading: boolean = false
  list:any = {}
  title: string = ''
  page:number = 1
  per_page:number = 10
  tablehead: Array<any> = [
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
          label: '编辑',
          color: 'primary',
          func: (index, row) => {
            this.editCrowd(index, row)
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
    const status = 1
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
      this.title = `共 ${resData.data.total} 个人群`
    } else {
      this.messageAlert(resData.error, 'error')
    }
    this.listLoading = false
  }
  deleteCrowdHandle(index, rowItem) {
    this.$confirm('此操作将删除该人群, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.delRequest(rowItem)
    }).catch(() => {
      this.messageAlert('已取消删除', 'info')
    })
  }
  async delRequest(rowItem) {
    this.listLoading = true
    const crowd_id = rowItem.id
    const resData:any = await delToReycleBin({ crowd_id })
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
  editCrowd(index, rowItem) {
    this.$router.push({
      path: `/crowdManagement/crowdEdit?crowd_id=${rowItem.id}`
    })
  }
}
</script>
<style lang='scss' scoped>
  .header-bom {
    margin-bottom: 20px;
  }
  .bg-purple-light {
    text-align: right;
  }
  .primary_btn{
    color:#fff;
  }
</style>
