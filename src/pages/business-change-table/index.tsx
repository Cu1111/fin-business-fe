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
import { IconDownload, IconRight, IconDown } from '@arco-design/web-react/icon';
import { $fetch } from '@/utils';
import SearchForm from './form';
import GroupDescribe from './groupDescribe';
import styles from './style/index.module.less';
import Url from './url';

const { Text } = Typography;

function BusinessInterfaceTable() {
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

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '批号',
        dataIndex: 'batchNum',
        width: 140,
      },
      {
        title: '系统来源code',
        dataIndex: 'systemSourceCode',
        width: 140,
      },
      {
        title: '系统来源名称',
        dataIndex: 'systemSourceName',
        width: 120,
      },
      {
        title: '业务类型code',
        dataIndex: 'businessTypeCode',
        width: 160,
      },
      {
        title: '业务类型名称',
        dataIndex: 'businessTypeName',
        width: 200,
      },
      {
        title: '业务场景code',
        dataIndex: 'businesSituationCode',
        width: 160,
      },
      {
        title: '业务场景名称',
        dataIndex: 'businessSituationName',
        width: 200,
      },
      {
        title: '业务事件code',
        dataIndex: 'businessEventCode',
        width: 200,
      },
      {
        title: '业务事件名称',
        dataIndex: 'businessEventName',
        width: 200,
      },
      {
        title: '业务日期',
        dataIndex: 'transDate',
        width: 120,
      },
      {
        title: 'GL日期',
        dataIndex: 'glDate',
        width: 120,
      },

      {
        title: '总金额',
        dataIndex: 'totalAmt',
        width: 120,
      },
      {
        title: '行金额',
        dataIndex: 'lineAmt',
        width: 120,
      },
      {
        title: '不含税金额',
        dataIndex: 'amtNoneTax',
        width: 120,
      },
      {
        title: '税额',
        dataIndex: 'taxAmt',
        width: 120,
      },
      {
        title: '账户组合',
        dataIndex: 'accountContent',
        render: (_, row) => {
          const segmentList = (row?.accConfig || []).map((v) => v.segment);
          console.log(
            segmentList,
            'segmentList',
            segmentList.map((v) => row[v]),
            row['segment1']
          );
          return segmentList
            .map((v) => {
              return row[v];
            })
            .join('.');
        },
        width: 400,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
      },
      {
        title: '描述',
        dataIndex: 'message',
        width: 120,
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (_, row) => (
      //     <Button type="primary" size="small" onClick={() => handleEdit(row)}>
      //       编辑
      //     </Button>
      //   ),
      // },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, formParams]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    $fetch(Url.getAccBigTableList, {
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

  const getGroupDescribe = async (row) => {
    const res = await $fetch(Url.getAccCombo, row.accConfig);
    return res.map((v) => v.segmentValueName).join('.');
  };

  return (
    <Card>
      <SearchForm onSearch={handleSearch} />

      <div className={styles['button-group']}>
        <Space>
          <Button icon={<IconDownload />} onClick={handleNoSupport}>
            下载
          </Button>
        </Space>
      </div>
      <Table
        rowKey="accId"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        scroll={{ x: true, y: true }}
        data={data}
        expandedRowRender={(row) => {
          return (
            <div>
              <span>组合描述：</span>
              <GroupDescribe row={row} />
            </div>
          );
        }}
        expandProps={{
          icon: ({ expanded, record, ...restProps }) =>
            expanded ? (
              <button {...restProps}>
                <IconDown />
              </button>
            ) : (
              <button {...restProps}>
                <IconRight />
              </button>
            ),
          expandRowByClick: true,
          width: 60,
          columnTitle: '',
        }}
      />
    </Card>
  );
}

BusinessInterfaceTable.display = 'BusinessInterfaceTable';
export default BusinessInterfaceTable;
