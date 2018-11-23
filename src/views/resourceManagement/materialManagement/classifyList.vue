<template>
  <div class="app-container">
    <el-row class="header-bom">
      <el-col :span="18">
        <el-alert :title='title' type="success" :closable="false" show-icon>
        </el-alert>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <router-link class="el-button" to="/resourcemanagement/recyclebin">回收站</router-link>
          <router-link class="el-button el-button--primary" to="/resourcemanagement/add-classify">添加分类</router-link>
        </div>
      </el-col>
    </el-row>
  </el-row>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="getList"/>
  </div>
</template>
<style scoped>
.grid-content{
  margin-bottom: 1.5rem;
}
.bg-purple-light {
  text-align: right;
}
</style>
<script lang="ts">
import { fetchClassifyList, removeClassify } from '@/api/material'
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import * as moment from 'moment'

@Component({
  components: {
    TableCom
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  }
})
export default class materialList extends Vue {
  // 首次数据
  list: any = {}
  listLoading = true
  listQuery = 1
  title: string = ''
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'id', // <String>  对应属性名
    label: 'ID', // <String>   表头标签
    width: 80
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'name', // <String>  对应属性名
    label: '名称', // <String>   表头标签
    width: 160
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'count', // <String>  对应属性名
    label: '素材数量', // <String>   表头标签
    width: 90
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
    operations: (row) => {
      return [{
        label: '编辑',
        color: 'primary',
        func: (index, row) => {
          this.editData(row)
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
    this.getList(1, 10)
  }
  getList(page, per_page) {
    this.listLoading = true
    fetchClassifyList({
      page: page,
      per_page: 10
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.class_list,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
        this.title = `共 ${response.data.total} 个分类 总计 ${response.data.material_count} 个素材`
      } else {
        this.$notify.error({
          title: '错误',
          message: response.error
        })
      }

      this.listLoading = false
    })
  }
  // 删除
  removeData(id) {
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeClassify({
        classify_id: id
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
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
  // 编辑
  editData(data) {
    this.$router.push({
      path: `material-list?classifyId=${data.id}&classifyName=${data.name}`
    })
  }
}

</script>
