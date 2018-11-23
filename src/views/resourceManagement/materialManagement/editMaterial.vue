<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="200px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="素材分类：" prop="classify">
        <el-select v-model.number="form.classify_id" placeholder="please select your zone">
          <el-option
            v-for="item in classifyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="素材类别：" prop="type">
        <el-select v-model.number="form.m_type" placeholder="please select your zone">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="form.m_type === 2 || form.m_type === 3">
        <el-form label-width="200px">
          <div v-for="(formUpload, index) in formUploads">
            <h4 style="text-align:center">图片素材{{index+1}}</h4>
            <el-form-item label="上传素材：" prop="upload">
              <el-form :ref="`formUpload${index}`" :model="formUpload" :rules="rulesUpload" label-width="200px" label-position="top">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="高度：" prop="height" label-width="80px">
                      <el-input v-model.number="formUpload.height">
                        <template slot="append">px</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="宽度：" prop="width" label-width="80px">
                      <el-input v-model.number="formUpload.width">
                        <template slot="append">px</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="中文图片：" prop="img">
                      <Upload
                        :actionLink="requestUrl"
                        :limit="1"
                        :fileList="formUpload.fileListCN"
                        :uploadData="formUpload"
                        :disabled="formUpload.height === '' || formUpload.width === ''"
                        :lang="1"
                        v-on:listenToChildEvent="getUploadFile"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="英文图片：" prop="img">
                      <Upload
                        :actionLink="requestUrl"
                        :limit="1"
                        :uploadData="formUpload"
                        :fileList="formUpload.fileListEN"
                        :disabled="formUpload.height === '' || formUpload.width === ''"
                        :lang="2"
                        v-on:listenToChildEvent="getUploadFile"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <i @click="removeMaterialForm(formUpload)" class="el-icon-remove-outline" size="medium"></i>
                  </el-col>
                </el-row>
              </el-form>
            </el-form-item>
          </div>
          <el-form-item style="text-align: center">
            <el-button @click="addMaterialForm" type="primary" icon="el-icon-circle-plus-outline" size="medium">添加素材</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form-item label="素材内容 - 中文：" prop="zhResource">
          <el-input type="textarea" rows="4" v-model="form.context_cn"></el-input>
        </el-form-item>
        <el-form-item label="素材内容 - 英文：" prop="enResource">
          <el-input type="textarea" rows="4" v-model="form.context_en"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注（可选）：" prop="note">
        <el-input type="textarea" rows="4" v-model="form.note"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { fetchClassifyList, addMaterial, updateMaterial, fetchMaterialDetail } from '@/api/material'
import Upload from '@/components/Upload'
import filter from 'lodash.filter'
import findIndex from 'lodash.findindex'

interface formObj {
  name: string;
  classify_id: number;
  m_type: number;
  images: any[];
  context_cn: string;
  context_en: string;
  note: string;
}
@Component({
  components: {
    Upload
  }
})
// const URL = process.env.BASE_API
export default class editMaterial extends Vue {
  material_id: string = ''
  classifyList: any[] = []
  uploadDisable: boolean = true
  requestUrl: string = 'https://op-api.mobimecdn.com/image'
  typeList: any[] = [{
    name: '文本',
    id: 1
  }, {
    name: '启动图',
    id: 2
  }, {
    name: '弹窗图',
    id: 3
  }, {
    name: '推送标题',
    id: 4
  }, {
    name: '推送内容',
    id: 5
  }, {
    name: '站内信标题',
    id: 6
  }, {
    name: '站内信内容',
    id: 7
  }]
  formUploads: any[] = [{
    id: '',
    height: '',
    width: '',
    fileListCN: [],
    fileListEN: []
  }]
  rulesUpload: any = {
    height: [
      { required: true, message: '请输入图片高度', trigger: 'change' },
      { type: 'number', message: '高度必须为数字值', trigger: 'change' }
    ],
    width: [
      { required: true, message: '请输入图片宽度', trigger: 'change' },
      { type: 'number', message: '宽度必须为数字值', trigger: 'change' }
    ]
  }
  form: formObj = {
    name: '',
    classify_id: 1,
    m_type: 1,
    images: [],
    context_cn: '',
    context_en: '',
    note: ''
  }
  rules: Object = {
    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    classify_id: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    m_type: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    context_cn: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    context_en: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
  }
  addMaterialForm() {
    this.formUploads.push({
      id: '',
      height: '',
      width: '',
      fileListCN: [],
      fileListEN: []
    })
  }
  getApiUrl() {
    const env = process.env.NODE_ENV
    switch (env) {
      case 'dev':
      case 'staging':
        this.requestUrl = 'https://staging-op-api.mobiapp.cn/image'
        break
      case 'preProduction':
        this.requestUrl = 'https://op-api.mobimecdn.com/image'
        break
      case 'production':
        this.requestUrl = 'https://op-api.mobimecdn.com/image'
        break
      default:
        break
    }
  }
  getUploadFile(res, type, lang, data) {
    if (res.ret === 1 && type === 1) {
      const index = findIndex(this.form.images, { language: lang, height: data.height, width: data.width })
      if (index >= 0) {
        this.form.images[index] = {id: res.data.image_id, language: lang, description: ''}
      } else {
        this.form.images.push({id: res.data.image_id, language: lang, description: ''})
      }
    } else {
      const index = findIndex(this.form.images, { language: lang, height: data.height, width: data.width })
      this.form.images.splice(index, 1)
    }
  }

