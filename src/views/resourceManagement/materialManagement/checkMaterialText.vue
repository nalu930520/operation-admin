<template>
  <div class="app-container">
    <el-alert
      title="当前状态：待审核"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
    <br/>
    <ul class="list">
      <li>
        <span class="title">素材名称：</span>
        <span class="text">{{material.name}}</span>
      </li>
      <li>
        <span class="title">素材分类：</span>
        <span class="text">{{material.classify}}</span>
      </li>
      <li>
        <span class="title">素材类别：</span>
        <span class="text">{{material.m_type | typeFilter}}</span>
      </li>
      <li>
        <span class="title">素材内容 - 中文：</span>
        <span class="text">{{material.context_cn}}</span>
      </li>
      <li>
        <span class="title">素材内容 - 英文：</span>
        <span class="text">{{material.context_en}}</span>
      </li>
      <li>
        <span class="title">备注：</span>
        <span class="text">{{material.note}}</span>
      </li>
    </ul>
    <el-form ref="form" style="margin-top: 3rem">
      <el-form-item>
        <el-button type="primary" @click="onSubmit(2)">审核通过</el-button>
        <el-button type="danger" @click="onSubmit(3)">审核不通过</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .list{
    list-style: none;
    padding-left: 0;
    margin: 0;
    li{
      line-height: 2;
    }
    .title{
      color:#000;
    }
    .text{
      color:#666;
    }
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { fetchMaterialDetail, updateMaterialStatus } from '@/api/material'

@Component({
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
export default class checkMaterialText extends Vue {
  materialId: string = ''
  classifyId: string = ''
  classifyName: string = ''
  material: any = {}
  onSubmit(status) {
    updateMaterialStatus({material_id: this.materialId, check_status: status}).then(response => {
      if (response.ret === 1) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$router.push({
          path: `material-list?classifyId=${this.classifyId}&classifyName=${this.classifyName}`
        })
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  created() {
    this.materialId = this.$route.query.materialId
    this.classifyId = this.$route.query.classifyId
    this.classifyName = this.$route.query.classifyName
    this.$route.meta.title = this.$route.query.materialName + ' — 审核素材'
    fetchMaterialDetail({'material_id': this.materialId}).then(response => {
      if (response.ret === 1) {
        console.log('respone:', response)
        this.material = response.data
      }
    })
  }
}
</script>
