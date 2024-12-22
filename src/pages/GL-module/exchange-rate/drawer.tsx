import React, { useEffect } from 'react';
import {
  Form,
  DatePicker as dp,
  Drawer,
  Message,
  Notification,
  InputNumber,
} from '@arco-design/web-react';
import FormSelect from '@/components/formSelect';
import dayjs from 'dayjs';

import { $fetch, DataFetch } from '@/utils';
import Url from './url';

interface DrawerFormProps {
  visible: boolean;
  handleClose: (refresh?: boolean) => void;
  row: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row } = props;

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const values = form.getFields();
      const { exchangeRateTime } = values;

      const fetchUrl = row ? Url.updateExchangeRate : Url.insertExchangeRate;
      $fetch(fetchUrl, {
        ...values,
        exchangeRateTime: exchangeRateTime && dayjs(exchangeRateTime).valueOf(),
        exchangeRateTypeDictType: 'EXCHANGE_RATE_TYPE',
        currencyDictType: 'CURRENCY',
      }).then((res) => {
        Notification.success({
          title: '成功',
          content: res?.message || '操作成功',
        });
        handleClose(true);
      });
    } catch {
      Message.error('校验失败');
    }
  };

  useEffect(() => {
    if (row) {
      form.setFieldsValue(row);
    }
  }, []);

  return (
    <Drawer
      width={500}
      title={<span>{row ? '编辑' : '新增'}</span>}
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => {
        handleClose();
      }}
      maskClosable={false}
      unmountOnExit={true}
    >
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="汇率类型"
          field="exchangeRateTypeDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'EXCHANGE_RATE_TYPE',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="汇率日期"
          field="exchangeRateTime"
          rules={[{ required: true, message: '必填' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="币种从"
          field="currencyFrom"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'CURRENCY',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="币种至"
          field="currencyTo"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'CURRENCY',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="汇率"
          field="exchangeRate"
          rules={[{ required: true, message: '必填' }]}
        >
          <InputNumber min={0} step={0.000001} precision={1} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
