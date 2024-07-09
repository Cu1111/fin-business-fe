import prefix from '@/utils/urlPrefix';

const Url = {
  getAccRule: `${prefix}/base/getAccRule`,

  searchDictValues: `${prefix}/base/searchDictValues`,
  searchDictType: `${prefix}/base/searchDictType`,

  // 入账行规则
  addAccRuleLine: `${prefix}/base/addAccRuleLine`,
  updateAccRuleLine: `${prefix}/base/updateAccRuleLine`,
  getAccRuleLine: `${prefix}/base/getAccRuleLine`,

  // 入账明细规则
  addAndUpdateAccRuleDetail: `${prefix}/base/addAndUpdateAccRuleDetail`,
  getAccRuleDetail: `${prefix}/base/getAccRuleDetail`,
};

export default Url;
