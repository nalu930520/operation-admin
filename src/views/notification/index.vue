<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="16">
      <el-alert :title='title' type="success" :closable="false">
      </el-alert>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple-light">
        <router-link class="el-button" to="/admanagement/push-recycle" tag="div">回收站</router-link>
        <router-link class="el-button el-button--primary" to="/admanagement/add-notification" tag="div">添加推送</router-link>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-form ref="form" :model="form" label-width="80px">
      <el-col :span="10">
        <el-form-item label="状态">
          <el-select v-model="form.region" placeholder="请选择活动区域">
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
import TableCom from '@/components/TableCom'
import {
  Component,
  Vue
} from 'vue-property-decorator'
import {
  pushList,
  removePushList
} from '@/api/notification'
import * as moment from 'moment'
@Component({
  components: {
    TableCom
  },
  filters: {}
})

export default class Index extends Vue {
  list: any = {}
  title: any = ''
  form: any = {
    region: '4'
  }
  listLoading = true
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID' // <String>   表头标签
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
          return '-'
      }
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'perform_time', // <String>  对应属性名
    label: '发布时间', // <String>   表头标签
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
    formatter: (row, column, cellValue, index) => {
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
    prop: 'opration', // <String>  对应属性名
    label: '操作', // <String>表头标签
    operations: (row) => {
      return [{
        label: '编辑',
        color: 'primary',
        disabled: row.push_status === 1 ? 'true' : 'false',
        func: (index, row) => {
          this.editData(row.id)
        }
      },
      {
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
    this.listLoading = true
    this.form.region && this.form.region !== '4' ? push_status = this.form.region : push_status = null
    pushList({
      page,
      per_page,
      push_status
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.info,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
        this.title = `共个 ${this.list.total} 推送`
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  // 删除
  removeData(index: number) {
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      removePushList({
        status: 0,
        push_id_list: [index]
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData(1, 10, this.form.region)
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
    })
  }
  // 编辑
  editData(index: any) {
    this.$router.push({
      path: `/admanagement/add-notification/${index}`
    })
  }
  // 查询
  onSubmit() {
    this.fetchData(1, 10, this.form.region)
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
