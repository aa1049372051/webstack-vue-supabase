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
      <el-table-column align="center" prop="title" label="名称" width="140">
      </el-table-column>
      <el-table-column align="center" prop="url" label="父级">
        <template slot-scope="scope">
          <span v-if="scope.row.category"> {{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="url" label="url"> </el-table-column>
      <el-table-column align="center" prop="logo" label="logo">
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>
      <!-- <el-table-column align="center" prop="sort" label="是否启用">
        <template slot-scope="scope">
          {{ scope.row.is_used ? "是" : "否" }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="sort" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="startEdit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="showDg" title="网站" :visible.sync="showDg" width="50%">
      <el-form :rules="rules" ref="formName" :model="form" label-width="80px">
        <el-form-item prop="title" label="名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="url地址">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <upload></upload>
          <el-input v-model="form.logo"></el-input>
        </el-form-item>
        <el-form-item prop="pid" label="上级">
          <el-select
            filter
            v-model="form.pid"
            placeholder="请选择"
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
            placeholder="请选择"
          >
            <el-option
              v-for="item in list2"
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
import upload from "@/components/upload";
import {
  getSiteList,
  delSite,
  addSite,
  updateSite,
  getFirstCategoryList,
} from "../../utils/supabase.js";
export default {
  name: "site",
  components: {
    upload,
  },
  data() {
    return {
      tableData: [],
      formInline: {
        name: "",
      },
      form: {
        id: null,
        category_id: null,
        sort: null,
        title: "",
        logo: "",
        is_used: null,
        pid: null,
        pid2: null,
        url: null,
      },
      showDg: false,
      list: [],
      list2: [],
      rules: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        url: [{ required: true, message: "请输入", trigger: "blur" }],
        pid: [{ required: true, message: "请输入", trigger: "blur" }],
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
          const error = await delSite(ids);
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
          let form = this.form;
          if (!form.pid) {
            this.$message.error("请选择分类");
            return;
          }
          if (!form.pid2 && this.list2.length > 0) {
            this.$message.error("请选择分类");
            return;
          }
          let data;
          if (this.form.id) {
            data = await updateSite(this.form.id, {
              category_id: form.pid2 || form.pid,
              sort: form.sort,
              title: form.title,
              logo: form.logo,
              is_used: form.is_used,
              url: form.url,
              id: form.id,
            });
          } else {
            data = await addSite(
              {
                sort: form.sort,
                title: form.title,
                logo: form.logo,
                is_used: form.is_used,
                url: form.url,
              },
              form.pid2 || form.pid
            );
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
      this.getCategory();
      this.showDg = true;
      this.$nextTick(() => {
        this.$refs["formName"].resetFields();
        this.tools.clearFormData(this.form);
      });
    },
    async getList() {
      this.tableData = await getSiteList();
      this.list = this.tableData.filter((item) => item.parent_id == 0);
    },
    del(item) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const error = await delSite([item.id]);
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
      this.getCategory();
      let val = JSON.parse(JSON.stringify(data));
      this.form = val;
      this.showDg = true;
      if (val.category) {
        if (val.category.father) {
          val.pid = val.category.father.id;
          this.selectChange(val.pid);
          val.pid2 = val.category_id;
        } else {
          val.pid = val.category_id;
        }
      }
    },
    async getCategory() {
      this.list = await getFirstCategoryList();
    },
    selectChange(val) {
      this.list2 = [];
      this.form.pid2 = null;
      let data = this.list.find((item) => item.id == val);
      this.list2 = data.children;
    },
  },
  mounted() {
    this.getCategory();
    this.getList();
  },
};
</script>

<style></style>
