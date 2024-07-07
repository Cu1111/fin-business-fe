import React, { useState, useEffect } from 'react';
import {
  Form,
  DatePicker as dp,
  Drawer,
  Switch,
  Message,
  Notification,
  Input,
} from '@arco-design/web-react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import FormSelect from '@/components/formSelect';

import { $fetch, DataFetch } from '@/utils';
import Url from './url';

interface DrawerFormProps {
  visible: boolean;
  handleClose: (refresh?: boolean) => void;
  dictMapData: any;
  row: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row, dictMapData } = props;
  const { dictMapSourceType, dictMapTargetType } = dictMapData;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const { dictMapId } = useParams();

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const {
        sourceTypeValue,
        targetTypeValue,
        startTime,
        endTime,
        enabledFlag,
      } = data;
      const params = {
        dictMapId,
        ...data,
        sourceTypeValue: sourceTypeValue?.value,
        targetTypeValue: targetTypeValue?.value,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      const fetchUrl = row ? Url.updateDictMapValues : Url.addDictMapValues;

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
      const {
        sourceTypeValue,
        sourceTypeValueName,
        targetTypeValue,
        targetTypeValueName,
        enabledFlag,
        ...other
      } = row;
      const data = {
        ...other,
        sourceTypeValue: {
          label: sourceTypeValueName,
          value: sourceTypeValue,
        },
        targetTypeValue: {
          label: targetTypeValue,
          value: targetTypeValueName,
        },
        enabledFlag: enabledFlag === 'Y',
      };
      form.setFieldsValue(data);
    }
  }, []);

  const onFieldValueChange = (value, values) => {
    console.log(value, values, 'onFieldValueChange');
  };

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
        onChange={onFieldValueChange}
      >
        <Form.Item
          label="来源编码"
          field="sourceTypeValue"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: dictMapSourceType,
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="目标编码"
          field="targetTypeValue"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: dictMapTargetType,
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
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

        <Form.Item label="备注" field="comment">
          <Input.TextArea maxLength={100} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
