import React, { useState, useEffect, useCallback } from 'react';
import { $fetch } from '@/utils';

import Url from './url';

function GroupDescribe({ row }) {
  const [describe, setDescribe] = useState<string>('');

  const getGroupDescribe = useCallback(async (row) => {
    const params = row?.accConfig.map((v) => ({
      ...v,
      segmentValue: row[v.segment],
    }));
    const res = await $fetch(Url.getAccCombo, params);
    setDescribe(res.map((v) => v.segmentValueName).join('.'));
  }, []);

  useEffect(() => {
    if (row) {
      getGroupDescribe(row);
    }
  }, [row, getGroupDescribe]);

  return <span>{describe}</span>;
}

GroupDescribe.display = 'GroupDescribe';
export default GroupDescribe;
