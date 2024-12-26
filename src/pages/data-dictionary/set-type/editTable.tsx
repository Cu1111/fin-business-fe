import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Button,
  Table,
  Input,
  Select,
  Form,
  FormInstance,
  Switch,
} from '@arco-design/web-react';

import FormSelect from '@/components/formSelect';
import { DataFetch } from '@/utils';
import Url from './url';

const FormItem = Form.Item;
const RowContext = React.createContext<{ getForm?: () => FormInstance }>({});

function EditableRow(props) {
  const { children, record, className, rowRefs, setRowData, ...rest } = props;
  console.log(props, 'EditableRow', rest);
  const refForm = useRef(null);

  useEffect(() => {
    if (rowRefs && record.$$key) {
      rowRefs.current[record.$$key] = refForm.current;
    }
  }, [record.$$key, rowRefs]);

  const getForm = () => refForm.current;

  return (
    <RowContext.Provider
      value={{
        getForm,
      }}
    >
      <Form
        style={{ display: 'table-row' }}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        ref={refForm}
        wrapper="tr"
        wrapperProps={rest}
        onValuesChange={(v, rowData) => {
          setRowData(record.$$key, v);
          console.log(v, rowData, 'rowDAta');
        }}
        className={`${className} editable-row`}
      />
    </RowContext.Provider>
  );
}

function EditableCell(props) {
  console.log(props, 'cell props');
  const { children, className, rowData, column, editable } = props;
  const { getForm } = useContext(RowContext);
  const { renderEditor, renderView } = column;
  console.log(editable, 'editable', props, renderEditor);

  return (
    <FormItem
      style={{ marginBottom: 0 }}
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      initialValue={rowData[column.dataIndex]}
      field={column.dataIndex}
      rules={column.rules}
      triggerPropName={column.triggerPropName || 'value'}
    >
      {(formData, form) => {
        if (!renderEditor || !editable) {
          return (
            <div
              className={
                column.editable ? `editable-cell ${className}` : className
              }
            >
              {renderView
                ? renderView(rowData[column.dataIndex], rowData)
                : children}
            </div>
          );
        }

        return renderEditor(rowData[column.dataIndex], rowData);
      }}
    </FormItem>
  );
}

const EditableTable = forwardRef((props, ref) => {
  let i = 0;
  const rowRefs = useRef({});
  const [editable, setEditable] = useState<boolean>(true);
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    console.log(data, 'data');
  }, [data]);

  const columns: any = [
    {
      title: '拓展字段',
      dataIndex: 'extColumnField',
      editable: true,
      rules: [{ required: true }],
      width: 200,
      renderEditor: () => {
        return (
          <FormSelect
            showSearch
            onFetchData={DataFetch(Url.getExtColumnFieldList)}
            allowClear
          />
        );
      },
    },
    {
      title: '字段名',
      dataIndex: 'extColumnFieldName',
      rules: [{ required: true }],
      editable: true,
      width: 200,
      renderEditor: () => {
        return <Input />;
      },
    },
    {
      title: '字段类型',
      dataIndex: 'extType',
      rules: [{ required: true }],
      editable: true,
      width: 120,
      renderEditor: (v, { $$key }) => {
        return (
          <Select
            placeholder="请选择"
            options={[
              { label: 'list', value: 'list' },
              { label: 'input', value: 'input' },
            ]}
            onChange={(v) => {
              if (v === 'input') {
                setRowData($$key, { extType: v, extDictType: null });
              } else {
                setRowData($$key, { extType: v });
              }
              // if (v !== 'list') {
              //   setRowData($$key, { extDictType: null });
              // }
            }}
            allowClear
          />
        );
      },
    },
    {
      title: '取值范围',
      dataIndex: 'extDictType',
      // rules: [{ validator:(v) }],
      width: 200,
      editable: true,
      renderEditor: (v, { extType }) => {
        return (
          <FormSelect
            showSearch
            disabled={!extType || extType === 'input'}
            onFetchData={DataFetch(Url.searchDictType)}
            renderLabel={(v) => `${v.value}/${v.label}`}
            allowClear
          />
        );
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabledFlag',
      rules: [{ required: true, message: '必填' }],
      width: 120,
      editable: true,
      triggerPropName: 'checked',
      renderEditor: (v) => {
        return (
          <Switch
            checked={v === 'Y'}
            onChange={(v, { $$key }) => {
              setRowData($$key, { enabledFlag: v ? 'Y' : 'N' });
            }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          onClick={() => {
            deleteRow(record.$$key);
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  function addRow(newRowData) {
    const allData = data.concat({
      ...newRowData,
      $$key: `key_${i++}`,
    });
    setData(allData);
  }

  function deleteRow(key) {
    const newData = data.filter((v) => v.$$key !== key);
    setData(newData);

    const newRowRefs = { ...rowRefs.current };
    delete newRowRefs[key];
    rowRefs.current = newRowRefs;
  }

  const setRowData = (key, changedData) => {
    const index = data.findIndex((v) => v.$$key === key);
    console.log('changedData', changedData);
    if (index !== -1) {
      const lineData = data[index];
      const newLine = { ...lineData, ...changedData };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newRow = data.toSpliced(index, 1, newLine);
      setData(newRow);
    }
  };

  const handleCellChange = (value, dataIndex, key) => {
    const newData = data.map((item) => {
      if (item.$$key === key) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setData(newData);
  };

  const validateAll = () => {
    Object.values(rowRefs.current).forEach((formRef: any) => {
      console.log(formRef, 'formRefformRef');
      formRef.validate();
    });
  };

  useImperativeHandle(ref, () => ({
    addRow,
    setData: (tableData) => {
      const newData = tableData.map((v) => ({ ...v, $$key: `key_${i++}` }));
      setData(newData);
    },
    getData: () => data,
    validateAll,
    setEditable: (v) => {
      setEditable(v);
    },
  }));

  return (
    <>
      <Button
        onClick={() => {
          setData([
            {
              $$key: '1',
              dictExtConfigId: '1',
              extColumnFieldName: '其他',
              extColumnField: 'attribute2',
              extType: 'list',
              extDictType: 'ACC_STRUCTURE',
              enabledFlag: 'Y',
            },
          ]);
        }}
      >
        123
      </Button>
      <Button
        onClick={() => {
          validateAll();
        }}
      >
        123
      </Button>
      <Button
        onClick={() => {
          addRow({ enabledFlag: 'Y' });
        }}
      >
        123
      </Button>
      <Button
        onClick={() => {
          console.log(data, 'data');
        }}
      >
        123
      </Button>
      <Table
        data={data}
        rowKey="dictExtConfigId"
        components={{
          body: {
            row: (props) => (
              <EditableRow
                {...props}
                rowRefs={rowRefs}
                setRowData={setRowData}
              />
            ),
            cell: (props) => (
              <EditableCell {...props} onCellChange={handleCellChange} />
            ),
          },
        }}
        scroll={{ x: true, y: true }}
        columns={columns.map((column) =>
          column.editable
            ? {
                ...column,
                onCell: () => ({
                  editable,
                }),
              }
            : column
        )}
        className="table-demo-editable-cell"
      />
    </>
  );
});

export default EditableTable;
