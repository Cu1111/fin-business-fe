import React, { useState, useEffect } from 'react';
import {
  Form,
  DatePicker as dp,
  Drawer,
  Switch,
  Message,
  Notification,
  Input,
  Select,
} from '@arco-design/web-react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import FormSelect from '@/components/formSelect';
import { JIEDAI_FLAG, MONEYDIR_FLAG } from './constants';

import { $fetch, DataFetch } from '@/utils';
import Url from './url';

interface DrawerFormProps {
  visible: boolean;
  handleClose: (refresh?: boolean) => void;
  ruleData: any;
  row: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row } = props;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const { accRuleId } = useParams();

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const { startTime, endTime, enabledFlag } = data;
      const params: any = {
        accRuleId,
        ...data,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      const fetchUrl = row ? Url.updateAccRuleLine : Url.addAccRuleLine;

      if (row) {
        const { accRuleLineId } = row;
        params.accRuleLineId = accRuleLineId;
      }

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
      const { enabledFlag, amountDir, ...other } = row;
      const data = {
        ...other,
        amountDir: '' + amountDir,
        enabledFlag: enabledFlag === 'Y',
      };
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Form.Item label="借/贷" field="drCr" rules={[{ required: true }]}>
          <Select options={JIEDAI_FLAG} allowClear />
        </Form.Item>
        <Form.Item
          label="金额方向"
          field="amountDir"
          rules={[{ required: true }]}
        >
          <Select options={MONEYDIR_FLAG} allowClear />
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
