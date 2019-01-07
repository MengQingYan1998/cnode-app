<template>
  <div>
    <msg title="用户尚未登录！" description="用户尚未登录，请先登录" icon="warn" :buttons="buttons" v-if="isShowMsg"></msg>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex';
  import {Msg} from 'vux';
    export default {
        name: "Logout",
      components:{
          Msg
      },
      data(){
          return {
            isShowMsg:false,
            buttons:[
              {
                type:'primary',
                text:'跳转到登录页面',
                link:'/login'
              }
            ]
          }
      },
      methods:{
        ...mapMutations(['mutationLogout'])
      },
      created:function () {
          if(!this.$store.state.isLogined){
            this.isShowMsg=true;
            return;
          }
      //  恢复Vuex数据
        this.mutationLogout();
      //  清空localStorage
        window.localStorage.clear();
      //  页面跳转
        this.$router.push('/topiclist/all');
      }
    }
</script>

<style scoped>

</style>
