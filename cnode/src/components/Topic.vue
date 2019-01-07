<template>
    <div v-if="topic">
      <article class="weui-article">
        <h2>{{ topic.title }}
          <x-button v-if="topic.author_id==$store.state.userId" :mini="true" type="primary" :link="'/topic/'+topic.id+'/edit'">编辑</x-button>
          <x-button v-if="topic.is_collect==false" :mini="true" type="primary" @click.native="collect(1)">收藏</x-button>
          <x-button v-else :mini="true" @click.native="collect(2)">取消收藏</x-button>
        </h2>
        <section>
          <h3>作者：<a :href="'/#/user/'+topic.author.loginname">{{ topic.author.loginname}}</a></h3>
          <span>{{ topic.visit_count }} 次浏览</span>
          <span> 来自 <a :href="'/#/topiclist/'+topic.tab"> <span v-for="item in topics" v-if="item.name==topic.tab">{{ item.desc }}</span></a></span>
        </section>
        <section v-html="topic.content"></section>
      </article>
      <group>
        <cell-box v-for="(item,index) in topic.replies" :key="index">
          <flexbox>
            <flexbox-item :span="1/10">
              <img :src="item.author.avatar_url" alt="" style="width: 30px;height: 30px;">
            </flexbox-item>
            <flexbox-item>
              <section>
                <p><a :href="'/#/user/'+item.author.loginname">{{ item.author.loginname }}</a> <span>{{ index+1 }}楼</span></p>
                <div v-html="item.content"></div>
              </section>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <span @click="upOrDown($event,item.id)"> <wechat-emotion>强</wechat-emotion><span>{{ item.ups.length }}</span></span>
              <span v-if="isLogined" @click="showPopup(item.id,item.author.loginname)">回复</span>
            </flexbox-item>
          </flexbox>
        </cell-box>
      </group>
      <div v-if="!isShowPopup">
        <group>
          <mavon-editor placeholder="评论主题" v-model="replyContent"></mavon-editor>
        </group>
        <x-button :mini="true" type="primary" @click.native="addreply(1)">评论</x-button>
      </div>


      <div v-transfer-dom>
        <popup v-model="isShowPopup" @on-hide="hidePopup">
          <group>
            <mavon-editor placeholder="回复评论" v-model="replyContent"></mavon-editor>
          </group>
          <x-button :mini="true" type="primary" @click.native="addreply(2)">回复</x-button>
        </popup>
      </div>
    </div>
</template>

<script>
  import {Group,CellBox,Flexbox,FlexboxItem,WechatEmotion,XTextarea,XButton,Popup,TransferDom} from 'vux';
  import {mapState} from 'vuex';
  import {mavonEditor} from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
    export default {
        name: "Topic",
      props:['id'],
      components:{
        Group,CellBox,Flexbox,FlexboxItem,WechatEmotion,XTextarea,XButton,Popup,mavonEditor
      },
      //自定义组件
      directives:{
          TransferDom
      },
      data:function(){
        return {
          topic:null,
          replyContent:'',
          isShowPopup:false,
          replyId:'',
          replyName:''
        }
      },
      methods:{
          collect(type){
            var url='/topic_collect/collect';
            if(type==2){
              url='/topic_collect/de_collect';
            }
            console.log(this.accesstoken)
            var app=this;
            this.$http.post(url,{
                accesstoken:this.accesstoken,
                topic_id:this.id
            }).then(function (response) {
              if(response.data.success){
                if(type==2){
                  app.topic.is_collect=false;
                }else{
                  app.topic.is_collect=true;
                }
              }
            })
          },
        upOrDown($event,id){
          var app=this;
          this.$http.post('/reply/'+id+'/ups',{
            accesstoken:this.accesstoken
          }).then(function (response) {
            for(var i=0;i<app.topic.replies.length;i++){
              if(app.topic.replies[i].id==id){
                var reply=app.topic.replies[i];
                break;
              }
            }
            if(response.data.success){
                if(response.data.action=="up"){
                    // $event.target.parentElement.nextElementSibling.innerHTML=parseInt($event.target.parentElement.nextElementSibling.innerHTML)+1;
                    //  应该push用户id值
                    reply.ups.push(app.$store.state.UserId);
                }else if(response.data.action=="down"){
                  // $event.target.parentElement.nextElementSibling.innerHTML=parseInt($event.target.parentElement.nextElementSibling.innerHTML)-1;
                  reply.ups.pop(app.$store.state.UserId);
                }
            }
          })
        },
          hidePopup(){
            this.replyId=null;
            this.replyName='';

          },
          showPopup(replyId,name){
            this.isShowPopup=true;
            this.replyId=replyId;
            this.replyName=name;
          },
        addreply(type){
          // type为1 评论主题
          // type为2 回复评论
          var app=this;
          var params={
            accesstoken:this.$store.state.accesstoken,
            content:this.replyContent
          };
          if(type==2){
            params.reply_id=this.replyId;
            params.content="@"+this.replyName+" "+params.content;
          }
          this.$http.post('/topic/'+this.id+'/replies',params).then(function (response) {
            if(response.data.success){
              app.$http.get('/topic/'+app.id).then(function (response) {
                if(response.data.success){
                  app.topic=response.data.data;
                  app.replyContent='';
                  app.isShowPopup=false;
                }
              });
            }
          })
        }
      },
      computed:{
        topics:function () {
          return this.$store.state.topics;
        },
        ...mapState(['isLogined','accesstoken'])
      },
      beforeRouteEnter:function (to,from,next) {
        next(function (vm) {
          vm.$http.get('/topic/'+to.params.id,{
            params:{
              accesstoken:vm.accesstoken
            }
          }).then(function (response) {
            if(response.data.success){
              vm.topic=response.data.data;
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
            // console.log(response);
          }
        });
        next();
      }
    }
</script>

<style lang="less">
@import "~vux/src/styles/weui/weui.less";
</style>
