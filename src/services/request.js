import { axiosGet } from '@/libs/http';

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

export {
  checkuserLogin
}