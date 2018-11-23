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
        <span class="text">{{data.name}}</span>
      </li>
      <li>
        <span class="title">素材分类：</span>
        <span class="text">{{classifyName}}</span>
      </li>
      <li>
        <span class="title">素材类别：</span>
        <span class="text">图片</span>
      </li>
      <li>
        <span class="title">素材预览：</span>
        <el-row>
          <el-col v-for="item in data.images" :span="6" :gutter="20" key="item.url">
            <p class="text">尺寸{{item.width}}*{{item.height}} - {{item.language === 1 ? '中文': '英文'}}</p>
            <img style="width: 200px; height: 200px" :src="item.url">
          </el-col>
        </el-row>
      </li>
      <li>
        <span class="title">备注：</span>
        <span class="text">{{data.note}}</span>
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
import imgNotFound from '@/assets/404_images/404.png'
@Component
export default class checkMaterialImg extends Vue {
  img404 = imgNotFound
  classifyName: string = ''
  classifyId: string = ''
  materialId: string = ''
  data: any = {}
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
    if (this.materialId) {
      fetchMaterialDetail({'material_id': this.materialId}).then(response => {
        if (response.ret === 1) {
          this.data = response.data
        }
      })
    }
  }
}
</script>
