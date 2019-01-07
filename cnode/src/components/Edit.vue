<template>
  <div>
    <h2 style="text-align: center">发表新话题</h2>
    <group>
      <x-textarea placeholder="请输入标题" :max="200" :rows="1" v-model="topic.title"></x-textarea>
    </group>
    <group>
      <!--<x-textarea placeholder="请输入内容" :max="2000" v-model="topic.content"></x-textarea>-->
      <mavon-editor v-model="topic.content" :ishljs = "true" @imgAdd="uploadImage"></mavon-editor>
    </group>
    <x-button type="primary" @click.native="editTopic">修改话题</x-button>
  </div>
</template>

<script>
  import {Group,XTextarea,XButton} from 'vux';
  import {mavonEditor} from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
  import axios from 'axios';
  export default {
        name: "Edit",
      components:{
        Group,XButton,XTextarea,mavonEditor
      },
        props:['id'],
      data:function () {
        return {
            topic:{ }
        }
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
        editTopic(){
          var app=this;
          this.$http.post('/topics/update',{
            accesstoken:this.$store.state.accesstoken,
            topic_id:this.topic.id,
            title:this.topic.title,
            content:this.topic.content,
            tab:'dev'
          }).then(function (response) {
            if (response.data.success){
              app.$router.back();
            }
          });
        }
      },
      beforeRouteEnter:function (to,from,next) {
        next(function (vm) {
          vm.$http.get('/topic/'+vm.id,{
            params:{
              accesstoken:vm.accesstoken
            }
          }).then(function (response) {
            if(response.data.success){
              vm.topic=response.data.data;
              // vm.topic.content=vm.topic.content.slice(30,-11);
              // console.log(response.data.data);
            }
          })
        });
      },
      beforeRouteUpdate:function (to,from,next) {
        var app=this;
        this.$http.get('/topic/'+to.params.id,{
          params:{
            accesstoken:this.accesstoken
          }
        }).then(function (response) {
          if(response.data.success){
            app.topic=response.data.data;
            app.topic=response.data.data;
            app.topic.content=app.topic.content.slice(30,-11);
            // console.log(response.data.data);
          }
        });
        next();
      }
    }
</script>

<style scoped>

</style>
