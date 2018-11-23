<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="18">
      <el-alert :title="'回收站中共 '+ list.total+ ' 个推送'" type="info" :closable="false">
      </el-alert>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple-light">
        <el-button type="danger" @click="allDelete">
          全部删除
        </el-button>
      </div>
    </el-col>
  </el-row>
  <el-row style="margin-top:20px;">
    <el-form ref="form" :model="form" label-width="80px">
      <el-col :span="10">
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择活动区域">
            <el-option label="全部" value="4"></el-option>
            <el-option label="草稿" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="定时发布" value="2"></el-option>
            <el-option label="发布失败" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
  <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
</div>
</template>

<script lang="ts" scoped>
import {
  recyclebinDelete,
  pushRecycling
} from '@/api/notification'
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
  form: any = {
    status: '4'
  }
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID', // <String>   表头标签
    width: '50px'
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'name', // <String>  对应属性名
    label: '名称' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'push_status', // <String>  对应属性名
    label: '状态', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      switch (cellValue) {
        case 0:
          return '草稿'
        case 1:
          return '已发布'
        case 2:
          return '定时发布'
        case 3:
          return '发布失败'
        default:
          return '草稿'
      }
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'perform_time', // <String>  对应属性名
    label: '发布时间', // <String>   表头标签
    width: '160px',
    formatter: (row, column, cellValue, index) => {
      if (!cellValue) return '-'
      return moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'update_time', // <String>  对应属性名
    label: '更新时间', // <String>   表头标签
    width: '160px',
    formatter: (row, column, cellValue, index) => {
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
    width: '200px',
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
  fetchData(page, per_page, push_status = null) {
    this.form.status && this.form.status !== '4' ? push_status = this.form.status : push_status = null
    pushRecycling({
      push_status,
      page,
      per_page
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.info,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  // 删除
  removeData(index) {
    this.$confirm('你确认永久删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      console.log(1)
      this.fetchPublic(-1, [index], false, '删除成功!')
    })
  }
  // 恢复
  restoreData(index) {
    this.$confirm('你确认恢复?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      this.fetchPublic(1, [index], false, '恢复成功!')
    })
  }
  // 全部删除
  allDelete() {
    this.$confirm('你确认永久删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      this.fetchPublic(-1, null, true, '删除成功')
    })
  }

  fetchPublic(status, list, isAll, str) {
    recyclebinDelete({
      status: status, // 0:删除，1: 恢复， -1: 永久删除
      push_id_list: list,
      is_all: isAll
    }).then(response => {
      if (response.ret === 1) {
        this.$message({
          type: 'success',
          message: str
        })
        this.fetchData(1, 10, this.form.status)
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  // 查询
  onSubmit() {
    this.fetchData(1, 10, this.form.status)
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
