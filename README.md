![image](https://user-images.githubusercontent.com/8264787/122703871-146b6d00-d285-11eb-8609-e967964e5e0d.png)

用ref包裹axios, 让我们优雅的在vue3中使用axios


## 安装
```
yarn add v-use-axios
// 或
npm i -S v-use-axios
```

## 使用

```javascript
// main.js
import useAxios from 'v-use-axios';
import axios from 'axios'

const app = createApp(App);
app.use(useAxios,axios);
```

```javascript
// Xxx.vue
export default defineComponent({
    mounted(){
        // 返回ref格式数据
        // up和down对应上传和下载的进度数据
        const [isLoading, dataSource, {error,up,down}] = this.$useAxios({url:'/abc'});
        // 等价于
        const [isLoading, dataSource, {error,up,down}] = this.$useAxios.get('/abc');
    }
})
```

## API
实际上**v-use-axios**仅仅是对**axios**和**vue**做了一层包装, `$useAxios`的语法就是`axios.request`的语法, **所以没有学习成本**.

### $useAxios
语法同[axios.request(config)](https://github.com/axios/axios#request-config).


### $useAxios.get

这里简化了axios.get中的`params`字段:

```javascript
this.$useAxios.get('/abc',{x:1});
// 等价于
axios.get('/abc',{params:{x:1}});
```

### $useAxios.post
同axios.post
```javascript
this.$useAxios.post('/abc',{x:1});
// 等价于
axios.post('/abc',{x:1});
```