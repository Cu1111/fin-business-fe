import React, { useState, useRef } from 'react';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';

interface FormSelectProps extends React.ComponentProps<typeof Select> {
  onFetchData?: (filter?) => any;
  renderLabel?: (data?) => any;
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
    renderLabel,
    keyValue = 'value',
    labelValue = 'label',
    ...others
  } = props;
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(true);

  const refFetchId = useRef<number>();

  const debouncedFetchData = debounce(async (filter) => {
    refFetchId.current = Date.now();
    const fetchId = refFetchId.current;
    setFetching(true);
    setOptions([]);
    onFetchData(filter).then((data) => {
      if (refFetchId.current === fetchId) {
        setFetching(false);
        const options = data.map((v) => {
          return {
            value: v?.[keyValue],
            label: renderLabel ? renderLabel(v) : v?.[labelValue],
          };
        });

        setOptions(options);
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
      // onBlur={() => {
      //   setOptions(null);
      // }}
      onSearch={debouncedFetchData}
    />
  );
};

FormSelect.displayName = 'FormSelect';
export default FormSelect;
