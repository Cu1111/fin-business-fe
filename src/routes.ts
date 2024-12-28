import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  path?: string; // 用于key和path不同的情况，比如动态路由
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  filePath?: string;
  exact?: boolean;
};

export const routes: IRoute[] = [
  {
    name: '人员和组织信息',
    key: 'personnel-and-organization',
    children: [
      {
        name: '人员信息查询',
        key: 'personnel-and-organization/personnel-search',
      },
      {
        name: '组织信息查询',
        key: 'personnel-and-organization/organization-search',
      },
    ],
  },
  {
    name: '数据字典',
    key: 'data-dictionary',
    children: [
      {
        name: '设置类型',
        key: 'data-dictionary/set-type',
      },
      {
        name: '设置选项',
        key: 'data-dictionary/set-data',
      },
    ],
  },
  {
    name: '会计科目结构',
    key: 'acc-structure',
  },
  {
    name: '系统来源',
    key: 'system-source',
  },
  {
    name: '业务类型',
    key: 'business-type',
  },
  {
    name: '业务场景',
    key: 'business-scene',
  },
  {
    name: '业务事件',
    key: 'business-event',
  },
  {
    name: '智能映射表单',
    key: 'dict-map',
    filePath: 'dict-map/main',
    exact: true,
    children: [
      {
        name: '映射明细',
        key: 'dict-map/detail',
        path: 'dict-map/detail/:dictMapId',
        ignore: true,
      },
    ],
  },
  {
    name: '入账规则',
    key: 'entry-rule',
    filePath: 'entry-rule/main',
    exact: true,
    children: [
      {
        name: '入账行规则',
        key: 'entry-rule/detail',
        path: 'entry-rule/detail/:accRuleId',
        ignore: true,
      },
    ],
  },
  {
    name: '业务接口表',
    key: 'business-interface-table',
  },
  {
    name: '业务转换分录',
    key: 'business-change-table',
  },
  {
    name: '总账模块',
    key: 'GL-module',
    children: [
      {
        name: '日记账批',
        key: 'GL-module/day-book-batch',
      },
      {
        name: '日记账',
        key: 'GL-module/day-book',
        filePath: 'GL-module/day-book',
        exact: true,
        children: [
          {
            name: '日记账行',
            key: 'GL-module/day-book-line',
            path: 'GL-module/day-book-line/:jeHeaderId',
            ignore: true,
          },
        ],
      },
      {
        name: '期间',
        key: 'GL-module/period',
      },
      {
        name: '汇率',
        key: 'GL-module/exchange-rate',
      },
    ],
  },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

export const generatePermission = (role: string) => {
  const actions = role === 'admin' ? ['*'] : ['read'];
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
