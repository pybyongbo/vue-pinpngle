import axios from 'axios';
import qs from 'qs';

function axiosPost (options) {
  axios({
    url: options.url,
    method: 'post',
    // header: {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // },
    data: qs.stringify({
      ...options.data,
    })
  })
  .then((res) => {
    options.success(res.data);
  })
  .catch((err) => {
    options.error(err);
  })
}

function axiosGet (options) {
  axios(options.url)
    .then((res) => {
      options.success(res.data);
    })
    .catch((err) => {
      options.error(err);
    });
}

export {
  axiosGet,
  axiosPost
}