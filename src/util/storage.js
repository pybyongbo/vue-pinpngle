/**
 * 本地持久化操作对象
 */
let localStorage = {
    setSkin(key) {
      window.localStorage.setItem("skin", key);
    },
    getSkin() {
      let skin = window.localStorage.getItem("skin");
      return !skin ? "three" : skin;
    },

  };
  
  export default localStorage
  