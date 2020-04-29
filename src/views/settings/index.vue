<template>
    <div class="settings-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
              <el-breadcrumb-item>个人设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
        <el-col :span="15">
          <el-form
          ref="form"
          :model="user"
          label-width="80px"
          :rules="formRules"
          >
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
              type="primary"
              @click="onUpdateUser"
              :loading="updateUserfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          >
        </el-col>
      </el-row>
      </el-card>
      <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
        type="primary"
        @click="onUpdatePhoto"
        :loading="updatePhotoLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      // 用户资料
      user: {
        id: null,
        mobile: '',
        name: '',
        intro: '',
        email: '',
        photo: ''
      },
      // 自定义规则
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在1到7个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      dialogVisible: false, // 控制上传图片裁剪预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 剪裁器
      updatePhotoLoading: false, // 更新用户头像 loading 状态
      updateUserfileLoading: false // 更新基本信息 loading
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      // 表单验证
      // 验证通过, 提交表单

      // 开启 loading
      this.updateUserfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })

        // 关闭 loading
        this.updateUserfileLoading = false

        // 更新头部当前登录用户的信息
        // 发布通知，用户信息已修改
        globalBus.$emit('update-user', this.user)
      })
    },

    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

    onFileChange () {
      // console.log('file change')
      // 处于图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])

      this.previewImage = blobData

      // 展示弹层, 预览用户选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件的问题
      this.$refs.file.value = ''
    },

    onDialogOpened () {
      // 图片剪裁器必须基于 img 进行初始化
      // 注意：img 必须是可见状态才能正常完成初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']

      // 第1次初始化好以后，如果预览剪裁的图片发生了变化，剪裁器默认不会更新
      // 如果需要预览图片发生变化更新剪裁器：
      // 方式一：剪裁器.replace 方法
      // 方式二：销毁剪裁器，重新初始化

      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'none',
        aspectRatio: 1,
        cropBoxResizable: false
      })
    },

    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },

    onUpdatePhoto () {
      // 让确定按钮开始 loading
      this.updatePhotoLoading = true

      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像,请求提交 fd
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          // 关闭弹层框
          this.dialogVisible = false
          // 更新视图展示

          // 直接把裁切结果的文件对象转为 blob 数据本地预览
          this.user.photo = window.URL.createObjectURL(file)

          // 关闭确定按钮 loading 状态
          this.updatePhotoLoading = false

          this.$message({
            message: '更换头像成功',
            type: 'success'
          })

          // 更新顶部登录用户的信息
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang="less" >
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
