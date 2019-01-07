<template>
    <div v-if="user">
      <card :header="{title: user.loginname}" :footer="{title: '注册时间：'+ user.create_at}">x
        <div slot="content">
          <p> <img :src="user.avatar_url" alt=""></p>
          <p>用户积分：{{user.score}}</p>
          <p><a :href="'/#/collect/'+uname">{{ collect_topic.length }} 个话题收藏</a></p>
          <p><a :href="'https://github.com/'+ user.githubUsername">
            @ {{ user.githubUsername }}
          </a></p>
        </div>
      </card>
      <card :header="{title: '最近发表的话题'}">
        <group slot="content">
          <cell v-for="(item,index) in user.recent_topics" :key="index" :title="item.title" is-link :link="'/topic/'+item.id"></cell>
        </group>
      </card>
      <card :header="{title: '最近参与的话题'}">
        <group slot="content">
          <cell v-for="(item,index) in user.recent_replies" :key="index" :title="item.title" is-link :link="'/topic/'+item.id"></cell>
        </group>
      </card>
    </div>
</template>

<script>
    import {Card,Group,Cell} from 'vux';
    export default {
        name: "User",
      components:{
          Card,Group,Cell
      },
      props:['uname'],
      data:function () {
        return  {
          user:null,
          collect_topic:[]
        }
      },
      beforeRouteEnter :function (to,from,next) {
        next(function (vm) {
          vm.$http.get('/user/'+to.params.uname).then(function (response) {
            if(response.data.success){
              vm.user=response.data.data;
            }
          });
          vm.$http.get('/topic_collect/'+vm.uname).then(function (response) {
            if(response.data.success){
              vm.collect_topic=response.data.data;
            }
          })
        });
      },
      beforeRouteUpdate :function (to,from,next) {
          var app=this;
          this.$http.get('/user/'+to.params.uname).then(function (response) {
            if(response.data.success){
              app.user=response.data.data;
            }
          });
        app.$http.get('/topic_collect/'+vm.uname).then(function (response) {
          if(response.data.success){
            app.collect_topic=response.data.data;
          }
        });

      }
    }
</script>

<style scoped>

</style>
