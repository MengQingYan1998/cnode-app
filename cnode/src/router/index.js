import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home';
import TopicList from '@/components/TopicList'
import Topic from '@/components/Topic'
import Login from '@/components/Login'
import Center from '@/components/Center'
import Message from '@/components/Message'
import Logout from '@/components/Logout'
import User from '@/components/User'
import Create from '@/components/Create'
import Edit from '@/components/Edit'

Vue.use(Router)

const routes= [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  {
    path:'/',
    redirect:'/topiclist/all'
  },
  {
    path:'/topiclist/:name',
    name:"topiclist",
    component:TopicList,
    props:true
  },
  {
    path:'/topic/:id',
    name:'topic',
    component:Topic,
    props:true
  },
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/center',
    name:'center',
    component:Center
  },
  {
    path:'/message',
    name:'message',
    component:Message
  },
  {
    path:'/logout',
    name:'logout',
    component:Logout
  },
  {
    path:'/user/:uname',
    name:'user',
    component:User,
    props:true
  },
  {
    path:'/create',
    name:'create',
    component:Create
  },
  {
    path:'/topic/:id/edit',
    name:'edit',
    component:Edit,
    props:true
  }

  ];

export default new Router({
  routes
})
