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
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
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

  const handleNoSupport = () => {
    Notification.info({
      closable: true,
      title: '通知',
      content: '抱歉，暂未支持!',
    });
  };

  const showDetail = (row, postStatus) => {
    const { jeHeaderId } = row;
    history.push(
      `/GL-module/day-book-line/${jeHeaderId}?postStatus=${postStatus}`
    );
  };

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '账套',
        dataIndex: 'accBookDesc',
        width: 120,
      },
      {
        title: '期间',
        dataIndex: 'periodName',
        fixed: 'left',
        width: 120,
      },
      {
        title: '日记账批名',
        dataIndex: 'jeBatchName',
        width: 200,
      },
      {
        title: '日记账名称',
        dataIndex: 'jeHeaderName',
        width: 200,
      },
      {
        title: '日记账来源',
        dataIndex: 'jeSourceDesc',
        width: 200,
      },
      {
        title: '日记账类别',
        dataIndex: 'jeCategoryDesc',
        width: 200,
      },
      {
        title: '币种',
        dataIndex: 'currencyCode',
        width: 120,
      },
      {
        title: '汇率类型',
        dataIndex: 'exchangeRateTypeDictCode',
        width: 120,
      },
      {
        title: '汇率日期',
        dataIndex: 'exchangeRateTime',
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
        width: 180,
      },
      {
        title: '汇率',
        dataIndex: 'exchangeRate',
        width: 120,
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        width: 120,
      },
      {
        title: '更新人',
        dataIndex: 'lastUpdateBy',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 140,
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        width: 140,
        render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 180,
        render: (_, row) => (
          <div style={{ display: 'flex' }}>
            <Button
              type="primary"
              style={{ marginRight: '6px' }}
              size="small"
              disabled={['P', 'Y'].includes(row.postStatus)}
              onClick={() => handleEdit(row)}
            >
              编辑
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '6px' }}
              size="small"
              onClick={() => showDetail(row, row.postStatus)}
            >
              日记账行
            </Button>
          </div>
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
    $fetch(Url.getGlJeHeaders, {
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
    setAccountShow(false);
    setMappingShow(false);

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
