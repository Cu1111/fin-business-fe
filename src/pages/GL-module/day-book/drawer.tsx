import React, { useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  DatePicker as dp,
  Drawer,
  Message,
  Notification,
  InputNumber,
} from '@arco-design/web-react';
import FormSelect from '@/components/formSelect';
import dayjs from 'dayjs';

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
  const accBookDict: any = Form.useFormState('accBookDictCode', form) || null;
  const currencyCode: any = Form.useFormState('currencyCode', form) || null;
  const periodName: any = Form.useFormState('periodName', form) || null;

  useEffect(() => {
    console.log(periodName, 'periodName');
    if (!periodName?.value) {
      form.setFieldValue('accBookDictCode', null);
    }
  }, [periodName?.value, form, periodName]);

  const defaultCurrencyCode = useMemo(() => {
    if (accBookDict?.value) {
      const v =
        accBookDict.value?.attributeData?.find((attr) => {
          return attr.attribute === 'attribute2';
        }) || {};
      return v?.attributeData?.[0]?.dictCode;
    } else {
      form.setFieldsValue({
        currencyCode: null,
        exchangeRateTypeDictCode: null,
        exchangeRateTime: null,
        exchangeRate: null,
      });
    }
    return null;
  }, [accBookDict]);

  const sameCurrency = useMemo(() => {
    console.log(currencyCode, 'currencyCode');
    if (
      currencyCode?.value &&
      defaultCurrencyCode &&
      currencyCode?.value === defaultCurrencyCode
    ) {
      return true;
    }
    return false;
  }, [currencyCode, defaultCurrencyCode]);

  useEffect(() => {
    if (sameCurrency) {
      form.setFieldsValue({
        exchangeRateTypeDictCode: {
          value: 'User',
          label: '用户自定义汇率类型',
        },
        exchangeRateTime: dayjs(periodName?.value),
        exchangeRate: '1.00',
      });
    }
  }, [sameCurrency]);

  const handleSubmit = async () => {
    const data = form.getFields();
    console.log(data);
    try {
      await form.validate();
      const data = form.getFields();
      const {
        jeBatchId,
        accBookDictCode,
        exchangeRateTime,
        jeSourceDictCode,
        jeCategoryDictCode,
        exchangeRateTypeDictCode,
      } = data;
      const fetchUrl = row ? Url.updateGlJeHeaders : Url.insertGlJeHeaders;
      $fetch(fetchUrl, {
        ...data,
        jeBatchId: jeBatchId?.id,
        accBookDictCode: accBookDictCode?.value,
        jeSourceDictCode: jeSourceDictCode?.value,
        exchangeRateTime: exchangeRateTime && dayjs(exchangeRateTime).valueOf(),
        jeCategoryDictCode: jeCategoryDictCode?.value,
        exchangeRateTypeDictCode: exchangeRateTypeDictCode?.value,
        accBookDictType: 'ACC_BOOK',
        exchangeRateTypeDictType: 'EXCHANGE_RATE_TYPE',
        jeSourceDictType: 'JE_SOURCE',
        jeCategoryDictType: 'JE_CATEGORY',
      }).then((res) => {
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
      console.log(row);
      const {
        accBookDesc,
        accBookDictCode,
        jeBatchId,
        jeBatchName,
        jeSourceDictCode,
        jeSourceDesc,
        jeCategoryDictCode,
        jeCategoryDesc,
        exchangeRateTypeDictCode,
        ...others
      } = row;

      form.setFieldsValue({
        accBookDictCode: { label: accBookDesc, value: accBookDictCode },
        jeBatchId: { id: jeBatchId, label: jeBatchName },
        jeSourceDictCode: { label: jeSourceDesc, value: jeSourceDictCode },
        jeCategoryDictCode: {
          label: jeCategoryDesc,
          value: jeCategoryDictCode,
        },
        exchangeRateTypeDictCode: {
          label: exchangeRateTypeDictCode,
          value: exchangeRateTypeDictCode,
        },
        ...others,
      });
      console.log(periodName, 'init');
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
            onChange={(v) => {
              console.log(v, 'v');
            }}
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
            disabled={!periodName?.value}
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'ACC_BOOK',
            })}
            labelInValue
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item label="日记账批名" field="jeBatchId">
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchGlJeBatches)}
            keyValue="id"
            labelValue="label"
            labelInValue
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="日记账名称"
          field="jeHeaderName"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input allowClear placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="日记账来源"
          field="jeSourceDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'JE_SOURCE',
            })}
            labelInValue
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="日记账类别"
          field="jeCategoryDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'JE_CATEGORY',
            })}
            labelInValue
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="币种"
          field="currencyCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            disabled={!accBookDict?.value}
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'CURRENCY',
            })}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="汇率类型"
          field="exchangeRateTypeDictCode"
          rules={[{ required: true, message: '必填' }]}
        >
          <FormSelect
            showSearch
            disabled={!accBookDict?.value || sameCurrency}
            onFetchData={DataFetch(Url.searchDictValues, {
              dictType: 'EXCHANGE_RATE_TYPE',
            })}
            labelInValue
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="汇率日期"
          field="exchangeRateTime"
          rules={[{ required: true, message: '必填' }]}
        >
          <DatePicker disabled={!accBookDict?.value || sameCurrency} />
        </Form.Item>
        <Form.Item
          label="汇率"
          field="exchangeRate"
          rules={[{ required: true, message: '必填' }]}
        >
          <InputNumber
            disabled={!accBookDict?.value || sameCurrency}
            min={0}
            step={0.000001}
            precision={1}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
