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
  Tooltip,
} from '@arco-design/web-react';
import {
  IconDownload,
  IconRight,
  IconDown,
  IconPlus,
} from '@arco-design/web-react/icon';
import { $fetch } from '@/utils';
import { useParams } from 'react-router-dom';
import GroupDescribe from './groupDescribe';
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
  const [accStructure, setAccStructure] = useState(null);
  const [headerConfig, setHeaderConfig] = useState();

  const { jeHeaderId } = useParams();

  const rowRef = useRef(null);

  const postStatus = useMemo(() => {
    return new URLSearchParams(location.search).get('postStatus');
  }, []);

  console.log(postStatus, 'searchParams');

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accBookDictCode = params.get('accBookDictCode');
    console.log('params', accBookDictCode);
    $fetch(Url.getJeHeadersAndAccStructureByJeHeaderId, { jeHeaderId }).then(
      (res) => {
        const { accStructureResponseList, glJeHeadersResponse } = res;
        setAccStructure(accStructureResponseList);
        setHeaderConfig(glJeHeadersResponse);
      }
    );
  }, []);

  const columns = useMemo<Array<TableColumnProps>>(
    () => [
      {
        title: '行号',
        dataIndex: 'jeLineNumber',
        fixed: 'left',
        width: 80,
      },
      {
        title: '账户组合',
        dataIndex: 'accBookDesc',
        ellipsis: true,
        render: (_, row) => {
          const segmentList = (accStructure || []).map((v) => {
            const { segment } = v;
            return row[segment];
          });
          console.log(segmentList, 'segmentList', 'accStructure', accStructure);
          return (
            <Tooltip
              position="top"
              trigger="hover"
              content={segmentList.join('.')}
            >
              {segmentList.join('.')}
            </Tooltip>
          );
        },
        width: 300,
      },
      {
        title: '日记账行描述',
        dataIndex: 'lineDesc',
        ellipsis: true,
        width: 200,
      },
      {
        title: '输入借方金额',
        dataIndex: 'enterDr',
        width: 120,
      },
      {
        title: '输入贷方金额',
        dataIndex: 'enterCr',
        width: 120,
      },
      {
        title: '记账借方金额',
        dataIndex: 'accountDr',
        width: 120,
      },
      {
        title: '记账贷方金额',
        dataIndex: 'accountCr',
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
        width: 100,
        render: (_, row) => (
          <div style={{ display: 'flex' }}>
            <Button
              type="primary"
              style={{ marginRight: '6px' }}
              size="small"
              disabled={['P', 'Y'].includes(postStatus)}
              onClick={() => handleEdit(row)}
            >
              编辑
            </Button>
          </div>
        ),
      },
    ],
    [accStructure, postStatus]
  );

  useEffect(() => {
    if (accStructure) {
      fetchData();
    }
  }, [pagination.current, pagination.pageSize, formParams, accStructure]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    $fetch(Url.getGlJeLines, {
      page: {
        pageNo: current,
        pageSize,
      },
      jeHeaderId,
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
      <SearchForm onSearch={handleSearch} accStructure={accStructure} />

      <div className={styles['button-group']}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={handleAdd}
            disabled={['P', 'Y'].includes(postStatus)}
          >
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
        expandedRowRender={(row) => {
          return (
            <div>
              <span>组合描述：</span>
              <GroupDescribe row={row} accStructure={accStructure} />
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
          // expandRowByClick: true,
          width: 60,
          columnTitle: '',
        }}
        pagination={pagination}
        columns={columns}
        scroll={{ x: true, y: true }}
        data={data}
      />
      {visible && (
        <DrawerForm
          visible
          row={rowRef.current}
          accStructure={accStructure}
          handleClose={handleClose}
          jeHeaderId={jeHeaderId}
          headerConfig={headerConfig}
        />
      )}
    </Card>
  );
}

PersonnelSearch.display = 'PersonnelSearch';
export default PersonnelSearch;
