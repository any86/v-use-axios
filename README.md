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

#### main.js

```javascript
import useAxios from 'v-use-axios';
import axios from 'axios';

const app = createApp(App);
app.use(useAxios, axios);
```

#### xxx.vue

```javascript
import { useGet, useAxios } from 'v-use-axios';
export default defineComponent({
    mounted() {
        // 返回ref格式数据
        const [isLoading, dataSource, { error, up, down }] = useAxios({ url: '/abc' });

        // 等价于
        const [isLoading, dataSource, { error, up, down }] = useGet('/abc');
    },
});
```

### 使用注意

`v-use-axios`对您已有的代码是"**0 侵入性**"的:

上面的例子为了简单展示, 我单独引入的 axios, 但是实际开发中, **您应该导入您已有的 axios 实例.**

**uAxios.js**

```javascript
export const http = axios.create({
    baseURL: `http://xxx.com/api`,
    ...
});
```

**main.js**

```javascript
import { http } from '../uAxios';

const app = createApp(App);
app.use(useAxios, http);
```

## API

实际上**v-use-axios**仅仅是对**axios**和**vue**做了一层包装, `$useAxios`的语法就是`axios.request`的语法, **所以学习成本接近 0**.

### useAxios

useAxios(config, transform): [isLoadingRef, dataSourceRef, {error,up,down}]

##### 参数

-   **config**
    同[axios.request(config)](https://github.com/axios/axios#request-config).

-   **transform**
    可选参数, "变形函数", 可以用来控制返回的 dataSourceRef 的格式.

##### 返回值

-   **isLoadingRef** : 表示是否加载接口中.

-   **dataSourceRef** : 接口返回数据, 受**transform**控制.

```javascript
function transform(data) {
    return data.data;
}

// 假设"/abc"接口返回{code:1,msg:'ok',data:[1,2,3]}
const [isLoading, dataSource] = this.$useAxios({ url: '/abc' }, transform);

// dataSource == [1,2,3]
console.log(dataSource);
```

-   **error** : 同[axios 中 error](https://github.com/axios/axios#handling-errors),同时他是"ref 数据".

-   **up** : 上传进度(小数),同时他是"ref 数据".

-   **down** : 下载进度(小数),同时他是"ref 数据".

### $useAxios.get

$useAxios.get(url, payloadOrTransform, transform): [isLoadingRef, dataSourceRef, {error,up,down}]

##### 参数

-   **url** : 接口地址

-   **payloadOrTransform** : 可选, 如果传递对象, 那么就是请求参数, 如果是函数, 就是"变形函数".

-   **transform** : 可选, "变形函数"

##### 返回值

同`$useAxios`返回值

这里简化了 axios.get 中的`params`字段:

```javascript
this.$useAxios.get('/abc', { x: 1 });
// 等价于
axios.get('/abc', { params: { x: 1 } });
```

### $useAxios.post

使用方式同 $useAxios.get

```javascript
this.$useAxios.post('/abc', { x: 1 });
```

## 常见问题

### 为什么没有`$useAxios.put`等其他请求方式?

使用`axios`有时候传递参数`params`和`data`都会用, 我怕封装过度, 又参考了 jquery 对 xhr 的封装, 所以暂时只封装了 `get` 和 `post`, 其他情况请暂时先用`$useAxios`.
