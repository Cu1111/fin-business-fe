import $fetch from './$fetch';

// TODO: 后续可以增加更多配置使filter可调整
const DataFetch = (url: string, params?, callback?) => {
  return async function (filter) {
    const data = await $fetch(url, { filter, ...params });
    if (callback) {
      return callback(data);
    }
    return data;
  };
};

export default DataFetch;
