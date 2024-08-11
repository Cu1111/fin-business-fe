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
  getSSCom: `${prefix}/base/getSSCom`,

  // 字段映射
  getSystemSourceColumnMap: `${prefix}/base/getSystemSourceColumnMap`,
  addSystemSourceColumnMap: `${prefix}/base/addSystemSourceColumnMap`,
  updateSystemSourceColumnMap: `${prefix}/base/updateSystemSourceColumnMap`,
  getDBColumn: `${prefix}/base/getDBColumn`,
};

export default Url;
