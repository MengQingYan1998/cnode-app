
const mutations={
    mutationIsShowMoreMenus:function (state,val) {
      state.isShowMoreMenus=val;
    },
    mutationLogin(state,val){
      state.isLogined=val;
    },
    mutationLoginname:function (state, name) {
        state.loginname=name;
    },
    mutationAccessToken:function (state,val) {
      state.accesstoken=val;
    },
    mutationLogout:function (state) {
      state.loginname='';
      state.isLogined=false;
      state.accesstoken='';
    },
  mutationUserId:function (state,id) {
    state.userId=id;
  },
  mutationBadgetext:function (state,num) {
    state.loginedMoreMenus.message='消息通知   ('+num+')';
  }
}
export default mutations;
