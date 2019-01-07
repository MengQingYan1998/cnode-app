<template>
  <div>
    center page
  </div>
</template>

<script>
    export default {
        name: "Center",
      computed:{
          loginname:function(){
            return this.$store.state.loginname;
          }
      },
      created:function () {
        this.$router.replace('/user/'+this.loginname);
      }
    }
</script>

<style scoped>

</style>
