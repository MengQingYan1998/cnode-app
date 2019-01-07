<template>
  <div id="app">
    <div>
      <x-header @on-click-title="routetohome">
        cnode移动社区
        <div slot="right"  @click="showMoreMenus">
          <a href="#" class="vux-header-more"></a>
          <badge v-if="badgetext" :text="badgetext" style="margin-left: 3px;float: left"></badge>
        </div>
      </x-header>
    </div>
    <router-view></router-view>
    <actionsheet v-model="isShowMoreMenus" :menus="moreMenus" @on-click-menu="handleClickMoreMenu"></actionsheet>
    <vm-back-top></vm-back-top>
  </div>
</template>

<script>
  import {XHeader,Actionsheet,Badge} from 'vux';
  import { mapState,mapGetters,mapMutations } from 'vuex';
  import VmBackTop from 'vue-multiple-back-top';
export default {
  name: 'app',
  components:{
   XHeader,Actionsheet,VmBackTop,Badge
  },
  data:function () {
    return {
      badgetext:null
    }
  },
  computed:{
    ...mapGetters(['moreMenus']),
    ...mapState(['topics','loginedMoreMenus','unLoginedMoreMenus','isLogined','accesstoken','isLogined']),
    isShowMoreMenus:{
      get:function () {
        return this.$store.state.isShowMoreMenus;
      },
      set:function (nval) {
        this.$store.commit('mutationIsShowMoreMenus',nval)
      }
    }
  },
  methods:{
    routetohome(){
      this.$router.replace('/');
    },
    ...mapMutations(['mutationLogin','mutationLoginname','mutationAccessToken','mutationUserId','mutationBadgetext']),
    showMoreMenus(){
      this.isShowMoreMenus=true;
    },
    handleClickMoreMenu( menukey,menuitem){
      this.$router.push('/'+menukey);
    },
    getUnReadMsgCount(){
      if(this.isLogined){
        var app=this;
        this.$http.get('/message/count',{
          params:{
            accesstoken:this.accesstoken
          }
        }).then(function (res) {
          if(res.data.data){
            app.badgetext=res.data.data;
            if(app.badgetext!=0){app.mutationBadgetext(app.badgetext);}
          }
        })
      }else{
        this.badgetext='';
      }
    }
  },
  created:function () {
    if(window.localStorage.getItem('loginStatus')){
      var loginStatus=window.localStorage.getItem('loginStatus');
      var loginname=window.localStorage.getItem('loginname');
      var accesstoken=window.localStorage.getItem('accesstoken');
      var userId=window.localStorage.getItem('userId');
      this.mutationLogin(loginStatus);
      this.mutationLoginname(loginname);
      this.mutationAccessToken(accesstoken);
      this.mutationUserId(userId);
      this.getUnReadMsgCount();
      window.setInterval(this.getUnReadMsgCount,3*60*1000);
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
