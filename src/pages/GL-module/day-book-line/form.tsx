import React, { useContext } from 'react';
import { Form, Button, Grid, Input, Select } from '@arco-design/web-react';
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
  accStructure: any;
}) {
  const { accStructure } = props;
  const { lang } = useContext(GlobalContext);

  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch({ ...values, accBookDictType: 'ACC_BOOK' });
  };

  const colSpan = lang === 'zh-CN' ? 8 : 12;

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Row gutter={24}>
          {(accStructure || []).map((config) => {
            const { segmentDesc, segment, dictType } = config;
            return (
              <Col span={colSpan} key={segment}>
                <Form.Item label={segmentDesc} field={segment}>
                  <FormSelect
                    showSearch
                    onFetchData={DataFetch(Url.searchDictValues, {
                      dictType: dictType,
                    })}
                    renderLabel={(v) => `${v.value}/${v.label}`}
                    allowClear
                  />
                </Form.Item>
              </Col>
            );
          })}
          <Col span={colSpan}>
            <Form.Item label="行描述" field="lineDesc">
              <Input allowClear />
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
