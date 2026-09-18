<template>
  <div>
    <el-upload
      :auto-upload="false"
      class="avatar-uploader"
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
import { uploadFile } from '../utils/supabase.js'

const ALLOW_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 2

export default {
  name: 'upload',
  data() {
    return {
      imageUrl: '',
      files: [],
    }
  },
  props: {},
  methods: {
    clean() {
      this.files = []
      this.imageUrl = ''
    },
    setFiles(files) {
      this.files = files
      this.imageUrl = files && files.length ? files[0].url : ''
    },
    async fileChange(file) {
      if (!this.beforeAvatarUpload(file.raw)) {
        this.files = []
        this.$emit('success', this.files)
        return
      }

      try {
        const data = await uploadFile(file)
        this.files = [
          {
            name: file.name,
            url: data.fileurl,
            path: data.filekey,
          },
        ]
        this.imageUrl = data.fileurl
        this.$emit('success', this.files)
      } catch (error) {
        this.files = []
        this.imageUrl = ''
        this.$emit('success', this.files)
        this.$message.error(error.message || '上传失败')
      }
    },
    beforeAvatarUpload(file) {
      const isAllowType = ALLOW_TYPES.indexOf(file.type) > -1
      const isLtMaxSize = file.size / 1024 / 1024 < MAX_SIZE_MB

      if (!isAllowType) {
        this.$message.error('只能上传 JPG、PNG、WebP 或 GIF 图片')
      }
      if (!isLtMaxSize) {
        this.$message.error(`图片大小不能超过 ${MAX_SIZE_MB}MB`)
      }
      return isAllowType && isLtMaxSize
    },
  },
}
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
