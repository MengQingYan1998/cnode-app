<template>
  <div>
      <button-tab v-model="selectedButtonTabIndex" style="margin-top:10px;">
        <button-tab-item>未读消息</button-tab-item>
        <button-tab-item>已读消息</button-tab-item>
      </button-tab>
    <group>
    <swipeout>
      <!-- <swipeout-item v-for="(item,index) in message" :disabled="disable">
        <div slot="right-menu">
          <swipeout-button type="primary" @click.native="markAsRead(item.id)">标记为已读</swipeout-button>
        </div>
        <div slot="content">
          <span>
          <a :href="'/#/user/'+item.author.loginname"><img :src="item.author.avatar_url" style="width: 30px;">{{ item.author.loginname}} 回复了您的话题</a>
          <a :href="'/#/topic/'+item.topic.id">{{ item.topic.title}}</a>
        </span>
        </div>
      </swipeout-item> -->
      <swipeout-item v-for="(item, index) in hasNotReadMsgs" :key="index">
        <div slot="right-menu">
          <swipeout-button type="primary" @click.native="markRead(item.id)">标记为已读</swipeout-button>
        </div>
        <div slot="content">
          <span slot="title">
            <a :href="'/#/user/' + item.author.loginname">{{item.author.loginname}}</a>
            回复了您的话题
            <a :href="'/#/topic/' + item.topic.id">{{item.topic.title}}</a>
          </span>
        </div>
      </swipeout-item>

    </swipeout>
      <h5 v-if="hasNotReadMessages && hasNotReadMessages.length>0"><a href="#" @click.prevent="markAsReadAll">全部标记为已读</a></h5>
      <h5 v-else>没有未读消息</h5>
    </group>
    <!--<group>-->
      <!--<cell v-for="(item,index) in message" :key="index">-->
        <!--<span slot="title">-->
          <!--<a :href="'/#/user/'+item.loginname"><img :src="item.author.avatar_url" style="width: 30px;">{{ item.author.loginname}} 回复了您的话题</a>-->
          <!--<a :href="'/#/topic/'+item.topic.id">{{ item.topic.title}}</a>-->
        <!--</span>-->
      <!--</cell>-->
    <!--</group>-->
  </div>
</template>

<script>
  import {ButtonTab,ButtonTabItem,Group,Cell,Swipeout,SwipeoutButton,SwipeoutItem} from 'vux';
    export default {
        name: "Message",
      data:function(){
          return {
            selectedButtonTabIndex:0,
            hasReadMessages:null,
            hasNotReadMessages:null,
            disable:true,
            read:null
          }
      },
      methods:{
        markAsRead(mid){
          // console.log(mid);
          var app=this;
          this.$http.post('/message/mark_one/'+mid,{
            accesstoken:this.$store.state.accesstoken
          }).then(function (res) {
            if(res.data && res.data.success){
              app.$router.go(0);
            }
          });
        },
        markAsReadAll(){
          var app=this;
          this.$http.post('/message/mark_all',{
            accesstoken:this.$store.state.accesstoken
          }).then(function (res) {
            if(res.data&&res.data.success){
              app.$router.go(0);
            }
          });
        }
      },
      computed:{
          message:function () {
            if(this.selectedButtonTabIndex==0){
              this.disable=false;
              return this.hasNotReadMessages;
            }else if(this.selectedButtonTabIndex==1){
              this.disable=true;
              return this.hasReadMessages;
            }
          }
      },
      components:{
          ButtonTabItem,ButtonTab,Group,Cell,SwipeoutButton,SwipeoutItem,Swipeout
      },
      created:function () {
        var app=this;
        this.$http.get('/messages',{
          params:{
            accesstoken:this.$store.state.accesstoken
          }
        }).then(function (res) {
              // console.log(res.data);
              if(res.data.data&&res.data.success){
                  app.hasReadMessages=res.data.data.has_read_messages;
                  app.hasNotReadMessages=res.data.data.hasnot_read_messages;
              }
        })
      }
    }
</script>

<style scoped>

</style>
