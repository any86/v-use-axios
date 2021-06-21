import { ref } from 'vue';
// type
import { App } from 'vue';
import { AxiosRequestConfig, AxiosInstance, Method } from 'axios';
import { UseAxios, progressEvent } from './types'

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

        const useAxios: UseAxios = function (options: AxiosRequestConfig, transformResponse = a => a) {
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
        function _warp<T = any>(method: Method, url: string, payloadOrTransform: any, transformResponse: (a: any) => T = (a) => a) {
            const methodLow = method.toLocaleLowerCase() as keyof typeof METHOD_MAP;
            if (_isFunction(payloadOrTransform)) {
                return useAxios<T>({ url, method }, payloadOrTransform);
            } else {
                return useAxios<T>({ url, method, [METHOD_MAP[methodLow]]: payloadOrTransform }, transformResponse);
            }
        }

        for (const method in METHOD_MAP) {
            useAxios[method as keyof typeof METHOD_MAP] = function (url, paramsOrTransform, transformResponse) {
                return _warp(method as Method, url, paramsOrTransform, transformResponse);
            }
        }
        
        // 注册$useAxios
        app.config.globalProperties.$useAxios = useAxios;
    }
}

function _calcProgress(e: progressEvent) {
    const { loaded, total } = e;
    return loaded / total;
}

function _isFunction(input: unknown): input is Function {
    return '[object Function]' === Object.prototype.toString.call(input);
}