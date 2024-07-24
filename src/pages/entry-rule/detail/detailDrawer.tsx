import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Form,
  Button,
  Drawer,
  Switch,
  Table,
  Modal,
  PaginationProps,
  TableColumnProps,
  Notification,
  Message,
  Select,
  DatePicker as dp,
  Input,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import FormSelect from '@/components/formSelect';
import { JIEDAI_FLAG, MONEYDIR_FLAG, DATAMAP_FLAG } from './constants';
import cloneDeep from 'lodash/cloneDeep';

import { $fetch, DataFetch } from '@/utils';
import Url from './url';

interface DrawerFormProps {
  visible: boolean;
  handleClose: (refresh?: boolean) => void;
  row: any;
}

const { useForm } = Form;

const DatePicker: any = dp;

const DetailDrawer: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row } = props;
  const { accRuleLineId } = row;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalShow, setModalShow] = useState<boolean>(false);

  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 100,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const rowRef = useRef(null);

  const [form] = useForm();

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    $fetch(Url.getAccRuleDetail, {
      accRuleLineId,
      page: {
        pageNo: current,
        pageSize,
      },
    })
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '段',
        dataIndex: 'segmentDesc',
        width: 100,
      },
      {
        title: '取值类型',
        dataIndex: 'valueType',
        render: (v) => {
          if (v) {
            return DATAMAP_FLAG.find((obj) => {
              if (obj.value === v) {
                return true;
              }
            }).label;
          }
          return '';
        },
        width: 120,
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 180,
      },
      {
        title: '说明',
        dataIndex: 'description',
        width: 180,
      },
      {
        title: '数据映射源字段',
        dataIndex: 'dataMapSourceColumn',
        width: 200,
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        render: (v) => <Switch checked={v === 'Y'} />,
        width: 100,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
        width: 100,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 200,
        render: (_, row) => (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              rowRef.current = row;
              setModalShow(true);
            }}
          >
            编辑
          </Button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (modalShow && rowRef.current != null) {
      console.log('rowRef.current', rowRef.current);
      const { enabledFlag, value, description, ...other } = rowRef.current;
      const formData = {
        ...other,
        enabledFlag: enabledFlag === 'Y',
      };
      if (value) {
        formData.value = { value, label: description };
      }
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [form, modalShow]);

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  return (
    <Drawer
      width={800}
      title="入账明细规则"
      visible={visible}
      footer={null}
      onCancel={() => {
        handleClose();
      }}
      maskClosable={false}
      unmountOnExit={true}
    >
      <Table
        rowKey="dictValueId"
        loading={loading}
        onChange={onChangeTable}
        // pagination={pagination}
        columns={columns}
        scroll={{ x: true, y: true }}
        data={data}
      />
      {modalShow && (
        <Modal
          style={{ width: '600px' }}
          title={<div style={{ textAlign: 'left' }}>编辑</div>}
          maskClosable={false}
          visible
          onCancel={() => {
            setModalShow(false);
          }}
          onOk={async () => {
            try {
              await form.validate();
              const formData = form.getFields();
              const { enabledFlag, endTime, startTime, value } = formData;
              const lineData = {
                ...formData,
                value: value?.value,
                systemSourceId: row?.systemSourceId,
                enabledFlag: enabledFlag === true ? 'Y' : 'N',
                endTime: endTime && dayjs(endTime).valueOf(),
                startTime: startTime && dayjs(startTime).valueOf(),
              };
              const index = data.findIndex(
                (v) => v.segment === formData.segment
              );
              const params = cloneDeep(data).toSpliced(index, 1, lineData);
              return $fetch(Url.addAndUpdateAccRuleDetail, params).then(
                (res) => {
                  setModalShow(false);
                  Notification.success({
                    title: '成功',
                    content: res?.message || '操作成功',
                  });
                }
              );
            } catch {
              Message.error('校验失败');
              return Promise.reject();
            }
          }}
        >
          <Form
            form={form}
            labelAlign="right"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            onChange={(data) => {
              if (Object.keys(data).includes('valueType')) {
                form.setFieldsValue({ value: null });
              }
            }}
          >
            <Form.Item label="段" field="segmentDesc" disabled>
              <>{rowRef.current?.segmentDesc}</>
            </Form.Item>

            <Form.Item
              label="取值类型"
              field="valueType"
              rules={[{ required: true, message: '必填' }]}
            >
              <Select options={DATAMAP_FLAG} allowClear />
            </Form.Item>

            <Form.Item
              label="值"
              field="value"
              shouldUpdate
              rules={[{ required: true, message: '必填' }]}
            >
              {(formData) => {
                const { valueType, segment } = formData;
                return (
                  <FormSelect
                    showSearch
                    onFetchData={DataFetch(Url.getAccRulValue, {
                      accRuleLineId,
                      segment,
                      valueType,
                    })}
                    renderLabel={(v) => `${v.value}/${v.label}`}
                    labelInValue
                    disabled={!valueType}
                    allowClear
                  />
                );
              }}
            </Form.Item>
            {/* 
            <Form.Item label="说明" field="description" shouldUpdate>
              {(formData) => {
                return <span>{formData?.}</span>
              }}
            </Form.Item> */}

            <Form.Item label="数据映射源字段" field="dataMapSourceColumn">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.getTargetColumnList, {
                  accRuleLineId,
                })}
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
        </Modal>
      )}
    </Drawer>
  );
};

DetailDrawer.displayName = 'DetailDrawer';
export default DetailDrawer;
