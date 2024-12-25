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
} from '@arco-design/web-react';

import FormSelect from '@/components/formSelect';
import { DataFetch } from '@/utils';
import Url from './url';

const FormItem = Form.Item;
const RowContext = React.createContext<{ getForm?: () => FormInstance }>({});

function EditableRow(props) {
  const { children, record, className, rowRefs, ...rest } = props;
  console.log(props, 'EditableRow', rest);
  const refForm = useRef(null);

  useEffect(() => {
    if (rowRefs && record.$$key) {
      rowRefs.current[record.$$key] = refForm;
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

  // if (!renderEditor || !editable) {
  //   return (
  //     <div
  //       className={column.editable ? `editable-cell ${className}` : className}
  //     >
  //       {renderView ? renderView(rowData[column.dataIndex], rowData) : children}
  //     </div>
  //   );
  // }

  return (
    <FormItem
      style={{ marginBottom: 0 }}
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      initialValue={rowData[column.dataIndex]}
      field={column.dataIndex}
      rules={column.rules}
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
        console.log('formData', formData, form, 'form', form.getFieldsValue());
        return renderEditor(rowData[column.dataIndex], formData);
      }}
    </FormItem>
  );
}

const EditableTable = forwardRef((props, ref) => {
  let i = 0;
  const rowRefs = useRef({});
  const [editable, setEditable] = useState<boolean>(true);
  const [data, setData] = useState<any>([
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
  const columns = [
    {
      title: '拓展字段',
      dataIndex: 'extColumnField',
      editable: true,
      rules: [{ required: true }],
      // render: (v, rowData) => {},
      renderEditor: () => {
        return (
          <FormSelect
            style={{ width: 200 }}
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
      renderEditor: () => {
        return <Input />;
      },
    },
    {
      title: '字段类型',
      dataIndex: 'extType',
      rules: [{ required: true }],
      editable: true,
      renderEditor: () => {
        return (
          <Select
            placeholder="请选择"
            options={[
              { label: 'list', value: 'list' },
              { label: 'input', value: 'input' },
            ]}
            allowClear
          />
        );
      },
    },
    {
      title: '取值范围',
      dataIndex: 'extDictType',
      rules: [{ required: true }],
      editable: true,
    },
    {
      title: '是否启用',
      dataIndex: 'enabledFlag',
      rules: [{ required: true }],
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
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

  const handleCellChange = (value, dataIndex, key) => {
    const newData = data.map((item) => {
      if (item.$$key === key) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setData(newData);
  };

  useImperativeHandle(ref, () => ({
    addRow,
    setData: (tableData) => {
      const newData = tableData.map((v) => ({ ...v, $$key: `key_${i++}` }));
      setData(newData);
    },
    getData: () => data,
    // validateAll: () => {},
    setEditable: (v) => {
      setEditable(v);
    },
  }));

  return (
    <Table
      data={data}
      rowKey="dictExtConfigId"
      components={{
        body: {
          row: (props) => <EditableRow {...props} rowRefs={rowRefs} />,
          cell: (props) => (
            <EditableCell {...props} onCellChange={handleCellChange} />
          ),
        },
      }}
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
  );
});

export default EditableTable;
