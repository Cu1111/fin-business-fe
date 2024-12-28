import React, { useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker as dp,
  Drawer,
  Message,
  Notification,
  InputNumber,
} from '@arco-design/web-react';
import FormSelect from '@/components/formSelect';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

import { $fetch, DataFetch } from '@/utils';
import Url from './url';

interface DrawerFormProps {
  visible: boolean;
  handleClose: (refresh?: boolean) => void;
  accStructure: Array<any>;
  row: any;
  jeHeaderId: any;
  headerConfig: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row, accStructure, headerConfig, jeHeaderId } =
    props;

  const [form] = useForm();

  const handleSubmit = async () => {
    const data = form.getFields();
    console.log(data);
    try {
      await form.validate();
      const data = form.getFields();

      const fetchUrl = row ? Url.updateGlJeLines : Url.insertGlJeLines;
      $fetch(fetchUrl, {
        ...data,
        jeHeaderId,
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
      width={600}
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
        {(accStructure || []).map((config) => {
          const { segmentDesc, segment, dictType } = config;
          return (
            <Form.Item
              key={segment}
              label={segmentDesc}
              field={segment}
              rules={[{ required: true, message: '必填' }]}
            >
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: dictType,
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
          );
        })}
        <Form.Item label="日记账行描述" field="lineDesc">
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="输入借方金额"
          field="enterDr"
          rules={[{ required: true, message: '必填' }]}
        >
          <InputNumber
            onBlur={(e) => {
              const { exchangeRate } = headerConfig;
              const s = new BigNumber(e?.target?.value)
                .times(exchangeRate)
                .toFixed(2)
                .toString();
              form.setFieldValue('accountDr', s);
            }}
          />
        </Form.Item>
        <Form.Item
          label="输入贷方金额"
          field="enterCr"
          rules={[{ required: true, message: '必填' }]}
        >
          <InputNumber
            onBlur={(e) => {
              const { exchangeRate } = headerConfig;
              const s = new BigNumber(e?.target?.value)
                .times(exchangeRate)
                .toFixed(2)
                .toString();
              form.setFieldValue('accountCr', s);
            }}
          />
        </Form.Item>
        <Form.Item label="记账借方金额" field="accountDr">
          <Input disabled />
        </Form.Item>
        <Form.Item label="记账贷方金额" field="accountCr">
          <Input disabled />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
