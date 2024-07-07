import React, { useContext } from 'react';
import { Form, Button, Grid } from '@arco-design/web-react';
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
            <Form.Item label="映射分类代码" field="dictMapClassValue">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'MAP_CLASS',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="映射类型代码" field="dictMapTypeValue">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'MAP_TYPE',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="来源类型" field="dictMapSourceType">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictType)}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="目标类型" field="dictMapTargetType">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictType)}
                renderLabel={(v) => `${v.value}/${v.label}`}
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
