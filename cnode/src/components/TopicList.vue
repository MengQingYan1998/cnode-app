<template>
  <div>
    <tab v-bind:line-width="1">
      <tab-item  v-for="(item,index) in topics" :key="index" @on-item-click="routerto"  :selected="$route.path=='/topiclist/'+item.name">
        {{ item.desc }}
      </tab-item>
    </tab>
    <!--<button-tab>-->
      <!--<button-tab-item  v-for="(item,index) in topics" :key="index" @on-item-click="routerto" :selected="$route.path=='/topiclist/'+item.name">-->
        <!--{{ item.desc }}-->
      <!--</button-tab-item>-->
    <!--</button-tab>-->

    <scroller lock-x scrollbarY use-pullup :pullup-config="pullupConfig" height="-46" @on-pullup-loading="loadMoreData" ref="pullup" use-pulldown :pulldown-config="pulldownConfig" @on-pulldown-loading="refresh">
      <div>
        <group>
          <cell v-for="(item,index) in lists" :key="index" :title="item.title" :link="'/topic/'+item.id" is-link>

          <span slot="title" class="cell_title">
            <span class="reply_count">
              {{ item.reply_count }}
            </span>
            /
            <span class="visit_count">
              {{ item.visit_count}}
            </span>
            <span v-if="item.top" class="top">
              置顶
            </span>
            <span class="tab" v-if="$route.path == '/topiclist/all'">
              <!--<span v-for="list in topics"> <span v-if="item.tab==list.name">{{ list.desc }}</span></span>-->
              <span>{{ getDescByTab(item.tab)}}</span>
            </span>
            <span class="title">
              {{ item.title }}
            </span>
          </span>

            <span slot="icon" class="cell_author_avatar">
            <img :src="item.author.avatar_url" alt="">
          </span>
          </cell>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
    import {Group,Cell,Scroller,Tab,TabItem,ButtonTab,ButtonTabItem} from 'vux';
    export default {
        name: "TopicList",
      props:['name'],
      components:{
          Group,Cell,Scroller,Tab,TabItem,ButtonTab,ButtonTabItem
      },
      methods:{
          refresh(){
            var app=this;
            this.page++;
            console.log(this.limit);
            this.$http.get('/topics',{
              params:{
                name:this.name,
                page:1,
                limit:this.limit
              }
            }).then(function (response) {
              app.lists=response.data.data;
              app.page=1;
              app.$refs.pullup.donePulldown();
            });
          },
          getDescByTab(tab){
            return this.$store.getters.getTopicsDescByTab(tab);
          },
        routerto(index){
          // for(let i=0;i<this.topics.length;i++){
          //   this.topics[i].selected=false;
          // }
          // this.topics[index].selected=true;
          //编程式路由跳转
          this.$router.push('/topiclist/'+this.topics[index].name);
        },
        loadMoreData(){
          var app=this;
          this.page++;
          this.$http.get('/topics',{
            params:{
              name:this.name,
              page:this.page,
              limit:this.limit
            }
          }).then(function (response) {
            for( let i=0; i<response.data.data.length;i++){
              app.lists.push(response.data.data[i]);
            }
            app.$refs.pullup.donePullup();
          });
        }
      },
      data:function(){
          return{
            lists:[],
            page:1,
            limit:15,
            pullupConfig:{
              content: '上拉加载更多',
              downContent: '松开进行加载',
              upContent: '上拉加载更多',
              loadingContent: '加载中...'
            },
            pulldownConfig:{
              content: '下拉刷新',
              downContent: '松开进行加载',
              upContent: '下拉刷新数据',
              loadingContent: '加载中...'
            }
          }
      },
      computed:{
          //取数据显示中文标签，改为getters
          topics:function () {
            return this.$store.state.topics;
          }
      },
      beforeRouteEnter:function (to,from,next) {
        //进入组件前的回调操作，不能使用this
        //to表示待进入的路由
        //from表示离开的路由
        //next表示钩子函数，执行下一步操作

        next(function (vm) {
          vm.$http.get('/topics',{
            params:{
              // to.params.name
              tab:to.params.name,
              limit:vm.limit,
              page:vm.page
            }
          }).then(function (response) {
            // console.log(response.data.success);
            if(response.data.success){
              // console.log(response);
              vm.lists=response.data.data;
            }
          });
        });
      },
      beforeRouteUpdate:function (to,from,next) {
        //组件已经创建，可以使用this
        //ajax为异步请求，里面不能使用this，需要保存一下this
        var app=this;
        this.$http.get('/topics',{
          params:{
            tab:to.params.name,
            limit:this.limit,
            page:this.page
          }
        }).then(function (response) {
          if(response.data.success){
            app.lists=response.data.data;
          }
        });
        next();
      }

    }
</script>

<style scoped>
  .cell_title{
    font-size: .8em;
  }
  .cell_title .reply_count{
    color: #9e78c0;
  }
  .cell_title .visit_count{
    color: #b4b4b4;
  }
  .cell_title .top{
    background: #80bd01;
    padding: 2px 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -o-border-radius: 3px;
    color: #fff;
    font-size: 12px;
  }
  .cell_title .tab{
    background-color: #e5e5e5;
    color: #999;
    padding: 2px 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -o-border-radius: 3px;
    font-size: 12px;
  }
  .cell_author_avatar img{
    width: 30px;
    height: 30px;
    border-radius: 3px;
  }
</style>


























