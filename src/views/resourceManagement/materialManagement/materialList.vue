<template>
  <div class="app-container">
    <el-row class="header-bom">
      <el-col :span="18">
        <el-alert :title='title' type="success" :closable="false" show-icon>
        </el-alert>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <router-link class="el-button" :to="`update-classify?classifyId=${classifyId}&classifyName=${classifyName}`">
            修改分类名称
          </router-link>
          <router-link  class="el-button el-button--primary" :to="`add-material?classifyId=${classifyId}&classifyName=${classifyName}`">添加素材</router-link>
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
import { fetchMaterialList, deleteMaterial, updateMaterialStatus } from '@/api/material'
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import * as moment from 'moment'

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
    },
    checkStatusFilter(status) {
      const statusMap = {
        0: '草稿',
        1: '待审核',
        2: '审核通过',
        3: '审核不通过'
      }
      return statusMap[status]
    }
  }
})
export default class materialList extends Vue {
  // 首次数据
  classifyId: string = ''
  classifyName: string = ''
  list: Object = {}
  listLoading = true
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
    prop: 'm_type', // <String>  对应属性名
    label: '类别', // <String>   表头标签
    formatter: (row, column, cellValue, index) => {
      return this.$options.filters ? this.$options.filters.typeFilter(row.m_type) : ''
    },
    width: 90
  },
  {
    hasSort: false,
    isShow: true,
    prop: 'check_status',
    label: '状态',
    formatter: (row) => {
      return this.$options.filters ? this.$options.filters.checkStatusFilter(row.check_status) : ''
    },
    width: 120
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
      if (row.check_status === 1) {
        return [{
          label: '审核',
          color: 'warning',
          func: (index, row) => {
            this.checkData(row)
          }
        }, {
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
      } else if (row.check_status === 0) {
        return [{
          label: '提交审核',
          func: (index, row) => {
            this.submitCheck(row)
          }
        }, {
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
      } else {
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
    }
  }]
  created() {
    console.log('route:', this.$route)
    this.classifyId = this.$route.query.classifyId
    this.classifyName = this.$route.query.classifyName
    this.$route.meta.title = this.classifyName
    this.getList(this.classifyId, 1, 10)
  }
  getList(id, page, per_page) {
    this.listLoading = true
    fetchMaterialList({
      classify_id: id,
      page: page,
      per_page: 10
    }).then(response => {
      if (response.ret === 1) {
        this.list = {
          data: response.data.material_list,
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total
        }
        this.title = `共 ${response.data.total} 个素材`
      }
      this.listLoading = false
    })
  }
  submitCheck(data) {
    updateMaterialStatus({material_id: data.id, check_status: 1}).then(response => {
      if (response.ret === 1) {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.getList(this.classifyId, 1, 10)
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  checkData(data) {
    let link
    if (data.m_type === 2 || data.m_type === 3) {
      link = `check-img?classifyId=${this.classifyId}&classifyName=${this.classifyName}&materialId=${data.id}&materialName=${data.name}`
    } else {
      link = `check-text?classifyId=${this.classifyId}&classifyName=${this.classifyName}&materialId=${data.id}&materialName=${data.name}`
    }
    this.$router.push({
      path: link
    })
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
        status: 0
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList(this.classifyId, 1, 10)
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
    // const that = this
    // console.log('edit material')
    // this.classifyId = this.$route.query.classifyId
    // this.classifyName = this.$route.query.classifyName
    this.$router.push({
      path: `edit-material?classifyId=${this.classifyId}&classifyName=${this.classifyName}&materialId=${data.id}&materialName=${data.name}`
    })
  }
}

</script>
