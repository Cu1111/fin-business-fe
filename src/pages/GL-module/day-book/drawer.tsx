import React, { useEffect, useMemo, useState, useRef } from 'react';
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

  const periodName: any = Form.useFormState('periodName', form) || null;

  const dCurrencyCode = useRef(null);

  // const [accBookDict, setAccBookDict] = useState(null);
  // const [currencyCode, setCurrencyCode] = useState(null);
  // const [periodName]: any = Form.useFormState('periodName', form) || null;

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

      $fetch(Url.searchDictValues, {
        dictType: 'ACC_BOOK',
        dictCode: accBookDictCode,
      }).then((res) => {
        if (res.length) {
          console.log(
            res[0]?.attributeData,
            res[0]?.attributeData.find((v) => v.attribute === 'attribute2'),
            ' res[0]?.attributeData'
          );
          dCurrencyCode.current = res[0]?.attributeData.find(
            (v) => v.attribute === 'attribute2'
          )?.attributeData?.[0].dictCode;
        } else {
          Notification.error({
            title: '失败',
            content: '账套未配置币种',
          });
        }
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
      });
    }
  }, [form, row]);

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
          label="账套"
          field="accBookDictCode"
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData, form) => {
            return (
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'ACC_BOOK',
                })}
                onChange={(v) => {
                  if (v) {
                    const data =
                      v.attributeData?.find((attr) => {
                        return attr.attribute === 'attribute2';
                      }) || {};
                    dCurrencyCode.current = data?.attributeData?.[0]?.dictCode;
                    if (!dCurrencyCode.current) {
                      Notification.error({
                        title: '失败',
                        content: '账套未配置币种',
                      });
                    }
                  } else {
                    dCurrencyCode.current = null;
                  }
                  form.setFieldsValue({
                    periodName: null,
                    currencyCode: null,
                    exchangeRateTypeDictCode: null,
                    exchangeRateTime: null,
                    exchangeRate: null,
                    jeBatchId: null,
                  });
                }}
                labelInValue
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            );
          }}
        </Form.Item>
        <Form.Item
          label="期间"
          field="periodName"
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData) => {
            const { accBookDictCode } = formData;
            const { value } = accBookDictCode || {};
            return (
              <FormSelect
                showSearch
                disabled={!accBookDictCode}
                onFetchData={DataFetch(Url.glPeriodSearch, {
                  appModuleDictCode: 'GL',
                  accBookDictCode: value,
                  periodStatus: 'O',
                })}
                onChange={() => {
                  form.setFieldsValue({
                    exchangeRateTypeDictCode: null,
                    currencyCode: null,
                    exchangeRateTime: null,
                    exchangeRate: null,
                    jeBatchId: null,
                  });
                }}
                labelValue="value"
                allowClear
              />
            );
          }}
        </Form.Item>

        <Form.Item label="日记账批名" field="jeBatchId">
          {(formData) => {
            const { accBookDictCode, periodName } = formData;
            console.log(
              'accBookDictCode',
              accBookDictCode,
              'periodName',
              periodName
            );
            return (
              <FormSelect
                showSearch
                disabled={!accBookDictCode || !periodName}
                onFetchData={DataFetch(Url.searchGlJeBatches, {
                  periodName,
                  accBookDictCode: accBookDictCode?.value,
                  postStatusList: ['N', 'E'],
                })}
                keyValue="id"
                labelValue="label"
                labelInValue
                allowClear
              />
            );
          }}
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
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData, form) => {
            const { accBookDictCode } = formData;
            return (
              <FormSelect
                showSearch
                disabled={!accBookDictCode}
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'CURRENCY',
                })}
                onChange={(v) => {
                  if (v && v === dCurrencyCode.current) {
                    form.setFieldsValue({
                      exchangeRateTypeDictCode: {
                        value: 'User',
                        label: '用户自定义汇率类型',
                      },
                      exchangeRateTime: dayjs(periodName?.value),
                      exchangeRate: '1.00',
                    });
                  } else {
                    form.setFieldsValue({
                      exchangeRateTypeDictCode: null,
                      exchangeRateTime: null,
                      exchangeRate: null,
                    });
                  }
                }}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            );
          }}
        </Form.Item>
        <Form.Item
          label="汇率类型"
          field="exchangeRateTypeDictCode"
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData) => {
            const { accBookDictCode, currencyCode } = formData;
            const sameCurrency = currencyCode === dCurrencyCode.current;
            return (
              <FormSelect
                showSearch
                disabled={!accBookDictCode || !currencyCode || sameCurrency}
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'EXCHANGE_RATE_TYPE',
                })}
                labelInValue
                allowClear
              />
            );
          }}
        </Form.Item>

        <Form.Item
          label="汇率日期"
          field="exchangeRateTime"
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData) => {
            const { accBookDictCode, currencyCode, exchangeRateTypeDictCode } =
              formData;
            console.log(formData, 'formData1111');
            const sameCurrency = currencyCode === dCurrencyCode.current;
            return (
              <DatePicker
                disabled={!accBookDictCode || !currencyCode || sameCurrency}
                onChange={(v) => {
                  if (
                    v &&
                    exchangeRateTypeDictCode?.value &&
                    currencyCode &&
                    dCurrencyCode.current
                  ) {
                    $fetch(Url.getExchangeRate, {
                      exchangeRateTime: dayjs(v).valueOf(),
                      currencyFrom: currencyCode,
                      currencyTo: dCurrencyCode.current,
                      exchangeRateTypeDictCode: exchangeRateTypeDictCode?.value,
                      page: { pageNo: 1, pageSize: 20 },
                    }).then((res) => {
                      const { pageList } = res;
                      if (pageList.length) {
                        const { exchangeRate } = pageList?.[0];
                        form.setFieldValue('exchangeRate', exchangeRate);
                      } else {
                        Notification.error({
                          title: '失败',
                          content: '汇率未维护',
                        });
                      }
                    });
                  }
                }}
              />
            );
          }}
        </Form.Item>
        <Form.Item
          label="汇率"
          field="exchangeRate"
          shouldUpdate
          rules={[{ required: true, message: '必填' }]}
        >
          {(formData) => {
            const { accBookDictCode, currencyCode, exchangeRateTypeDictCode } =
              formData;
            const sameCurrency = currencyCode === dCurrencyCode.current;
            return (
              <InputNumber
                disabled={
                  !accBookDictCode ||
                  !currencyCode ||
                  sameCurrency ||
                  ['Average Rate', 'END Rate'].includes(
                    exchangeRateTypeDictCode?.value
                  )
                }
                min={0}
                step={0.000001}
                precision={1}
              />
            );
          }}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

DrawerForm.displayName = 'DrawerForm';
export default DrawerForm;
