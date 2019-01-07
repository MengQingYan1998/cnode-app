<template>
  <div>
    <h2>测试Actionsheet</h2>
    <Actionsheet v-model="show" :menus="menus" show-cancel="" theme="ios" @on-click-menu="myclick"></Actionsheet>
  </div>

</template>

<script>
  import {Actionsheet} from 'vux';
  export default {
    components:{
      Actionsheet
    },
    data:function () {
      return {
        show:true,
        menus:{
          menu1:'分享到朋友圈',
          menu2:'分享到新浪微博'
        },
      }
    },
    methods:{
      myclick(menukey,menuitem){
          console.log("menukey="+menukey);
          console.log("menuitem="+menuitem);
      }
    }
  }
</script>


<style>


</style>
