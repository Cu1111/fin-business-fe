import React, { useState, useEffect } from 'react';
import {
  Form,
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
        systemSourceId,
        businessTypeId,
        businessSituationId,
        businessEventId,
        accBookDictCode,
        accStructureDictCode,
        startTime,
        endTime,
        enabledFlag,
      } = data;
      console.log(data);
      const params = {
        ...data,
        systemSourceId: systemSourceId?.id,
        businessTypeId: businessTypeId?.id,
        businessSituationId: businessSituationId?.id,
        businessEventId: businessEventId?.id,
        accBookDictCode: accBookDictCode?.value,
        accStructureDictCode: accStructureDictCode?.value,
        startTime: startTime && dayjs(startTime).valueOf(),
        endTime: endTime && dayjs(endTime).valueOf(),
        enabledFlag: enabledFlag === true ? 'Y' : 'N',
      };
      const fetchUrl = row ? Url.updateAccRule : Url.addAccRule;

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
        systemSourceCode,
        systemSourceId,
        systemSourceName,
        businessTypeId,
        businessTypeName,
        businessTypeCode,
        businessSituationId,
        businessSituationCode,
        businessSituationName,
        businessEventId,
        businessEventName,
        businessEventCode,
        accBookDictCode,
        accBookDictType,
        accStructureDictCode,
        accStructureDictType,
        enabledFlag,
        ...other
      } = row;
      const data = {
        ...other,
        systemSourceId: {
          id: systemSourceId,
          label: systemSourceName,
          value: systemSourceCode,
        },
        businessTypeId: {
          id: businessTypeId,
          label: businessTypeName,
          value: businessTypeCode,
        },
        businessSituationId: {
          id: businessSituationId,
          label: businessSituationName,
          value: businessSituationCode,
        },
        businessEventId: {
          id: businessEventId,
          label: businessEventName,
          value: businessEventCode,
        },
        accBookDictCode: {
          label: accBookDictType,
          value: accBookDictCode,
        },
        accStructureDictCode: {
          label: accStructureDictType,
          value: accStructureDictCode,
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
          label="系统来源"
          field="systemSourceId"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchSystemSource)}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            keyValue="id"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="业务类型"
          field="businessTypeId"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchBusinessType)}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            keyValue="id"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="业务场景"
          field="businessSituationId"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchBusinessSituation)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
            keyValue="id"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="业务事件"
          field="businessEventId"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchBusinessEvent)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
            keyValue="id"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="记账账簿"
          field="accBookDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'ACC_BOOK',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            labelInValue
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="业财维度结构"
          field="accStructureDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'ACC_STRUCTURE',
            })}
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
