<template>
  <div class="course-chapter">
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 50px">
      <el-step title="添加课程基本信息"></el-step>
      <el-step title="添加课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>

    <el-tree
      class="filter-tree"
      :data="chapters"
      :props="defaultProps"
      default-expand-all
      ref="tree"
      style="padding-right: 250px"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-if="data.children!==undefined" style="font-size: larger">{{ node.label }}</span>
        <span v-else>{{ node.label }}</span>
        <span>
          <el-button v-show="data.children!==undefined"
                     type="text"
                     size="mini"
                     @click="handleAddVideo(node, data)">
            添加小节
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="data.children!==undefined?updateChapter(node, data):handleUpdateVideo(node, data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="data.children!==undefined?deleteChapter(node, data):deleteVideo(node,data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-button type="text" @click="handleDialog">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节" width="600px">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节" width="600px">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!--            :action="'http://127.0.0.1:8003/edu/vod/video/upload'"-->
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/edu/vod/video/upload'"

            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <br>
    <el-button style="margin-top: 12px;" @click="pro">上一步</el-button>
    <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
</template>

<script>
import chapter from '../../../api/chapter'
import message from '../../../utils/message'
import video from '../../../api/video'

const defaultVideo = {
  id: null,
  title: '',
  sort: 0,
  courseId: '',
  chapterId: null,
  isFree: true,
  videoSourceId: '',
  videoOriginalName: ''
}
export default {
  name: 'Chapter',
  data() {
    return {
      active: 2,
      chapters: [],
      courseId: '',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      chapter: { title: '', sort: 0, courseId: this.courseId },
      video: { ...defaultVideo },
      BASE_API: process.env.BASE_API,
      fileList: []
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapters()
    }
  },
  methods: {

    //==============================小节的操作==============================
    handleVodRemove() {
    },
    beforeVodRemove() {
      message.messageBox(this.handleVodRemove(), '是否确认删除视频？')
    },
    //上传视频成功之后执行的方法
    handleVodUploadSuccess(response, file, fileList) {

      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name//获取到上传文件的名称

    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    handleUpdateVideo(node, data) {
      this.dialogVideoFormVisible = true
      video.getVideoInfoById(data.id).then(response => {
        if (response.code === 20000) {
          this.video = response.data.data
        }
      })
    },
    deleteVideo(node, data) {
      message.messageBox(() => {
        video.deleteVideoById(data.id).then(response => {
          if (response.code === 20000) {
            message.messageByResp(response)
            this.getChapters()
          }
        })
      }, '是否确认要删除该小节内容')
    },
    handleAddVideo(node, data) {
      //data是指 章节的内容
      this.dialogVideoFormVisible = true
      this.video = { ...defaultVideo }
      this.video.chapterId = data.id
      this.video.courseId = this.courseId
    },
    /**
     * 根据video的id是否为空，判断是更新还是添加
     */
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo()
      } else {
        this.saveVideo()
      }
    },
    /**
     * 添加小节
     */
    saveVideo() {
      video.saveVideo(this.video).then(response => {
        message.messageByResp(response)
        if (response.code === 20000) {
          this.dialogVideoFormVisible = false
          this.getChapters()

        }
      })

    },
    /**
     * 更新小节
     */
    updateVideo() {
      video.updateVideo(this.video).then(response => {
        message.messageByResp(response)
        if (response.code === 20000) {
          this.dialogVideoFormVisible = false
          this.getChapters()

        }
      })
    },

    //==============================章节的操作==============================
    //修改章节
    updateChapter(node, data) {
      chapter.getChapterInfoById(data.id).then(response => {
        if (response.code === 20000) {
          this.chapter = { ...response.data.data }
          this.dialogChapterFormVisible = true
        }
      })
    },
    // 删除章节
    deleteChapter(node, data) {
      message.messageBox(() => {
        chapter.deleteChapterById(data.id).then(response => {
          message.messageByResp(response)
          this.getChapters()
        })

      }, '确认要删除吗？')

    },
    handleDialog() {
      this.chapter.title = ''
      this.chapter.sort = 0
      this.chapter.id = ''
      this.dialogChapterFormVisible = true
    },
    //章节的保存和更新
    saveOrUpdate() {
      if (this.chapter.id) {
        chapter.updateChapter(this.chapter).then(response => {
            message.messageByResp(response)
            if (response.code === 20000) {
              this.dialogChapterFormVisible = false
              this.getChapters()
            }
          }
        )
      } else {
        this.chapter.courseId = this.courseId
        chapter.saveChapter(this.chapter).then(response => {
          message.messageByResp(response)
          if (response.code === 20000) {
            this.dialogChapterFormVisible = false
            this.getChapters()
          }

        })
      }
    },
    getChapters() {
      chapter.getChapterList(this.courseId).then(response => {
        this.chapters = response.data.data
        console.log('章节列表：', response.data.data)

      })
    },
    //返回上一步
    pro() {
      this.$router.push({ path: `/edu/course/info/${this.courseId}` })
    },
    next() {
      this.$router.push({ path: `/edu/course/publish/${this.courseId}` })
      console.log(`/edu/course/publish/${this.courseId}`)
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
