import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker as dp,
  Drawer,
  Switch,
  Message,
  Notification,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import FormSelect from '@/components/formSelect';

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
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const {
        jeCategory: { label, value },
      } = data;

      const params = {
        ...data,
        jeCategory: value,
        jeCategoryName: label,
      };
      console.log(data, params, 'data');
      const fetchUrl = row ? Url.updateBusinessType : Url.addBusinessType;
      $fetch(fetchUrl, params).then((res) => {
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
      const { jeCategory, jeCategoryName, ...other } = row;

      const data = {
        ...other,
        jeCategory: { value: jeCategory, label: jeCategoryName },
      };
      console.log(data, 'data');

      form.setFieldsValue(data);
    }
  }, []);

  return (
    <Drawer
      width={500}
      title={<span>{row ? '编辑' : '新增'}</span>}
      visible={visible}
      confirmLoading={confirmLoading}
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
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Form.Item
          label="业务类型"
          field="businessTypeCode"
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="业务类型名称"
          field="businessTypeName"
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item label="日记账类别" field="jeCategory">
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'JE_CATEGORY',
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
