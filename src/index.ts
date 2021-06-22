import { ref, inject } from 'vue';
import axios from 'axios';
// type
import { App, Ref } from 'vue';
import { AxiosRequestConfig, AxiosInstance, Method } from 'axios';

export type UseAxiosReturn<T> = [Ref<boolean>, Ref<T>, { run: (config?: AxiosRequestConfig) => void, error: Ref<any>, useUploadProgress: () => Ref<number>, useDownloadProgress: () => Ref<number>, onSuccess: (data?: any) => void, onError: (e?: any) => void }];

export type TransformResponse<T = any> = (a: any) => T;

export type PayloadOrTransformResponse = Record<string | number, any> | TransformResponse;
export interface progressEvent {
    total: number;
    loaded: number;
};

// declare module '@vue/runtime-core' {
//     export interface ComponentCustomProperties {
//         $axios: AxiosInstance;
//     }
// }

const KEY_DATA = 'data';
const KEY_PARAMS = 'params';
const METHOD_MAP = {
    'get': KEY_PARAMS,
    'post': KEY_DATA,
}

export const linkAxios = {
    /**
     * 初始化插件
     * @param app vue实例
     * @param axios axios实例
     */
    install: (app: App, axiosInstance: AxiosInstance = axios) => {
        app.provide('axiosInstance', axiosInstance);
        // app.config.globalProperties.$axios = axios;
    }
}

/**
 * 封装axios
 * @param options 同axios.request的第一个参数
 * @param transformResponse 变形接口返回的数据
 * @returns 返回transformResponse处理的数据
 */
export function useAxios<DataTransformed = any>(options: AxiosRequestConfig, transformResponse: TransformResponse = a => a): UseAxiosReturn<DataTransformed> {
    const axios = inject('axiosInstance') as AxiosInstance;
    const _errorRef = ref();
    const _isLoadingRef = ref(true);
    const _responseRef = ref();

    let _downloadProgressRef: Ref<number> | undefined;
    let _uploadProgressRef: Ref<number> | undefined;
    // 请求完毕后执行
    let _onSuccess: (data: any) => void = () => { };
    let _onError: (error: any) => void = () => { };


    function run(options2: AxiosRequestConfig = {}) {
        _isLoadingRef.value = true;
        axios.request({
            ...options,
            ...options2,
            onUploadProgress(e) {
                if (void 0 !== _uploadProgressRef) {
                    _uploadProgressRef.value = _calcProgress(e)
                }
            },

            onDownloadProgress(e) {
                if (void 0 !== _downloadProgressRef) {
                    _downloadProgressRef.value = _calcProgress(e)
                }
            }
        }).then((response) => {
            const dataTransformed = transformResponse(response);
            _responseRef.value = dataTransformed;
            _onSuccess(dataTransformed);
        }).catch((error) => {
            _errorRef.value = error;
            _onError(error);
        }).finally(() => {
            _isLoadingRef.value = false;
        });
    }

    // 开始请求
    run();

    return [_isLoadingRef, _responseRef, {
        run,
        error: _errorRef,
        useUploadProgress() {
            _uploadProgressRef = ref(0);
            return _uploadProgressRef;
        },
        useDownloadProgress() {
            _downloadProgressRef = ref(0);
            return _downloadProgressRef;
        },

        onSuccess(cb: (data?: any) => void) {
            _onSuccess = cb;
        },

        onError(cb: (data?: any) => void) {
            _onError = cb;
        }
    }];
}

// 别名
export const useHttp = useAxios;

export function useGet<DataTransformed = any>(url: string, paramsOrTransform: PayloadOrTransformResponse, transformResponse: TransformResponse<DataTransformed>) {
    return _warp('get', url, paramsOrTransform, transformResponse);
}


export function usePost<DataTransformed = any>(url: string, paramsOrTransform: PayloadOrTransformResponse, transformResponse: TransformResponse<DataTransformed>) {
    return _warp('post', url, paramsOrTransform, transformResponse);
}
/**
 * 包裹一下useAxios, 
 * 只为暴露method字段,
 * 方便循环
 * @param method get/post/put/patch/delete
 * @param url 请求地址
 * @param payloadOrTransform 参数或者变形函数
 * @param transformResponse 变形函数, 对接口返回的数据进行处理, 只有返回的数据才会被"ref"
 * @returns 同useAxios的返回值 {@link useAxios}
 */
function _warp<DataTransformed = any>(method: Method, url: string, payloadOrTransform: PayloadOrTransformResponse, transformResponse: TransformResponse<DataTransformed> = (a) => a) {
    const methodLow = method.toLocaleLowerCase() as keyof typeof METHOD_MAP;
    const paramKey = METHOD_MAP[methodLow];
    let returns: UseAxiosReturn<DataTransformed>;
    if (_isFunction(payloadOrTransform)) {
        returns = useAxios<DataTransformed>({ url, method }, payloadOrTransform);
    } else {
        returns = useAxios<DataTransformed>({ url, method, [paramKey]: payloadOrTransform }, transformResponse);
    }
    // 简化run
    returns[2].run = (payload: any) => returns[2].run({ [paramKey]: payload });
    return returns;
}


/**
 * 计算进度(小数)
 * @param e axios返回的进度事件
 * @returns 进度
 */
function _calcProgress(e: progressEvent) {
    const { loaded, total } = e;
    return Math.round(loaded / total * 100) / 100;
}

/**
 * 是否函数类型
 * @param input 输入 
 * @returns 是否函数
 */
function _isFunction(input: unknown): input is Function {
    return '[object Function]' === Object.prototype.toString.call(input);
}