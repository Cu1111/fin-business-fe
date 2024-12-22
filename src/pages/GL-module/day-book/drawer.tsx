import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker as dp,
  Drawer,
  Message,
  Notification,
} from '@arco-design/web-react';
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

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const fetchUrl = row ? Url.updateGlJeHeaders : Url.insertGlJeHeaders;
      $fetch(fetchUrl, { ...data, accBookDictType: 'ACC_BOOK' }).then((res) => {
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
          label="期间"
          field="periodName"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.glPeriodSearch, {
              appModuleDictCode: 'GL',
              accBookDictCode: 'PRC',
            })}
            labelValue="value"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="账套"
          field="accBookDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'ACC_BOOK',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="日记账批名称"
          field="jeBatchName"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input allowClear placeholder="请输入" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
