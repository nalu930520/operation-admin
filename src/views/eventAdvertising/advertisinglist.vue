<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="16">
      <el-alert :title='title' type="success" :closable="false">
      </el-alert>
    </el-col>
    <el-col :span="6">
       <div class="grid-content bg-purple-light">
        <el-button @click="editName">
          修改活动名称
        </el-button>
        <el-button type="primary" @click="addName">
          添加广告
        </el-button>
      </div>
    </el-col>
  </el-row>
  <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
</div>
</template>

<script lang="ts" scoped>
import {
  advertisingList,
  removeAds
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
  },
  filters: {}
})
export default class Index extends Vue {
  // 首次数据
  list: Object = {}
  listLoading = true
  title: any = ''
  listQuery = 1
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID' // <String>   表头标签
    // width: 200
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'name', // <String>  对应属性名
    label: '名称' // <String>   表头标签
    // width: 200
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
          return '文字横幅'
        case 2:
          return '启动界面'
        case 3:
          return '首页弹窗'
        default:
          return '-'
      }
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'online_status', // <String>  对应属性名
    label: '状态', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      switch (cellValue) {
        case 2:
          return '草稿'
        case 1:
          return '已发布'
        case 3:
          return '已激活'
        case 4:
          return '已下架'
        default:
          return '-'
      }
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'start_time', // <String>  对应属性名
    label: '定时任务', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      let startTime = row.start_time ? (moment.unix(row.start_time).format('YYYY-MM-DD HH:mm:ss') + ' 激活 ') : '-'
      let endTime = row.end_time ? (moment.unix(row.end_time).format('YYYY-MM-DD HH:mm:ss') + '下架') : '-'
      return startTime + endTime
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
    prop: 'opration', // <String>  对应属性名
    label: '操作', // <String>表头标签
    operations: (row) => {
      return [{
        label: '编辑',
        color: 'primary',
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
    this.fetchData(1, 10, this.$route.params.id)
    if (this.$route.query.name) {
      this.$route.meta.title = '广告列表-' + this.$route.query.name
    }
  }
  fetchData(page, per_page, id) {
    this.listLoading = true
    advertisingList({
      page: page,
      per_page: per_page,
      activities_id: this.$route.params.id
    }).then(response => {
      console.log(response.data)
      this.list = {
        data: response.data.advertisement_list,
        page: response.data.page,
        per_page: response.data.per_page,
        total: response.data.total
      }
      this.title = `共个 ${response.data.ad_count} 广告 ${response.data.online_num} 个激活`
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
      removeAds({
        advertisement_id: index
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData(1, 10, this.$route.params.id)
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
  editData(index) {
    this.$router.push({
      path: `/admanagement/Addads/${index}?add=${this.$route.params.id}&name=${this.$route.query.name}&edit=1`
    })
  }
  // 修改名称
  editName() {
    this.$router.push({
      path: `/admanagement/Editname/${this.$route.params.id}`
    })
  }
  // 添加广告
  addName() {
    this.$router.push({
      path: `/admanagement/Addads/?add=${this.$route.params.id}&name=${this.$route.query.name}`
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
