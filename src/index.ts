import { ref, provide, inject } from 'vue';
// type
import { App } from 'vue';
import { AxiosRequestConfig, AxiosInstance, Method } from 'axios';
import { UseAxiosReturn, TransformResponse, progressEvent, PayloadOrTransformResponse } from './types'

const KEY_DATA = 'data';
const KEY_PARAMS = 'params';
const METHOD_MAP = {
    'get': KEY_PARAMS,
    'post': KEY_DATA,
}

export default {
    /**
     * 初始化插件
     * @param app vue实例
     * @param axios axios实例
     */
    install: (app: App, axios: AxiosInstance) => {
        provide('axiosInstance', axios);
        // app.config.globalProperties.$axios = axios;
    },
    useAxios,
    useGet,
    usePost
}

/**
 * 封装axios
 * @param options 同axios.request的第一个参数
 * @param transformResponse 变形接口返回的数据
 * @returns 返回transformResponse处理的数据
 */
function useAxios<DataTransformed = any>(options: AxiosRequestConfig, transformResponse: TransformResponse = a => a): UseAxiosReturn<DataTransformed> {
    const axios = inject('axiosInstance') as AxiosInstance;
    const _uploadProgressRef = ref(0);
    const _downloadProgressRef = ref(0);
    const _errorRef = ref();
    const _isLoadingRef = ref(true);
    const _responseRef = ref();
    axios.request({
        ...options,
        
        onUploadProgress(e) {
            _uploadProgressRef.value = _calcProgress(e)
        },

        onDownloadProgress(e) {
            _downloadProgressRef.value = _calcProgress(e)
        }
    }).then((response) => {
        _responseRef.value = transformResponse(response);
    }).catch((error) => {
        _errorRef.value = error;
    }).finally(() => {
        _isLoadingRef.value = false;
    });

    return [_isLoadingRef, _responseRef, {
        error: _errorRef,
        up: _uploadProgressRef,
        down: _downloadProgressRef
    }];
}


function useGet<DataTransformed = any>(url: string, paramsOrTransform: PayloadOrTransformResponse, transformResponse: TransformResponse<DataTransformed>) {
    return _warp('get', url, paramsOrTransform, transformResponse);
}


function usePost<DataTransformed = any>(url: string, paramsOrTransform: PayloadOrTransformResponse, transformResponse: TransformResponse<DataTransformed>) {
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
    if (_isFunction(payloadOrTransform)) {
        return useAxios<DataTransformed>({ url, method }, payloadOrTransform);
    } else {
        return useAxios<DataTransformed>({ url, method, [METHOD_MAP[methodLow]]: payloadOrTransform }, transformResponse);
    }
}


/**
 * 计算进度(小数)
 * @param e axios返回的进度事件
 * @returns 进度
 */
function _calcProgress(e: progressEvent) {
    const { loaded, total } = e;
    return loaded / total;
}

/**
 * 是否函数类型
 * @param input 输入 
 * @returns 是否函数
 */
function _isFunction(input: unknown): input is Function {
    return '[object Function]' === Object.prototype.toString.call(input);
}