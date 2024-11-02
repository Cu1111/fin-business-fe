import React, { useContext } from 'react';
import {
  Form,
  Button,
  Grid,
  DatePicker as dp,
  Input,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

const DatePicker: any = dp;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    // TODO: 需不需要时间戳
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
            <Form.Item label="批号" field="batchNum">
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="业务日期" field="transDate">
              <DatePicker />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="GL日期" field="glDate">
              <DatePicker />
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
