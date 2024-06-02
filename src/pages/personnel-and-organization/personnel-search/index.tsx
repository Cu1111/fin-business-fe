import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  Switch,
  PaginationProps,
  Button,
  Notification,
  Space,
  Typography,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import dayjs from 'dayjs';
import SearchForm from './form';
import DrawerForm from './drawer';
import styles from './style/index.module.less';
import './mock';

const { Text } = Typography;

function SearchTable() {
  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [visible, setVisible] = useState<boolean>(false);

  const rowRef = useRef(null);

  const handleEdit = (row) => {
    console.log(row, 'row');
  };

  const handleNoSupport = () => {
    Notification.info({
      closable: true,
      title: '通知',
      content: '抱歉，暂未支持!',
    });
  };

  const columns = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 200,
      },
      {
        title: '工号',
        dataIndex: 'empNumber',
        render: (value) => <Text copyable>{value}</Text>,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: (value) => (value === 'M' ? '男' : '女'),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '组织',
        dataIndex: 'orgId',
      },
      {
        title: '上级',
        dataIndex: 'supUserName',
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        render: (v) => <Switch checked={v === 'Y'} />,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '办公地点',
        dataIndex: 'officeLocation',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, row) => (
          <Button type="primary" size="small" onClick={() => handleEdit(row)}>
            编辑
          </Button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    axios
      .get('/api/list', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
      })
      .then((res) => {
        setData(res.data.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.data.total,
        });
        setLoading(false);
      });
  }

  const handleAdd = () => {
    console.log('add');
    rowRef.current = null;
    setVisible(true);
  };

  const handleClose = (refresh?: boolean) => {
    setVisible(false);

    if (refresh) {
      fetchData();
    }
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return (
    <Card>
      <SearchForm onSearch={handleSearch} />

      <div className={styles['button-group']}>
        <Space>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            新增
          </Button>
          <Button onClick={handleNoSupport}>批量导入</Button>
        </Space>
        <Space>
          <Button icon={<IconDownload />} onClick={handleNoSupport}>
            下载
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      <DrawerForm
        visible={visible}
        row={rowRef.current}
        handleClose={handleClose}
      />
    </Card>
  );
}

export default SearchTable;