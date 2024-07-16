import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  TableColumnProps,
  Button,
  Notification,
  Space,
  Switch,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import { IconLeft } from '@arco-design/web-react/icon';
import { useParams, useHistory } from 'react-router-dom';
import { JIEDAI_OBJ, MONEYDIR_OBJ } from './constants';
import { $fetch } from '@/utils';
import dayjs from 'dayjs';
import SearchForm from './form';
import DrawerForm from './drawer';
import DetailDrawer from './detailDrawer';
import styles from './style/index.module.less';
import Url from './url';

function DictMapDetail() {
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
  const [detailShow, setDetailShow] = useState<boolean>(false); // 明细规则的侧滑展示

  const [ruleData, setRuleData] = useState<any>({});

  const { accRuleId } = useParams();

  const rowRef = useRef(null);

  const handleEdit = (row) => {
    console.log(row, 'row');
    rowRef.current = row;
    setVisible(true);
  };

  const showDetail = (row) => {
    rowRef.current = row;
    setDetailShow(true);
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
        title: '序号',
        dataIndex: 'lineNumber',
        width: 100,
      },
      {
        title: '借/贷',
        dataIndex: 'drCr',
        render: (v) => JIEDAI_OBJ[v] || '',
        width: 120,
      },
      {
        title: '金额方向',
        dataIndex: 'amountDir',
        render: (v) => MONEYDIR_OBJ[v] || '',
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
        width: 160,
        fixed: 'right',
        render: (_, row) => (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => showDetail(row)}
              style={{ marginRight: '6px' }}
            >
              明细规则
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
    $fetch(Url.getAccRule, {
      accRuleId,
      page: { pageNo: 1, pageSize: 1 },
    }).then((res) => {
      const { pageList } = res;
      const data = pageList[0] || {};
      setRuleData(data);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, formParams]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    console.log(formParams, 'formParams');
    $fetch(Url.getAccRuleLine, {
      accRuleId,
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
    setDetailShow(false);
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
    <>
      {/* <div
        style={{ lineHeight: '32px', marginTop: '-10px', marginBottom: '8px' }}
      >
        <IconLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => {
            history.push(`/dict-map`);
          }}
        />
        <span>
          {dictMapData?.dictMapClassValueDesc}-{dictMapData?.dictMapClassValue}
        </span>
      </div> */}
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
          <DrawerForm
            visible
            row={rowRef.current}
            handleClose={handleClose}
            ruleData={ruleData}
          />
        )}
        {detailShow && (
          <DetailDrawer
            visible
            row={rowRef.current}
            handleClose={handleClose}
          />
        )}
      </Card>
    </>
  );
}

DictMapDetail.display = 'DictMapDetail';
export default DictMapDetail;
