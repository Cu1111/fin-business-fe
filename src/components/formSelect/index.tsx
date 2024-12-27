import React, { useState, useRef, useMemo } from 'react';
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
    disabled,
    onFetchData,
    initSearch = true,
    renderLabel,
    keyValue = 'value',
    labelValue = 'label',
    labelInValue,
    mode,
    ...others
  } = props;

  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const newValue = useMemo(() => {
    if (renderLabel && labelInValue && mode !== 'multiple' && value) {
      return { ...(value as any), label: renderLabel(value) };
    }
    console.log('1321312', value);
    if (labelInValue) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return { ...value, value: value?.[keyValue] };
    }
    return value;
  }, [value]);

  const refFetchId = useRef<number>();

  const handleOnChange = (val, option) => {
    if (labelInValue) {
      onChange?.(option?.extra, option);
    } else {
      onChange?.(val, option);
    }
  };

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
            extra: v,
          };
        });
        console.log('options', options);
        setOptions(options);
      }
    });
  }, 200);

  return (
    <Select
      {...others}
      value={newValue}
      onChange={handleOnChange}
      options={options}
      disabled={disabled}
      labelInValue={labelInValue}
      mode={mode}
      filterOption={false}
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
        if (!disabled && initSearch) {
          debouncedFetchData('');
        }
      }}
      onSearch={debouncedFetchData}
    />
  );
};

FormSelect.displayName = 'FormSelect';
export default FormSelect;
