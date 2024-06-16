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
import { SEX_OPTION } from './constants';
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
      const { startTime, endTime, enabledFlag } = data;
      const params = {
        ...data,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      console.log(data, params, 'data');
      const fetchUrl = row ? Url.updateUsers : Url.addUser;
      setConfirmLoading(true);
      $fetch(fetchUrl, params)
        .then((res) => {
          Notification.success({
            title: '成功',
            content: res?.message || '操作成功',
          });
          handleClose(true);
        })
        .finally(() => {
          setConfirmLoading(false);
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
      <Form form={form} labelAlign="left" labelCol={{ span: 5 }}>
        <Form.Item label="姓名" field="userName" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="工号" field="empNum" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="性别" field="gender" rules={[{ required: true }]}>
          <Select options={SEX_OPTION} allowClear />
        </Form.Item>
        <Form.Item label="邮箱" field="email">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="组织" field="orgId">
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchOrg)}
            allowClear
          />
        </Form.Item>
        <Form.Item label="上级" field="supUserId">
          <Select options={SEX_OPTION} allowClear />
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
        <Form.Item label="办公地点" field="officeLocation">
          <Input allowClear />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
