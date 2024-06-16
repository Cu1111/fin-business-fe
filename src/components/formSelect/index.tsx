import React, { useState, useRef } from 'react';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';

interface FormSelectProps extends React.ComponentProps<typeof Select> {
  onFetchData?: (filter?) => any;
  renderOptions?: (data?) => any;
  initSearch?: boolean;
  keyValue?: string;
  labelValue?: string;
}

const FormSelect = (props: FormSelectProps) => {
  const {
    value,
    onChange,
    onFetchData,
    initSearch = true,
    renderOptions,
    keyValue = 'value',
    labelValue = 'label',
    ...others
  } = props;
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  const refFetchId = useRef<number>();

  const debouncedFetchData = debounce(async (filter) => {
    refFetchId.current = Date.now();
    const fetchId = refFetchId.current;
    setFetching(true);
    setOptions([]);
    onFetchData(filter).then((data) => {
      if (refFetchId.current === fetchId) {
        setFetching(false);
        if (renderOptions) {
          const options = data.map(() => {
            return;
          });
        }
        setOptions(data);
      }
    });
  }, 200);

  return (
    <Select
      {...others}
      value={value}
      onChange={onChange}
      options={options}
      notFoundContent={
        fetching ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin style={{ margin: 12 }} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '10px auto',
            }}
          >
            暂无数据
          </div>
        )
      }
      onClick={() => {
        if (initSearch) {
          debouncedFetchData('');
        }
      }}
      onSearch={debouncedFetchData}
    />
  );
};

FormSelect.displayName = 'FormSelect';
export default FormSelect;
