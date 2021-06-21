# 如何造一个 vue3 的轮子, 咱也造一个"useXxx"

## ref

ref 是 vue3 新增的 api, 他的意义就是单独定义一个可以"被追踪"的变量, vue2 中所有变量都需要在`data`中定义, vue3 中增加了一个`setup`字段, 在这里我们可以更灵活的**定义变量**.

**vue3**

```javascript
export default defineComponent({
    setup() {
        const countA = ref(1);
        return { count };
    },
});
```

**vue2**

```javascript
export default {
    data() {
        return { countA: 1 };
    },
};
```

可能有人就问了, 这 vue3 的新 api 好处是什么? 

好处就是 js 业务代码可以拆分的更细. 比如上面的例子中的`countA`, 他是接口返回的数据, 我们一般情况下请求成功之前界面都要显示一个"加载动画", 这个"加载动画"的显示隐藏就需要一个变量控制, 一般我们起名叫`isLoading`:
**vue2**

```javascript
export default {
    data() {
        return { countA: 1, isLoading };
    },

    async mounted() {
        this.isLoading = true;
        const { data } = await axios.get('/api');
        this.countA = data;
        this.isLoading = false;
    },
};
```

这是 vue2 的写法, 我相信大家都是这么写的, 看起来应该没什么可以继续封装的了吧? 接下来用 vue3 的`ref`api 尝试进行封装:
**vue3**

```javascript
export default defineComponent({
    setup() {
        const [isLoading, countA] = useGet('/api');
        return { isLoading, countA };
    },
});

export function useGet(url) {
    const isLoading = ref(true);
    const dataSource = ref();
    axios
        .get(url)
        .then(({ data }) => {
            dataSource.value = data;
        })
        .finally(() => {
            isLoading.value = false;
        });
    return [isLoading, dataSource];
}
```

ref 的语法这里不讲, 只需要知道`isLoading.value=false`是给`isLoading`赋值即可, 更多请看[vue 官方文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E5%B8%A6-ref-%E7%9A%84%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8F%98%E9%87%8F)

这时候我们发现本来不能抽象的场景, 现在也可以抽象出一个`useGet`了.


## v-use-axios
沿着上面的思路, 我对axios做了一个完整的封装做成了插件形式, [代码在这里](https://github.com/any86/v-use-axios)

