<template>
    <div>
      <div v-if="!isShowMsg">
      <h1 style="text-align: center;margin:20px;">用户登录</h1>
      <group>
        <x-input placeholder="Access Token" v-model="accesstoken"></x-input>
      </group>
      <div style="height: 20px;"></div>
      <x-button type="primary" @click.native="doLogin">登录</x-button>
      <toast type="cancel" :value="isShowToast" >{{ toastText }}</toast>
      </div>
      <msg title="用户已登录！" description="用户已登录，请先注销" icon="warn" :buttons="buttons" v-if="isShowMsg"></msg>
    </div>
</template>

<script>
  import {Group,XInput,XButton,Toast,Msg} from 'vux';
  import {mapMutations} from 'vuex';
    export default {
        name: "Login",
      components:{
          Group,XButton,XInput,Toast,Msg
      },
      data:function () {
        return {
          accesstoken:'',
          isShowToast:false,
          toastText:'',
          isShowMsg:false,
          buttons:[
            {
              type:'primary',
              text:'注销此用户',
              link:'/logout'
            }
          ]
        }
      },
      methods:{
          ...mapMutations(['mutationLogin','mutationLoginname','mutationAccessToken','mutationUserId']),
          doLogin(){
            var app=this;
            this.$http.post('/accesstoken',{
              accesstoken:this.accesstoken
            }).then(function (response) {
              if(response.data.success){
                app.mutationLogin(true);
                window.localStorage.setItem('loginStatus',true);
                window.localStorage.setItem('loginname',response.data.loginname);
                window.localStorage.setItem('accesstoken',app.accesstoken);
                window.localStorage.setItem('userId',response.data.id);
                app.mutationLoginname(response.data.loginname);
                app.mutationAccessToken(app.accesstoken);
                app.mutationUserId(response.data.id);
                app.$router.push('/user/'+response.data.loginname);
              }
            }).catch(function (err) {
              app.toastText=err.response.data.error_msg;
              app.isShowToast=true;
            })
          }
      },
      created(){
          if(this.$store.state.isLogined){
            this.isShowMsg=true;
          }
      }
    }
</script>

<style scoped>

</style>
