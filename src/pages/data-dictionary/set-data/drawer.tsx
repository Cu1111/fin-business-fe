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
  dictExtConfig: Array<any>;
  row: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row, dictExtConfig } = props;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [form] = useForm();

  const handleSubmit = async () => {
    try {
      await form.validate();
      const data = form.getFields();
      const { startTime, endTime, enabledFlag, dictType } = data;
      const { id: dictTypeId, value } = dictType;
      const attributeValue = dictExtConfig.reduce((acc, config) => {
        const { extColumnField, extType } = config;
        if (extType === 'input') {
          acc[extColumnField] = data[extColumnField];
        }
        if (extType === 'list') {
          acc[extColumnField] = data[extColumnField]?.value;
        }
        return acc;
      }, {});
      const params = {
        ...data,
        ...attributeValue,
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
    } catch (err) {
      console.log(err);
      Message.error('校验失败');
    }
  };

  useEffect(() => {
    if (row) {
      const {
        enabledFlag,
        dictType,
        dictTypeId,
        dictDesc,
        attributeData,
        ...other
      } = row;
      const attributes = (attributeData || []).reduce(
        (acc, { attribute, attributeData, attributeValue }) => {
          const type = dictExtConfig.find(
            (v) => v.extColumnField === attribute
          ).extType;
          if (type === 'input') {
            acc[attribute] = attributeValue;
          }
          if (type === 'list') {
            if (attributeData?.[0]) {
              const { dictCode, dictName } = attributeData?.[0];
              acc[attribute] = { value: dictCode, label: dictName };
            } else {
              acc[attribute] = null;
            }
          }
          return acc;
        },
        {}
      );
      const data = {
        ...other,
        ...attributes,
        dictType: { value: dictType, label: dictDesc, id: dictTypeId },
        enabledFlag: enabledFlag === 'Y',
      };
      console.log(data, 'data');
      form.setFieldsValue(data);
    }
  }, []);

  const getContent = (type, extDictType) => {
    if (type === 'input') {
      return <Input allowClear />;
    }
    if (type === 'list' && extDictType) {
      return (
        <FormSelect
          showSearch
          onFetchData={DataFetch(Url.searchDictValues, {
            dictType: extDictType,
          })}
          labelInValue
          renderLabel={(v) => `${v.value}/${v.label}`}
          allowClear
        />
      );
    }
    return <></>;
  };

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
        <Form.Item
          label="类型"
          field="dictType"
          rules={[{ required: true, message: '必填' }]}
        >
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
          rules={[{ required: true, message: '必填' }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="选项描述"
          field="dictName"
          rules={[{ required: true, message: '必填' }]}
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
        {dictExtConfig.reduce((acc, config) => {
          const {
            enabledFlag,
            extColumnField,
            extColumnFieldName,
            extDictType,
            extType,
          } = config;
          if (enabledFlag === 'Y') {
            acc.push(
              <Form.Item
                key={extColumnField}
                label={extColumnFieldName}
                field={extColumnField}
              >
                {getContent(extType, extDictType)}
              </Form.Item>
            );
          }
          return acc;
        }, [])}
        {/* <Form.Item label="开始时间" field="startTime">
          <DatePicker />
        </Form.Item>
        <Form.Item label="结束时间" field="endTime">
          <DatePicker />
        </Form.Item> */}
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
