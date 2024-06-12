import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Grid,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import { IconSearch } from '@arco-design/web-react/icon';
import { ENABLE_FLAG } from './constants';
import FormSelect from '@/components/formSelect';

import { DataFetch } from '@/utils';
import Url from './url';

import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;
const RangePicker: any = DatePicker.RangePicker;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const t = useLocale(locale);
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label="组织分类" field="id">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'ORG_TYPE',
                })}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="组织名称" field="name">
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="是否启用" field="contentType">
              <Select placeholder="请选择" options={ENABLE_FLAG} allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          {t['searchTable.form.search']}
        </Button>
        {/* <Button icon={<IconRefresh />} onClick={handleReset}>
          {t['searchTable.form.reset']}
        </Button> */}
      </div>
    </div>
  );
}

export default SearchForm;
