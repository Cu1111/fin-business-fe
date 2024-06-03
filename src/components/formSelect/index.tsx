import React, { useState, useRef } from 'react';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';

const FormSelect = (props) => {
  const { value, onChange, onFetchData, ...others } = props;
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
        ) : null
      }
      onSearch={debouncedFetchData}
    />
  );
};

FormSelect.displayName = 'FormSelect';
export default FormSelect;
