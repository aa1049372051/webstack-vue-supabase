<template>
  <el-row>
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.user" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="分类">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddDg">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteSelected">删除选中</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      border
      @selection-change="handleSelectionChange"
      :data="tableData"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" prop="name" label="名称" width="140">
      </el-table-column>
      <el-table-column
        align="center"
        prop="en_name"
        label="英文名称"
        width="150"
      >
      </el-table-column>
      <el-table-column align="center" prop="url" label="父级">
        <template slot-scope="scope">
          <span v-if="scope.row.parent_id > 0 && scope.row.father">
            {{ scope.row.father.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="网站个数">
        <template slot-scope="scope">
          <span v-if="scope.row.site">{{ scope.row.site.length }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="子分类个数">
        <template slot-scope="scope">
          <span v-if="scope.row.children">{{ scope.row.children.length }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="icon" label="icon">
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>
      <el-table-column align="center" prop="sort" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="startEdit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="showDg" title="分类" :visible.sync="showDg" width="50%">
      <el-form :rules="rules" ref="formName" :model="form" label-width="80px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="form.en_name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="上级">
          <el-select v-model="form.parent_id" placeholder="请选择">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否使用">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="form.is_used"
          ></el-switch>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="showDg = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  getCategoryList,
  delCategory,
  addCategory,
  updateCategory,
} from "../../utils/supabase.js";
export default {
  name: "container",
  data() {
    return {
      tableData: [],
      formInline: {
        name: "",
      },
      form: {
        id: null,
        parent_id: null,
        sort: null,
        name: "",
        icon: "",
        is_used: null,
        en_name: "",
      },
      showDg: false,
      list: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      multipleSelection: [],
    };
  },
  methods: {
    deleteSelected() {
      if (!this.multipleSelection.length) {
        this.$message.error("没有选中数据");
        return;
      }
      let ids = [];
      this.multipleSelection.forEach((item) => {
        ids.push(item.id);
      });
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const error = await delCategory(ids);
          if (!error) {
            this.$message.success("操作成功");
            this.getList();
          } else if (error.code != "200") {
            this.$message.error(error.message);
          }
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    onSubmit() {
      this.$refs["formName"].validate(async (valid) => {
        if (valid) {
          let data;
          if (this.form.id) {
            data = await updateCategory(this.form.id, this.form);
          } else {
            data = await addCategory(this.form, this.form.parent_id);
            data = data.data;
          }
          if (data.length) {
            this.showDg = false;
            this.getList();
          } else {
            this.$message.error("操作失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openAddDg() {
      this.showDg = true;
      this.$nextTick(() => {
        this.$refs["formName"].resetFields();
        this.tools.clearFormData(this.form);
      });
    },
    async getList() {
      this.tableData = await getCategoryList();
      this.list = this.tableData.filter((item) => item.parent_id == 0);
    },
    del(item) {
      if (item.site.length) {
        this.$message.error("分类下有网站无法删除，请先删除网站");
        return;
      }
      if (item.children.length) {
        this.$message.error("分类下有子分类无法删除，请先删除子分类");
        return;
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const error = await delCategory([item.id]);
          if (!error) {
            this.$message.success("操作成功");
            this.getList();
          } else if (error.code != "200") {
            this.$message.error(error.message);
          }
        })
        .catch(() => {});
    },
    startEdit(data) {
      let val = JSON.parse(JSON.stringify(data));
      delete val.father;
      delete val.site;
      delete val.children;
      this.form = val;
      this.showDg = true;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style></style>
