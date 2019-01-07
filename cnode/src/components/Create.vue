<template>
    <div>
      <h2 style="text-align: center">发表新话题</h2>
      <group>
        <selector title="话题类别" v-model="tab" :options="topics"></selector>
      </group>
      <group>
        <x-textarea placeholder="请输入标题" :max="200" :rows="1" v-model="title"></x-textarea>
      </group>
      <group>
        <!--<x-textarea placeholder="请输入内容" :max="2000" v-model="content"></x-textarea>-->
        <mavon-editor v-model="content" :toolbars="toolbars" @imgAdd="uploadImage" ref="md"></mavon-editor>
      </group>
      <x-button type="primary" @click.native="addTopic">发表话题</x-button>
      <toast :value="isShowToast" type="cancel" >{{ toasttext }}</toast>
    </div>
</template>

<script>
  import {Group,XTextarea,XButton,Toast,Selector} from 'vux';
  import {mavonEditor} from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
  import axios from 'axios';
    export default {
        name: "Create",
      data:function(){
          return {
            title:'',
            content:'',
            toasttext:'',
            isShowToast:false,
            tab:'dev',
            topics:[
              {key:"all" ,value:'全部'},
              {key:"good" ,value:'精华'},
              {key:"share" ,value:'分享'},
              {key:"ask" ,value:'问答'},
              {key:"job" ,value:'招聘'},
              {key:"dev" ,value:'测试'}
            ],
            toolbars: {
              bold: true, // 粗体
              italic: true, // 斜体
              header: true, // 标题
              underline: true, // 下划线
              strikethrough: true, // 中划线
              mark: true, // 标记
              superscript: true, // 上角标
              subscript: true, // 下角标
              quote: true, // 引用
              ol: true, // 有序列表
              ul: true, // 无序列表
              link: true, // 链接
              imagelink: true, // 图片链接
              code: true, // code
              table: true, // 表格
              fullscreen: true, // 全屏编辑
              readmodel: true, // 沉浸式阅读
              htmlcode: true, // 展示html源码
              help: true, // 帮助
              /* 1.3.5 */
              undo: true, // 上一步
              redo: true, // 下一步
              trash: true, // 清空
              save: true, // 保存（触发events中的save事件）
              /* 1.4.2 */
              navigation: true, // 导航目录
              /* 2.1.8 */
              alignleft: true, // 左对齐
              aligncenter: true, // 居中
              alignright: true, // 右对齐
              /* 2.2.1 */
              subfield: true, // 单双栏模式
              preview: true, // 预览
            }
          }
      },
      computed:{

      },
      methods:{
        uploadImage:function(pos,file){
          // pos表示当前图片的markdown序号
          // file表示上传图片的file对象
          // 上传地址 https://sm.ms/api/upload
          // console.log(pos)
          // console.log(file)
          var app=this;
          var params=new FormData();
          params.append('smfile',file);
          axios.post('https://sm.ms/api/upload',params,{
            headers: { 'Content-Type': 'multipart/form-data' }
          }).then(function (res) {
              app.$refs.md.$img2Url(pos,res.data.data.url);
          })

        },
        addTopic(){
          var app=this;
          this.$http.post('/topics',{
            title:this.title,
            content:this.content,
            tab:'dev',
            accesstoken:this.$store.state.accesstoken
          }).then(function (response) {
              if(response.data.success){
                app.$router.replace('/topic/'+response.data.topic_id);
              }
          }).catch(function (err) {
              app.isShowToast=true;
              app.toasttext=err.response.error_msg;
          });
        }
      },
      components:{
          Group,XTextarea,XButton,Toast,Selector,mavonEditor
      }
    }
</script>

<style scoped>

</style>
