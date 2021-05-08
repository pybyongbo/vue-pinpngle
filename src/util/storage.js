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

    // 设置当前登录用户信息
    setCurrentUser(obj) {
      window.localStorage.setItem("cuser", JSON.stringify(obj));
    },

    getCurrentUser() {
      let cuser = window.localStorage.getItem("cuser");
      return !cuser ? null : cuser;
    },

  };
  
  export default localStorage
  