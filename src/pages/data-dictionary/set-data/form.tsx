import React, { useContext } from 'react';
import { Form, Select, Button, Grid } from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconSearch } from '@arco-design/web-react/icon';
import { ENABLE_FLAG } from './constants';
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

  const handleSubmit = async () => {
    try {
      await form.validate();
      const values = form.getFieldsValue();
      props.onSearch(values);
    } catch {}
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item
              label="类型"
              field="dictType"
              rules={[{ required: true, message: '必填' }]}
            >
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictType)}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="是否启用" field="empNum">
              <Select placeholder="请选择" options={ENABLE_FLAG} allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
      </div>
    </div>
  );
}

SearchForm.displayName = 'SearchForm';
export default SearchForm;
