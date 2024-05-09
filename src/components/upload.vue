<template>
  <div>
    <el-upload
      :auto-upload="false"
      class="avatar-uploader"
      :on-success="handleAvatarSuccess"
      :on-change="fileChange"
      :before-upload="beforeAvatarUpload"
      :file-list="files"
      list-type="picture-card"
      action=""
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { uploadFile } from "../utils/supabase.js";
export default {
  name: "upload",
  data() {
    return {
      imageUrl: "",
      files: [],
    };
  },
  props: {},
  methods: {
    clean() {
      this.files = [];
    },
    setFiles(files) {
      this.files = files;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    async fileChange(file) {
      let data = await uploadFile(file);
      if (!data.error) {
        this.files = [
          {
            name: file.name,
            url: data.fileurl,
            path: data.filekey,
          },
        ];
      }
      this.$emit("success", this.files);
    },
    async beforeAvatarUpload(file) {
      console.log(file);
      return true;
      //   const isJPG = file.type === "image/jpeg";
      //   const isLt2M = file.size / 1024 / 1024 < 2;

      //   if (!isJPG) {
      //     this.$message.error("上传头像图片只能是 JPG 格式!");
      //   }
      //   if (!isLt2M) {
      //     this.$message.error("上传头像图片大小不能超过 2MB!");
      //   }
      //   return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
