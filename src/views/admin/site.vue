<template>
  <div class="admin-page">
    <div class="admin-page-heading">
      <div>
        <h2>网站管理</h2>
        <span>{{ tableData.length }} 个网站</span>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openAddDg">
        新增网站
      </el-button>
    </div>

    <div class="admin-toolbar">
      <el-form
        :inline="true"
        :model="formInline"
        class="admin-search-form"
        @submit.native.prevent
      >
        <el-form-item label="网站名称">
          <el-input
            v-model="formInline.title"
            clearable
            prefix-icon="el-icon-search"
            placeholder="输入名称筛选"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="!multipleSelection.length"
        @click="deleteSelected"
      >删除选中</el-button>
    </div>

    <div class="admin-table-wrap">
      <el-table
        @selection-change="handleSelectionChange"
        :data="tableData"
        empty-text="暂无网站"
      >
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column label="网站" min-width="180">
          <template slot-scope="scope">
            <div class="admin-site-cell">
              <img :src="scope.row.logoUrl" :alt="scope.row.title" />
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属分类" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.category">{{ scope.row.category.name }}</span>
            <span v-else class="admin-muted">未分类</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接地址" min-width="260" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="admin-table-link" :href="scope.row.url" target="_blank" rel="noopener noreferrer">
              {{ scope.row.url }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
        <el-table-column label="操作" width="130" align="right" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="startEdit(scope.row)">编辑</el-button>
            <el-button class="admin-text-danger" type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-if="showDg"
      :title="form.id ? '编辑网站' : '新增网站'"
      :visible.sync="showDg"
      width="640px"
      custom-class="admin-dialog admin-site-dialog"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" ref="formName" :model="form" label-width="92px">
        <el-form-item prop="title" label="名称">
          <el-input v-model="form.title" placeholder="请输入网站名称"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="链接地址">
          <el-input v-model="form.url" placeholder="https://"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="图标来源">
          <el-radio-group v-model="form.logotype" size="small">
            <el-radio-button :label="1">路径</el-radio-button>
            <el-radio-button :label="2">上传</el-radio-button>
          </el-radio-group>
          <upload
            ref="upload"
            @success="uploadSuccess"
            v-if="form.logotype == 2"
          ></upload>
          <el-input
            class="admin-logo-input"
            placeholder="assets/images/logos/example.png"
            v-if="form.logotype == 1"
            v-model="form.logo"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pid" label="所属分类">
          <div class="admin-category-selects">
            <el-select
              filterable
              v-model="form.pid"
              placeholder="一级分类"
              @change="selectChange"
            >
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-if="list2.length"
              v-model="form.pid2"
              placeholder="二级分类"
            >
              <el-option
                v-for="item in list2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDg = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/upload'
import {
  getSiteList,
  delSite,
  addSite,
  updateSite,
  getFirstCategoryList,
  getFileUrl,
} from '../../utils/supabase.js'

const defaultForm = () => ({
  id: null,
  category_id: null,
  sort: null,
  title: '',
  logo: '',
  is_used: null,
  pid: null,
  pid2: null,
  url: null,
  logotype: 1,
  description: '',
})

export default {
  name: 'site',
  components: {
    upload,
  },
  data() {
    return {
      tableData: [],
      formInline: {
        title: '',
      },
      form: defaultForm(),
      showDg: false,
      list: [],
      list2: [],
      rules: {
        title: [{ required: true, message: '请输入', trigger: 'blur' }],
        url: [{ required: true, message: '请输入', trigger: 'blur' }],
        pid: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      multipleSelection: [],
      files: [],
    }
  },
  methods: {
    uploadSuccess(files) {
      this.files = files
    },
    deleteSelected() {
      if (!this.multipleSelection.length) {
        this.$message.error('没有选中数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await delSite(ids)
            this.$message.success('操作成功')
            this.getList()
          } catch (error) {
            this.$message.error(error.message || '删除失败')
          }
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      this.$refs.formName.validate(async valid => {
        if (!valid) return

        const form = this.form
        if (!form.pid) {
          this.$message.error('请选择分类')
          return
        }
        if (!form.pid2 && this.list2.length > 0) {
          this.$message.error('请选择分类')
          return
        }

        let logo = this.form.logo
        if (this.form.logotype == 2 && this.files.length) {
          logo = this.files[0].path
        }

        const payload = {
          category_id: form.pid2 || form.pid,
          sort: form.sort,
          title: form.title,
          logo,
          is_used: form.is_used,
          url: form.url,
          id: form.id,
          logotype: form.logotype,
          description: form.description,
        }

        try {
          const data = this.form.id
            ? await updateSite(this.form.id, payload)
            : await addSite(payload, payload.category_id)
          if (data.length) {
            this.showDg = false
            this.getList()
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败')
        }
      })
    },
    openAddDg() {
      this.getCategory()
      this.form = defaultForm()
      this.files = []
      this.list2 = []
      this.showDg = true
      this.$nextTick(() => {
        if (this.$refs.formName) {
          this.$refs.formName.clearValidate()
        }
        if (this.$refs.upload) {
          this.$refs.upload.clean()
        }
      })
    },
    async getList() {
      try {
        const list = await getSiteList({ title: this.formInline.title })
        list.forEach(item => {
          item.logoUrl = item.logo
          if (item.logotype == 2) {
            item.logoUrl = getFileUrl(item.logo)
          }
        })
        this.tableData = list
      } catch (error) {
        this.$message.error(error.message || '获取网站失败')
      }
    },
    del(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await delSite([item.id])
            this.$message.success('操作成功')
            this.getList()
          } catch (error) {
            this.$message.error(error.message || '删除失败')
          }
        })
        .catch(() => {})
    },
    startEdit(data) {
      this.getCategory()
      const val = JSON.parse(JSON.stringify(data))
      this.form = val
      this.showDg = true
      if (val.category) {
        if (val.category.father) {
          val.pid = val.category.father.id
          this.selectChange(val.pid)
          val.pid2 = val.category_id
        } else {
          val.pid = val.category_id
        }
      }
      let files = []
      if (val.logotype == 2) {
        this.files = files = [
          {
            url: val.logoUrl,
            path: val.logo,
          },
        ]
        this.$nextTick(() => {
          if (this.$refs.upload) {
            this.$refs.upload.setFiles(files)
          }
        })
      }
    },
    async getCategory() {
      try {
        this.list = await getFirstCategoryList()
      } catch (error) {
        this.$message.error(error.message || '获取分类失败')
      }
    },
    selectChange(val) {
      this.list2 = []
      this.form.pid2 = null
      const data = this.list.find(item => item.id == val)
      this.list2 = data && data.children ? data.children : []
    },
  },
  mounted() {
    this.getCategory()
    this.getList()
  },
}
</script>

<style></style>
