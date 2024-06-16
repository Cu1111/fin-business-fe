import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Notification,
  Space,
  Typography,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import { $fetch } from '@/utils';
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
  const [visible, setVisible] = useState<boolean>(false);

  const rowRef = useRef(null);

  const handleEdit = (row) => {
    console.log(row, 'row');
    rowRef.current = row;
    setVisible(true);
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
        title: '会计科目结构',
        dataIndex: 'accStructureCode',
        width: 200,
      },
      {
        title: '段值',
        dataIndex: 'segment',
        render: (value) => <Text copyable>{value}</Text>,
      },
      {
        title: '段值描述',
        dataIndex: 'segmentDesc',
        width: 200,
      },
      {
        title: '数据字典',
        dataIndex: 'dictType',
        render: (_, row) =>
          row?.dictType && row?.dictDesc && `${row?.dictType}-${row?.dictDesc}`,
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
    $fetch(Url.getAccStructure, {
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

PersonnelSearch.display = 'PersonnelSearch';
export default PersonnelSearch;
