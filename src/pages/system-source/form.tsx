import React, { useContext } from 'react';
import { Form, Button, Grid, Input } from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconSearch } from '@arco-design/web-react/icon';
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
            <Form.Item label="业务系统" field="systemSourceCode">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'SYSTEM_SOURCE',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="日记账来源" field="jeSource">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'JE_SOURCE',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="核算主体" field="comCode">
              <Input allowClear placeholder="请输入" />
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
