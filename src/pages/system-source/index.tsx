import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  TableColumnProps,
  Button,
  Notification,
  Space,
  Typography,
  Switch,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import { $fetch } from '@/utils';
import dayjs from 'dayjs';
import SearchForm from './form';
import DrawerForm from './drawer';
import styles from './style/index.module.less';
import Url from './url';

const { Text } = Typography;

function PersonnelSearch() {
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
  const [visible, setVisible] = useState<boolean>(false); // 新增修改弹窗的显示
  const [accountShow, setAccountShow] = useState<boolean>(false); // 核算主体弹窗的显示
  const [mappingShow, setMappingShow] = useState<boolean>(false); // 核算主体弹窗的显示

  const rowRef = useRef(null);

  const handleEdit = (row) => {
    console.log(row, 'row');
    rowRef.current = row;
    setVisible(true);
  };

  const showAccount = (row) => {
    rowRef.current = row;
    setAccountShow(true);
  };

  const showMapping = (row) => {
    rowRef.current = row;
    setMappingShow(true);
  };

  const handleNoSupport = () => {
    Notification.info({
      closable: true,
      title: '通知',
      content: '抱歉，暂未支持!',
    });
  };

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '业务系统代码',
        dataIndex: 'accStructureCode',
        fixed: 'left',
        width: 120,
      },
      {
        title: '业务系统名称',
        dataIndex: 'segment',
        width: 120,
        render: (value) => <Text copyable>{value}</Text>,
      },
      {
        title: '日记账来源代码',
        dataIndex: 'segmentDesc',
        width: 160,
      },
      {
        title: '日记账来源名称',
        dataIndex: 'dictType',
        width: 200,
        render: (_, row) =>
          row?.dictType && row?.dictDesc && `${row?.dictType}/${row?.dictDesc}`,
      },
      {
        title: '接口表名称',
        dataIndex: 'dictType',
        width: 140,
        render: (_, row) =>
          row?.dictType && row?.dictDesc && `${row?.dictType}/${row?.dictDesc}`,
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        width: 100,
        render: (v) => <Switch checked={v === 'Y'} />,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: 140,
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        width: 140,
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 280,
        render: (_, row) => (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => showAccount(row)}
            >
              核算主体
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => showMapping(row)}
            >
              接口映射
            </Button>
            <Button type="primary" size="small" onClick={() => handleEdit(row)}>
              编辑
            </Button>
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, formParams]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    $fetch(Url.getSystemSource, {
      page: {
        pageNo: current,
        pageSize,
      },
      ...formParams,
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
        rowKey="dictValueId"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        scroll={{ x: true, y: true }}
        data={data}
      />
      {visible && (
        <DrawerForm visible row={rowRef.current} handleClose={handleClose} />
      )}
    </Card>
  );
}

PersonnelSearch.display = 'PersonnelSearch';
export default PersonnelSearch;