  removeMaterialForm(item) {
    var index = this.formUploads.indexOf(item)
    if (index !== -1) {
      this.formUploads.splice(index, 1)
      this.form.images.splice(index, 1)
    }
  }

  created() {
    this.getApiUrl()
    this.getList()
    this.material_id = this.$route.query.materialId
    this.form.classify_id = Number(this.$route.query.classifyId)
    this.form.name = this.$route.query.materialName
    if (this.material_id) {
      fetchMaterialDetail({'material_id': this.material_id}).then(response => {
        if (response.ret === 1) {
          this.form.context_cn = response.data.context_cn
          this.form.context_en = response.data.context_en
          this.form.note = response.data.note
          this.form.m_type = response.data.m_type
          this.form.images = response.data.images.map(img => {
            return { id: img.id, language: img.language, description: img.description }
          })
          if (response.data.images.length > 0) {
            this.formUploads = []
          }
          response.data.images.forEach((img) => {
            const index = findIndex(this.formUploads, {height: img.height, width: img.width})
            if (index >= 0) {
              if (img.language === 1) {
                this.formUploads[index].fileListCN = [{url: img.url}]
              } else {
                this.formUploads[index].fileListEN = [{url: img.url}]
              }
            } else {
              if (img.language === 1) {
                this.formUploads.push({ id: img.id, height: img.height, width: img.width, fileListCN: [{url: img.url}] })
              } else {
                this.formUploads.push({ id: img.id, height: img.height, width: img.width, fileListEN: [{url: img.url}] })
              }
            }
          })
        }
      })
    }
    if (this.$route.name === 'add-material') {
      this.$route.meta.title = this.$route.query.classifyName + ' — 添加素材'
    } else {
      this.$route.meta.title = this.$route.query.classifyName + ' — 编辑素材'
    }
  }
  getList() {
    fetchClassifyList().then(response => {
      this.classifyList = response.data.class_list
    })
  }
  onSubmit() {
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        if (this.$route.name === 'add-material') {
          addMaterial(this.form).then(response => {
            if (response.ret === 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              const classify = filter(this.classifyList, { id: this.form.classify_id })
              this.$router.push({ path: `material-list?classifyId=${this.form.classify_id}&classifyName=${classify[0].name}` })
            } else {
              this.$message({
                message: response.error,
                type: 'error'
              })
            }
          })
        } else {
          const data = { ...this.form, material_id: this.material_id }
          updateMaterial(data).then(response => {
            if (response.ret === 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$message({
                message: response.error,
                type: 'error'
              })
            }
          })
        }
      }
    })
  }
  onCancel() {
    this.$message({
      message: 'cancel!',
      type: 'warning'
    })
  }
}
</script>

<style scoped>
.el-icon-circle-plus-outline, .el-icon-remove-outline{
  font-size: 40px;
  display: inline-block;
  margin-top: 100%;
  cursor: pointer;
}
.line{
  text-align: center;
}
.el-form-item .el-form-item{
  margin-bottom: 15px;
}
</style>
