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
      const { segmentType } = data;
      const params = {
        ...data,
        segmentType: segmentType.value,
      };
      console.log(data, params, 'data');
      const fetchUrl = row ? Url.updateAccStructure : Url.addAccStructure;
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
      const { enabledFlag, segmentType, segmentTypeDesc, ...other } = row;
      const data = {
        ...other,
        enabledFlag: enabledFlag === 'Y',
      };
      if (segmentType) {
        data.segmentType = { value: segmentType, label: segmentTypeDesc };
      }

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
        labelAlign="right"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Form.Item
          label="会计科目结构"
          field="accStructureCode"
          rules={[{ required: true }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'ACC_STRUCTURE',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item label="段值" field="segment" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="段值描述" field="segmentDesc">
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="数据字典类型"
          field="dictType"
          rules={[{ required: true }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item label="段值类型" field="segmentType">
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.getSegmentType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
            allowClear
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
