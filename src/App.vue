<template>
  <div id="app">
    <HelloWorld msg="选择关卡"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
body,html{padding:0;margin:0}
html{font-size:16px;font-family:Arial,Helvetica,sans-serif}
*{box-sizing:border-box}a,button,input,textarea{-webkit-tap-highlight-color:transparent}
#app {

  text-align: center;
  color: #2c3e50;
  height:100vh;
  overflow: hidden;
}
</style>
