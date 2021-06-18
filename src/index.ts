import axios, { AxiosRequestConfig } from 'axios';
import { createApp,h } from 'vue';





// export function useAxios<T = any>(options: AxiosRequestConfig, transformResponse: (a: any) => any = (a) => a): [Ref<any>, Ref<T>, Ref<any>] {
//     const _isLoading = ref(true);
//     const _data = ref();
//     const _error = ref();
//     http.request(options)
//         .then((data) => {
//             _data.value = transformResponse(data);
//         })
//         .catch((error) => {
//             _error.value = error;
//         }).finally(() => {
//             _isLoading.value = false;
//         });

//     return [_isLoading, _data, _error];
// }


// export function useHttpGet<T = any>(url: string, paramsOrTransform?: Record<string, any>, transformResponse: (a: any) => any = (a) => a): [Ref<any>, Ref<T>, Ref<any>] {
//     if (isFunction(paramsOrTransform)) {
//         return useAxios<T>({ url, method: 'get' }, paramsOrTransform);
//     } else {
//         return useAxios<T>({ url, method: 'get', params: paramsOrTransform }, transformResponse);
//     }
// }


// export function useHttpPost<T = any>(url: string, paramsOrTransform?: Record<string, any>, transformResponse: (a: any) => any = (a) => a): [Ref<any>, Ref<T>, Ref<any>] {
//     if (isFunction(paramsOrTransform)) {
//         return useAxios<T>({ url, method: 'post' }, transformResponse);
//     } else {
//         return useAxios<T>({ url, method: 'get', data: paramsOrTransform }, transformResponse);
//     }
// }

// export const useHttp = useHttpGet;
// /**
//  * 设置token
//  * @param {String} token 
//  */
// export const setHttpToken = (token: string) => {
//     const __token = `Bearer ${token}`
//     localStorage.setItem(TOKEN_NAME, __token);
//     http.defaults.headers['Authorization'] = __token;
// };




const p = {
    install: (app:any, options:any) => {
console.log(app);
    }
}


const app = createApp({
    render(){
        return h('div')
    }
})

app.use(p)