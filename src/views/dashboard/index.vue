<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{name}}</div>
    <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <!-- <p>已激活广告</p>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
    <p>最近推送通知</p>
    <TableCom :dataSource="list" :columns="tablehead" :handleTableChange="fetchData" />
    <p>安卓版本</p>
    <el-alert
      title="iOS企业版：2.5.1   安卓版：2.5.0"
      type="info"
      :closable="false"
    >
    </el-alert>
    <p>版本更新提示</p>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>iOS</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>安卓</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script lang="ts">
import { Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import TableCom from '@/components/TableCom'
import { advertising } from '@/api/eventAdvertising'
import * as moment from 'moment'

@Component({
  components: {
    TableCom
  }
})

export default class dashboard extends Vue {
  @Getter('name') name
  @Getter('roles') roles
  list: any = {}
  listLoading = true
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
    label: '类别' // <String>   表头标签
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
        label: '查看',
        color: 'primary',
        func: (index, row) => {
          this.editData(row.id)
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
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  // 编辑
  editData(index) {
    this.$router.push({
      path: `/admanagement/advertisinglist/${index}`
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
