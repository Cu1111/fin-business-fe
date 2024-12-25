import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker as dp,
  Drawer,
  Switch,
  Message,
  Notification,
  Button,
  Typography,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import FormSelect from '@/components/formSelect';
import styles from './style/index.module.less';
import EditableTable from './editTable';

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
  const extConfigTableRef = useRef();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const { enabledFlag } = data;
      console.log(enabledFlag, 'enabledFlag');
      const params = {
        ...data,
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      console.log(data, params, 'data');
      const fetchUrl = row ? Url.updateDictType : Url.addDictType;
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
    console.log('rowwwww', row);
    if (row) {
      const { enabledFlag, ...other } = row;
      form.setFieldsValue({ ...other, enabledFlag: enabledFlag === 'Y' });
    } else {
      form.setFieldsValue(null);
    }
  }, [form, row]);

  return (
    <Drawer
      width={900}
      title={<span>{row ? '编辑' : '新增'}</span>}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
      onCancel={() => {
        handleClose();
      }}
      maskClosable={false}
      unmountOnExit
    >
      <div className={styles['dict-type-title']}>
        <span>基本信息</span>
      </div>

      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          label="类型Code"
          field="dictType"
          rules={[{ required: true }]}
        >
          <Input disabled={!!row} allowClear />
        </Form.Item>
        <Form.Item
          label="类型描述"
          field="dictDesc"
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
      </Form>
      <div className={styles['dict-type-title']}>
        <span>辅助字段</span>
        <Button type="primary">新增</Button>
      </div>
      <EditableTable ref={extConfigTableRef} />
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
