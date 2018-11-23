<template>
  <div class="app-container">
    <el-row class="header-bom">
      <el-col :span="18">
        <el-alert :title="'共 '+list.total+' 条红点记录'" type="info" :closable="false" show-icon>
        </el-alert>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <router-link  class="el-button el-button--primary" to="/updatemanagement/addpointer">添加红点</router-link>
        </div>
      </el-col>
    </el-row>
  </el-row>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="getList" />
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
import { getRedDot, getRedDotTree, setRedDotTree, lightRedDotAgain, deleteRedDot } from '@/api/updateManagement'
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import * as moment from 'moment'

@Component({
  components: {
    TableCom
  }
})
export default class Redpointer extends Vue {
  // 首次数据
  classifyId: string = ''
  classifyName: string = ''
  list: Object = {}
  listLoading = true
  title: string = ''
  tree: any = []
  tablehead: any[] = [{
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'path', // <String>  对应属性名
    label: '功能路径' // <String>   表头标签
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'updated_at', // <String>  对应属性名
    label: '最近点亮时间', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return moment.unix(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    hasSort: false, // <Boolean> 是否排序
    isShow: true, // <Boolean> 是否展示
    prop: 'operation_user', // <String>  对应属性名
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
        label: '再次点亮',
        color: 'primary',
        func: (index, row) => {
          this.lightAgain(row)
        }
      }, {
        label: '删除',
        color: 'danger',
        func: (index, row) => {
          this.removeRedDot(row)
        }
      }]
    }
  }]
  created() {
    this.getList(1, 10)
    getRedDotTree().then((res) => {
      if (res.data.tree) {
        this.tree.push(JSON.parse(res.data.tree))
      } else {
        this.tree.push({id: 'mobi', label: 'Mobi'})
      }
    })
  }
  getList(page, per_page) {
    this.listLoading = true
    getRedDot({
      page: page,
      per_page: 10
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.data,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
        this.title = `共 ${response.data.total} 个素材`
      }
      this.listLoading = false
    })
  }
  setTreeNodeDisabled(nodes, id, isDisabled) {
    for (let i = 0, length = nodes.length; i < length; i++) {
      if (nodes[i].id === id) {
        nodes[i].disabled = isDisabled
        return
      } else {
        this.setTreeNodeDisabled(nodes[i].children, id, isDisabled)
      }
    }
  }
  // 删除
  removeRedDot(data) {
    this.$confirm('你确认要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteRedDot({
        id: data.id
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.setTreeNodeDisabled(this.tree, data.path, false)
          this.getList(1, 10)
          setTimeout(() => {
            setRedDotTree({ tree: this.tree }).then((res) => {
              if (res.ret === 1) {
                this.$message({
                  message: '更新树成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.error,
                  type: 'error'
                })
              }
            })
          }, 2000)
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
    })
  }
  lightAgain(data) {
    this.$confirm('你确认要再次点亮?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      lightRedDotAgain({
        id: data.id
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '再次点亮成功!'
          })
          this.setTreeNodeDisabled(this.tree, data.path, true)
          this.getList(1, 10)
          setTimeout(() => {
            setRedDotTree({ tree: this.tree }).then((res) => {
              if (res.ret === 1) {
                this.$message({
                  message: '更新树成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.error,
                  type: 'error'
                })
              }
            })
          }, 2000)
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
