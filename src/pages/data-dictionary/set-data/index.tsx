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
  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [dictExtConfig, setDictExtConfig] = useState([]);
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

  const columns: any = useMemo(
    () => [
      {
        title: '类型Code',
        dataIndex: 'dictType',
        width: 200,
      },
      {
        title: '类型描述',
        dataIndex: 'dictDesc',
        width: 200,
      },
      {
        title: '选项Code',
        dataIndex: 'dictCode',
        width: 200,
      },
      {
        title: '选项描述',
        dataIndex: 'dictName',
        width: 200,
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        render: (v) => <Switch checked={v === 'Y'} />,
        width: 120,
      },
      ...dictExtConfig.map((v) => {
        const { extColumnFieldName, extColumnField, extType } = v;
        return {
          title: v.extColumnFieldName,
          dataIndex: v.extColumnField,
          render: (_, row) => {
            const { attributeData, attributeValue } = row?.attributeData.find(
              (att) => att.attribute === extColumnField
            );
            if (extType === 'input') {
              return attributeValue || '';
            }
            if (extType === 'list' && attributeData) {
              const { dictCode, dictName } = attributeData?.[0] || {};
              return dictCode && dictName ? `${dictCode}/${dictName}` : '';
            }
            return '';
          },
          width: 200,
        };
      }),
      // {
      //   title: '开始时间',
      //   dataIndex: 'startTime',
      //   render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      // },
      // {
      //   title: '结束时间',
      //   dataIndex: 'endTime',
      //   render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : ''),
      // },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        fixed: 'right',
        render: (_, row) => (
          <Button type="primary" size="small" onClick={() => handleEdit(row)}>
            编辑
          </Button>
        ),
      },
    ],
    [dictExtConfig]
  );

  useEffect(() => {
    if (formParams) {
      fetchData();
    }
  }, [pagination.current, pagination.pageSize, formParams]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    $fetch(Url.getDictValues, {
      page: {
        pageNo: current,
        pageSize,
      },
      ...formParams,
    })
      .then((res) => {
        const { page, pageList, dictExtConfig } = res;
        setPatination({
          ...pagination,
          current: page?.pageNo,
          pageSize: page?.pageSize,
          total: page?.totalCount,
        });
        setData(pageList);
        setDictExtConfig(dictExtConfig);
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
          <Button
            type="primary"
            icon={<IconPlus />}
            disabled={!formParams?.dictType}
            onClick={handleAdd}
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
        scroll={{ x: true, y: true }}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      {visible && (
        <DrawerForm
          visible
          row={rowRef.current}
          handleClose={handleClose}
          dictExtConfig={dictExtConfig}
        />
      )}
    </Card>
  );
}

PersonnelSearch.display = 'PersonnelSearch';
export default PersonnelSearch;
