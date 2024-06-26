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
      const { startTime, endTime, enabledFlag, dictType } = data;
      const { id: dictTypeId, value } = dictType;
      const params = {
        ...data,
        dictTypeId,
        dictType: value,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      console.log(data, params, 'data');
      const fetchUrl = row ? Url.updateDictValues : Url.addDictValues;
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
      const { enabledFlag, dictType, dictTypeId, dictDesc, ...other } = row;
      console.log(row, 'row');
      const data = {
        ...other,
        dictType: { value: dictType, label: dictDesc, id: dictTypeId },
        enabledFlag: enabledFlag === 'Y',
      };
      console.log(data, 'data');
      form.setFieldsValue(data);
    }
  }, []);

  return (
    <Drawer
      width={400}
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
        <Form.Item label="类型" field="dictType" rules={[{ required: true }]}>
          <FormSelect
            showSearch
            labelInValue
            onFetchData={DataFetch(Url.searchDictType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            keyValue="id"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="选项Code"
          field="dictCode"
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="选项描述"
          field="dictName"
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="是否启用"
          field="enabledFlag"
          triggerPropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="开始时间" field="startTime">
          <DatePicker />
        </Form.Item>
        <Form.Item label="结束时间" field="endTime">
          <DatePicker />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
