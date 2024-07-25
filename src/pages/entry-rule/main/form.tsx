import React, { useContext } from 'react';
import { Form, Button, Grid, Select } from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconSearch, IconRefresh } from '@arco-design/web-react/icon';
import FormSelect from '@/components/formSelect';
import { DataFetch } from '@/utils';
import Url from './url';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  const colSpan = lang === 'zh-CN' ? 8 : 12;

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label="业务系统" field="systemSourceId">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchSystemSource)}
                keyValue="id"
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="业务类型" field="businessTypeId">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchBusinessType)}
                keyValue="id"
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="业务场景" field="businessSituationId">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchBusinessSituation)}
                keyValue="id"
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="业务事件" field="businessEventId">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchBusinessEvent)}
                keyValue="id"
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="记账账簿" field="accBookDictCode">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'ACC_BOOK',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="是否启用" field="enabledFlag">
              <Select
                options={[
                  { label: '启用', value: 'Y' },
                  { label: '未启用', value: 'N' },
                ]}
                // mode="multiple"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
      </div>
    </div>
  );
}

SearchForm.displayName = 'SearchForm';
export default SearchForm;
