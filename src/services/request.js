import { axiosGet } from '@/libs/http';
// 检测用户匹配信息
function checkuserLogin({ userName, userId }) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/pic/picture/login?userName=${userName}&userId=${userId}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err);
      }
    });
  })
}

// 查找当前输入的userId模糊匹配
function findUserIds({  userId }) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/pic/picture/findUserIds?userId=${userId}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err);
      }
    });
  })
}
//登录完成获取详细信息
function getDetailInfo({  uid,levels }) {
    return new Promise((resolve, reject) => {
      axiosGet({
        url: `/pic/picture/detail/info?uid=${uid}&levels=${levels}`,
        success(data) {
          resolve(data);
        },
        error(err) {
          reject(err);
        }
      });
    })
  }

export {
  checkuserLogin,
  findUserIds,
  getDetailInfo
}