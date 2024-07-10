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
import { useHistory } from 'react-router-dom';
import { $fetch } from '@/utils';
import dayjs from 'dayjs';
import SearchForm from './form';
import DrawerForm from './drawer';
import styles from './style/index.module.less';
import Url from './url';

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

  const showDetail = (row) => {
    const { accRuleId } = row;
    history.push(`/entry-rule/detail/${accRuleId}`);
  };

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '业务系统',
        dataIndex: 'systemSourceName',
        width: 160,
      },
      {
        title: '业务系统名称',
        dataIndex: 'dictMapClassValueDesc',
        width: 160,
      },
      {
        title: '业务类型',
        dataIndex: 'dictMapTypeValue',
        width: 160,
      },
      {
        title: '业务类型名称',
        dataIndex: 'dictMapTypeValueDesc',
        width: 160,
      },
      {
        title: '业务场景',
        dataIndex: 'dictMapSourceType',
        width: 120,
      },
      {
        title: '业务场景名称',
        dataIndex: 'dictMapSourceTypeDesc',
        width: 160,
      },
      {
        title: '业务事件',
        dataIndex: 'dictMapTargetType',
        width: 160,
      },
      {
        title: '业务事件名称',
        dataIndex: 'dictMapTargetTypeDesc',
        width: 160,
      },
      {
        title: 'IPH_PRC',
        dataIndex: 'dictMapTargetType',
        width: 160,
      },
      {
        title: '记账账簿名称',
        dataIndex: 'dictMapTargetTypeDesc',
        width: 160,
      },
      {
        title: '业财维度结构',
        dataIndex: 'dictMapTargetType',
        width: 160,
      },
      {
        title: '业财维度结构名称',
        dataIndex: 'dictMapTargetTypeDesc',
        width: 160,
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
        width: 200,
        fixed: 'right',
        render: (_, row) => (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => showDetail(row)}
              style={{ marginRight: '6px' }}
            >
              入账行规则
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
    $fetch(Url.getAccRule, {
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
        rowKey="dictMapId"
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
