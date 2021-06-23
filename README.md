# v-use-axios

在 vue3 中优雅的使用 axios, 支持 typescript.

[![NPM Version][npm-image]][npm-url] <img src="https://img.shields.io/badge/-typescript-blue"/> <img src="https://img.shields.io/badge/-Vue3-green"/>

[npm-image]: https://badgen.net/npm/v/v-use-axios
[npm-url]: https://npmjs.org/package/v-use-axios

## 🚀 安装

```
yarn add v-use-axios
// 或
npm i -S v-use-axios
```

## 🍕 使用

```javascript
import { useGet } from 'v-use-axios';
export default defineComponent({
    setup() {
        // 返回ref格式数据
        const [isLoading, dataSource, { error, up, down }] = useGet('/api', { p: 1 });

        return { isLoading, dataSource };
    },
});
```

### 导入已存在axios

实际开发中, **您应该导入您已有的 axios 实例**, 这样`v-use-axios`就会继承您对 axios 的配置, 比如拦截器设置等:

**yourAxios.js**

```javascript
export const http = axios.create({
    baseURL: `http://xxx.com/api`,
    ...
});
```

**main.js**

```javascript
import { linkAxios } from 'v-use-axios';
import { http } from '../yourAxios';

const app = createApp(App);
app.use(linkAxios, http);
```

## 🌟 API

[useAxios](#useAxios) 通用请求

[useGet](#useGet) Get请求

[usePost](#usePost) Post请求


### useAxios

useAxios(config, transform): [isLoadingRef, dataSourceRef, {error,useUploadProgress,useDownloadProgress,onSuccess,onError}]

##### 参数

-   **config**
    同[axios.request(config)](https://github.com/axios/axios#request-config).

-   **transform**
    可选参数, "变形函数", 可以用来控制返回的 dataSourceRef 的格式.

##### 返回值

-   **isLoadingRef** : 表示是否加载接口中.

-   **dataSourceRef** : 接口返回数据, 受**transform**控制.

```javascript
import { useAxios } from 'v-use-axios';

function transform(data) {
    return data.data;
}

export default defineComponent({
    setup() {
        // 假设"/abc"接口返回{code:1,msg:'ok',data:[1,2,3]}
        const [isLoading, dataSource] = useAxios(
            {
                url: '/api',
                method: 'post',
                data: { x: 1 },
            },
            transform
        );

        // 请求完毕后, 值[1,2,3]
        console.log(dataSource.value);
    },
});
```

-   **error** : 同[axios 中 error](https://github.com/axios/axios#handling-errors),是"ref 数据".

- **run** : 使用新的参数请求, 新参数会合并useAxios的参数, 参数类型同[axios.request(config)](https://github.com/axios/axios#request-config), 执行`run`后, `useAxios`的返回值会被刷新:

```javascript
export default defineComponent({
    setup() {
        const [isLoading, dataSource, { run }] = useAxios({ url: '/api' });

        run({
            params:{p:1},
            data:{xx:1}
        });
        return { isLoading, dataSource };
    },
});
```

-   **useUploadProgress** : 上传进度(小数),是"ref 数据".

```javascript
export default defineComponent({
    setup() {
        const [isLoading, dataSource, { useUploadProgress }] = useAxios({ url: '/api' });

        const progress = useUploadProgress();

        return { progress };
    },
});
```

-   **useDownloadProgress** : 下载进度(小数),是"ref 数据".

-   **onSuccess** : 请求成功钩子.

```javascript
export default defineComponent({
    setup() {
        const [isLoading, dataSource, { onSuccess }] = useAxios({ url: '/api' });

        onSuccess((data) => {
            // data为接口返回数据
            // 非ref数据
        });
    },
});
```

-   **onError** : 请求失败钩子

### useGet

useGet(url, payloadOrTransform, transform)

##### 参数

-   **url** : 接口地址

-   **payloadOrTransform** : 可选, 如果传递对象, 那么就是请求参数, 如果是函数, 就是"变形函数".

-   **transform** : 可选, "变形函数"

##### 返回值

同`useAxios`返回值

这里简化了 axios.get 中的`params`字段:

```javascript
import { useGet } from 'v-use-axios';
const [isloading,dataSource] = useGet('/abc', { x: 1 });
// 等价于
axios.get('/abc', { params: { x: 1 } });
```

##### run
`useGet`也会返回`run`函数, 但是参数和`useAxios`返回的`run`不同, 参数更精简:
```javascript
export default defineComponent({
    setup() {
        const [isLoading, dataSource, { run }] = useGet('/api');

        run({p:1});
    },
});
```

```javascript
export default defineComponent({
    setup() {
        const [isLoading, dataSource, { run }] = useAxios({ url: '/api' });

        run({
            params:{p:1},
        });
    },
});
```


### usePost

使用方式同 useGet

```javascript
import { usePost } from 'v-use-axios';
usePost('/abc', { x: 1 });
```

## 常见问题

### 为什么没有`usePut`等其他请求方式?

使用`axios`有时候传递参数`params`和`data`都会用, 我怕封装过度, 又参考了 jquery 对 xhr 的封装, 所以暂时只封装了 `get` 和 `post`, 其他情况请暂时请先用`useAxios`.
