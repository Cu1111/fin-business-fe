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

const AccountDrawer: React.FC<DrawerFormProps> = (props) => {
  const { visible, handleClose, row } = props;
  const { systemSourceId } = row;

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
    $fetch(Url.getSystemSourceCom, {
      systemSourceId,
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
        title: '核算主体编码',
        dataIndex: 'comCode',
      },
      {
        title: '核算主体名称',
        dataIndex: 'comName',
      },
      {
        title: '法人名称',
        dataIndex: 'leName',
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        render: (v) => <Switch checked={v === 'Y'} />,
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
      title={<span>{`${row?.systemSourceCode} 核算主体`}</span>}
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
      <div
        style={{
          display: 'flex',
          height: '40px',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="primary"
          style={{ width: '70px' }}
          onClick={() => {
            rowRef.current = null;
            console.log(rowRef.current, 'rowRef.current');
            setModalShow(true);
          }}
        >
          新增
        </Button>
      </div>
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
          title={
            <div style={{ textAlign: 'left' }}>
              {rowRef.current ? '编辑' : '新增'}
            </div>
          }
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
              const fetchUrl = rowRef.current
                ? Url.updateSystemSourceCom
                : Url.addSystemSourceCom;
              return $fetch(fetchUrl, params).then((res) => {
                setModalShow(false);
                Notification.success({
                  title: '成功',
                  content: res?.message || '操作成功',
                });
              });
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
              label="核算主体"
              field="comCode"
              rules={[{ required: true }]}
            >
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.getSSCom, {
                  systemSourceId,
                })}
                renderLabel={(v) => `${v.value}/${v.label}`}
                allowClear
              />
            </Form.Item>
            <Form.Item label="法人" field="leCode" rules={[{ required: true }]}>
              <FormSelect
                showSearch
                onFetchData={DataFetch(Url.searchDictValues, {
                  dictType: 'LE',
                })}
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
          </Form>
        </Modal>
      )}
    </Drawer>
  );
};

AccountDrawer.displayName = 'AccountDrawer';
export default AccountDrawer;
