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
  Input,
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

const DetailDrawer: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row } = props;
  const { accRuleLineId } = row;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalShow, setModalShow] = useState<boolean>(false);

  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
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
        const { page, pageList } = res;
        setPatination({
          ...pagination,
          current: page?.pageNo,
          pageSize: page?.pageSize,
          total: page?.totalCount,
        });
        setData(pageList);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '段',
        dataIndex: 'sourceColumnCode',
        width: 100,
      },
      {
        title: '取值类型',
        dataIndex: 'sourceColumnName',
        width: 120,
      },
      {
        title: '值',
        dataIndex: 'targetColumnCode',
        width: 180,
      },
      {
        title: '说明',
        dataIndex: 'description',
        width: 180,
      },
      {
        title: '数据映射源字段',
        dataIndex: '',
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
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (modalShow && rowRef.current != null) {
      const { enabledFlag, ...other } = rowRef.current;
      const data = { ...other, enabledFlag: enabledFlag === 'Y' };
      form.setFieldsValue(data);
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
      // width={1000}
      // title={<span>{`${row?.systemSourceCode} 接口映射`}</span>}
      title="入账明细规则"
      visible={visible}
      footer={null}
      onCancel={() => {
        handleClose();
      }}
      maskClosable={false}
      unmountOnExit={true}
      width="100%"
      height="100%"
      bodyStyle={{ padding: 0 }}
      style={{ position: 'fixed', top: 0, left: 0 }}
    >
      <Table
        rowKey="dictValueId"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        scroll={{ x: true, y: true }}
        data={data}
      />
      {modalShow && (
        <Modal
          title={<div style={{ textAlign: 'left' }}>编辑</div>}
          visible
          onCancel={() => {
            setModalShow(false);
          }}
          onOk={async () => {
            try {
              await form.validate();
              const data = form.getFields();
              const { enabledFlag } = data;
              const params = {
                ...data,
                systemSourceId: row?.systemSourceId,
                enabledFlag: enabledFlag === true ? 'Y' : 'N',
              };
              console.log(data, params, 'data');
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
            labelAlign="left"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
          >
            <Form.Item
              label="接入方字段代码"
              field="sourceColumnCode"
              rules={[{ required: true, message: '必填' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="映射字段名称"
              field="sourceColumnName"
              rules={[{ required: true, message: '必填' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
            <Form.Item label="接口表字段" field="targetColumnCode">
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.getDBColumn, {
                  tableName: 'system_source_column_map',
                })}
                // renderLabel={(v) => `${v.value}/${v.label}`}
                keyValue="columnName"
                labelValue="columnComment"
                allowClear
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Drawer>
  );
};

DetailDrawer.displayName = 'DetailDrawer';
export default DetailDrawer;
