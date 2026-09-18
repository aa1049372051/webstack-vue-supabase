<template>
  <div class="admin-page">
    <div class="admin-page-heading">
      <div>
        <h2>分类管理</h2>
        <span>{{ tableData.length }} 个分类</span>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openAddDg">
        新增分类
      </el-button>
    </div>

    <div class="admin-toolbar">
      <el-form
        :inline="true"
        :model="formInline"
        class="admin-search-form"
        @submit.native.prevent
      >
        <el-form-item label="分类名称">
          <el-input
            v-model="formInline.name"
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
        empty-text="暂无分类"
      >
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="140"></el-table-column>
        <el-table-column prop="en_name" label="英文名称" min-width="150"></el-table-column>
        <el-table-column label="父级" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.parent_id > 0 && scope.row.father">
              {{ scope.row.father.name }}
            </span>
            <span v-else class="admin-muted">顶级分类</span>
          </template>
        </el-table-column>
        <el-table-column label="网站" width="90" align="center">
          <template slot-scope="scope">
            <span class="admin-count">{{ scope.row.site ? scope.row.site.length : 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子分类" width="90" align="center">
          <template slot-scope="scope">
            <span class="admin-count">{{ scope.row.children ? scope.row.children.length : 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="120" show-overflow-tooltip></el-table-column>
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
      :title="form.id ? '编辑分类' : '新增分类'"
      :visible.sync="showDg"
      width="560px"
      custom-class="admin-dialog"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" ref="formName" :model="form" label-width="92px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="form.en_name" placeholder="可选"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标类名"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select v-model="form.parent_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
import {
  getCategoryList,
  delCategory,
  addCategory,
  updateCategory,
} from '../../utils/supabase.js'

const defaultForm = () => ({
  id: null,
  parent_id: null,
  sort: null,
  name: '',
  icon: '',
  is_used: null,
  en_name: '',
})

export default {
  name: 'container',
  data() {
    return {
      tableData: [],
      formInline: {
        name: '',
      },
      form: defaultForm(),
      showDg: false,
      list: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      multipleSelection: [],
    }
  },
  methods: {
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
            await delCategory(ids)
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

        try {
          const data = this.form.id
            ? await updateCategory(this.form.id, this.form)
            : await addCategory(this.form, this.form.parent_id)
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
      this.form = defaultForm()
      this.showDg = true
      this.$nextTick(() => {
        if (this.$refs.formName) {
          this.$refs.formName.clearValidate()
        }
      })
    },
    async getList() {
      try {
        this.tableData = await getCategoryList({ name: this.formInline.name })
        this.list = this.tableData.filter(item => item.parent_id == 0)
      } catch (error) {
        this.$message.error(error.message || '获取分类失败')
      }
    },
    del(item) {
      if (item.site && item.site.length) {
        this.$message.error('分类下有网站无法删除，请先删除网站')
        return
      }
      if (item.children && item.children.length) {
        this.$message.error('分类下有子分类无法删除，请先删除子分类')
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await delCategory([item.id])
            this.$message.success('操作成功')
            this.getList()
          } catch (error) {
            this.$message.error(error.message || '删除失败')
          }
        })
        .catch(() => {})
    },
    startEdit(data) {
      const val = JSON.parse(JSON.stringify(data))
      delete val.father
      delete val.site
      delete val.children
      this.form = val
      this.showDg = true
    },
  },
  mounted() {
    this.getList()
  },
}
</script>

<style></style>
