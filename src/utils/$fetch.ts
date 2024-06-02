import axios from 'axios';

const service = axios.create({
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-type': 'application/json',
    token: 'cjx-test',
  },
});

// 请求拦截器
service.interceptors.request.use((error) => {
  // 请求错误处理
  console.log(error);
  Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做处理，例如只返回data部分
    const res = response.data;
    // 如果返回的状态码为200，说明成功，可以直接返回数据
    if (res.status == 1) {
      return res.data;
    } else {
      // 其他状态码都当作错误处理
      // TODO: 这里可以作全局的错误提示统一处理
      return Promise.reject({
        status: res.code,
        data: {
          message: 'Error',
          ...res.data,
        },
      });
    }
  },
  (error) => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);

const $fetch = (url, params) => service.post(url, params);

export default $fetch;
