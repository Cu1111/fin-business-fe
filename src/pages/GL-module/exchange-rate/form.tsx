import React, { useContext } from 'react';
import {
  Form,
  Button,
  Grid,
  InputNumber,
  DatePicker as dp,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconSearch } from '@arco-design/web-react/icon';
import FormSelect from '@/components/formSelect';
import { DataFetch } from '@/utils';
import dayjs from 'dayjs';

import Url from './url';
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
    const { exchangeRateTime } = values;

    props.onSearch({
      ...values,
      exchangeRateTime: exchangeRateTime && dayjs(exchangeRateTime).valueOf(),
      exchangeRateTypeDictType: 'EXCHANGE_RATE_TYPE',
      currencyDictType: 'CURRENCY',
    });
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
          <Col span={colSpan}>
            <Form.Item label="汇率类型" field="exchangeRateTypeDictCode">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'EXCHANGE_RATE_TYPE',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="汇率日期" field="exchangeRateTime">
              <DatePicker />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label="币种从" field="currencyFrom">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'CURRENCY',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="币种至" field="currencyTo">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'CURRENCY',
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="汇率" field="exchangeRate">
              <InputNumber min={0} step={0.000001} precision={1} />
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
