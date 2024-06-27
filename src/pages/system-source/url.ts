import prefix from '@/utils/urlPrefix';

const Url = {
  getSystemSource: `${prefix}/base/getSystemSource`,
  addSystemSource: `${prefix}/base/addSystemSource`,
  updateSystemSource: `${prefix}/base/updateSystemSource`,
  searchDictValues: `${prefix}/base/searchDictValues`,
  searchDictType: `${prefix}/base/searchDictType`,
  // 核算主体
  getSystemSourceCom: `${prefix}/base/getSystemSourceCom`,
  addSystemSourceCom: `${prefix}/base/addSystemSourceCom`,
  updateSystemSourceCom: `${prefix}/base/updateSystemSourceCom`,
  // 字段映射
  getSystemSourceComMap: `${prefix}/base/getSystemSourceComMap`,
  addSystemSourceComMap: `${prefix}/base/addSystemSourceComMap`,
  updateSystemSourceColumnMap: `${prefix}/base/updateSystemSourceColumnMap`,
};

export default Url;
