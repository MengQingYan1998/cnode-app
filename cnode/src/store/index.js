import Vue from 'vue';
import Vuex from 'vuex';
import mutations from'./mutations';
import actions from'./actions';

Vue.use(Vuex);

const store=new Vuex.Store({
    state:{
      topics:[
        {name:"all" ,desc:'全部'},
        {name:"good" ,desc:'精华'},
        {name:"share" ,desc:'分享'},
        {name:"ask" ,desc:'问答'},
        {name:"job" ,desc:'招聘'},
        {name:"dev" ,desc:'测试'}
      ],
      unLoginedMoreMenus:{login:'登录'},
      loginedMoreMenus:{
        center:'个人中心',
        message:'消息通知',
        create:'发表主题',
        logout:'注销'
      },
      isLogined:false,
      isShowMoreMenus:false,
      loginname:'',
      accesstoken:'',
      userId:''
    },
  getters:{
    moreMenus(state){
      if(state.isLogined){
        return state.loginedMoreMenus;
      }
      return state.unLoginedMoreMenus;
    },
    getTopicsDescByTab(state){
      return function (tab) {
        for(var index=0;index<state.topics.length;index++){
          if(state.topics[index].name==tab){
            return state.topics[index].desc;
          }
        }
      }
    }
  },
  mutations,
  actions
});

export default store;
