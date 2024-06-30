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
        dictMapClassValue,
        dictMapTypeValue,
        dictMapSourceType,
        dictMapTargetType,
        startTime,
        endTime,
        enabledFlag,
      } = data;
      const params = {
        ...data,
        dictMapClassValue: dictMapClassValue?.value,
        dictMapTypeValue: dictMapTypeValue?.value,
        dictMapSourceType: dictMapSourceType?.value,
        dictMapTargetType: dictMapTargetType?.value,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      const fetchUrl = row ? Url.updateDictMap : Url.addDictMap;

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
        dictMapClassValue,
        dictMapClassValueDesc,
        dictMapTypeValue,
        dictMapTypeValueDesc,
        dictMapTargetType,
        dictMapTargetTypeDesc,
        dictMapSourceType,
        dictMapSourceTypeDesc,
        enabledFlag,
        ...other
      } = row;
      const data = {
        ...other,
        dictMapClassValue: {
          label: dictMapClassValueDesc,
          value: dictMapClassValue,
        },
        dictMapTypeValue: {
          label: dictMapTypeValueDesc,
          value: dictMapTypeValue,
        },
        dictMapTargetType: {
          label: dictMapTargetTypeDesc,
          value: dictMapTargetType,
        },
        dictMapSourceType: {
          label: dictMapSourceTypeDesc,
          value: dictMapSourceType,
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
          label="映射分类代码"
          field="dictMapClassValue"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'MAP_CLASS',
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="映射类型代码"
          field="dictMapTypeValue"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'MAP_TYPE',
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="来源类型"
          field="dictMapSourceType"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="目标类型"
          field="dictMapTargetType"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
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
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
