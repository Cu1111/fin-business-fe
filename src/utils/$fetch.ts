import axios from 'axios';
import { Notification } from '@arco-design/web-react';
import { getCookie } from './cookies';

const service = axios.create({
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-type': 'application/json',
    token: getCookie ? getCookie('ibf_ssoid') : '',
  },
});

// // 请求拦截器
// service.interceptors.request.use((error) => {
//   // 请求错误处理
//   console.log(error);
//   Promise.reject(error);
// });

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 如果返回的状态码为200，说明成功，可以直接返回数据
    if (res.status == 200) {
      const { code, data } = res.data || {};
      if (code === 1) {
        console.log('data', data);
        return data;
      } else if (code === 401) {
        window.location.href = '/login';
      } else {
        Notification.error({
          title: '失败',
          content: data?.message || '请求失败，请稍后重试',
        });
        return Promise.reject({
          data,
        });
      }
    } else {
      // 其他状态码都当作错误处理
      // TODO: 这里可以作全局的错误提示统一处理
      return Promise.reject({
        status: res.status,
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

const $fetch: (url: string, params: any) => any = (url, params) =>
  service.post(url, params);

export default $fetch;
