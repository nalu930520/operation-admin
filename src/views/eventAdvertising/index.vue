<template>
<div class="app-container">
  <el-row class="header-bom">
    <el-col :span="16">
      <el-alert :title='title' type="success" :closable="false">
      </el-alert>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple-light">
        <router-link class="el-button" to="/admanagement/recyclebin" tag="div">回收站</router-link>
        <router-link class="el-button el-button--primary" to="/admanagement/addactivity" tag="div">添加活动</router-link>
      </div>
    </el-col>
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
  advertising,
  removeList
} from '@/api/eventAdvertising'
import * as moment from 'moment'
@Component({
  components: {
    TableCom
  },
  filters: {}
})

export default class Index extends Vue {
  // 首次数据
  that = this
  list: any = {}
  titleObject: any = {
    p1: '10',
    p2: '10',
    p3: '10'
  }
  title: any = ''
  listLoading = true
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
    prop: 'ad_num', // <String>  对应属性名
    label: '广告数量' // <String>   表头标签
    // width: 100
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'online_num', // <String>  对应属性名
    label: '激活数量' // <String>   表头标签
    // width: 100
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'update_at', // <String>  对应属性名
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
        func: (index, row) => {
          this.editData(row.id, row.name)
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
  fetchData(page, per_page) {
    this.listLoading = true
    advertising({
      page: page,
      per_page: per_page
    }).then(response => {
      if (response.ret === 1) {
        console.log(response)
        this.list = {
          data: response.data.activity_list,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
        this.title = `共个 ${this.list.total} 活动 总计 ${response.data.all_ad_count} 个广告 ${response.data.all_online_num} 个激活`
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
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeList({
        activities_id: index
      }).then(response => {
        console.log(response)
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData(1, 10)
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
  editData(index, name) {
    this.$router.push({
      path: `/admanagement/advertisinglist/${index}/?name=${name}`
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
