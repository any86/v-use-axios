import { ref } from 'vue';
// type
import { App, Ref } from 'vue';
import { AxiosRequestConfig, AxiosInstance, AxiosResponse, Method } from 'axios';
interface progressEvent {
    total: number;
    loaded: number;
}

const KEY_DATA = 'data';
const KEY_PARAMS = 'params';
const METHOD_MAP = {
    'get': KEY_PARAMS,
    'post': KEY_DATA,
    'put': KEY_PARAMS,
    'patch': KEY_DATA,
    'delete': KEY_PARAMS,
}

type MEHOTD_NAME_LIST = keyof typeof METHOD_MAP;
type UseAxiosReturn<T> = [Ref<boolean>, Ref<T>, { error: Ref<any>, up: Ref<number>, down: Ref<number> }]

interface UseAxios<T = AxiosResponse> {
    <T>(options: AxiosRequestConfig, transformResponse: (a: any) => T): UseAxiosReturn<T>;
    get?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    post?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    put?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    patch?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    delete?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
}

export default {
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

        function _warp<T = any>(method: Method, url: string, payloadOrTransform: any, transformResponse: (a: any) => T = (a) => a) {
            const methodLow = method.toLocaleLowerCase() as keyof typeof METHOD_MAP;
            if (isFunction(payloadOrTransform)) {
                return useAxios<T>({ url, method }, payloadOrTransform);
            } else {
                return useAxios<T>({ url, method, [METHOD_MAP[methodLow]]: payloadOrTransform }, transformResponse);
            }
        }

        for (const method in METHOD_MAP) {
            useAxios[method as MEHOTD_NAME_LIST] = function (url, paramsOrTransform, transformResponse) {
                return _warp(method as Method, url, paramsOrTransform, transformResponse);
            }
        }

        app.config.globalProperties.$useAxios = useAxios;
    }
}

function _calcProgress(e: progressEvent) {
    const { loaded, total } = e;
    return loaded / total;
}

function isFunction(input: unknown): input is Function {
    return '[object Function]' === Object.prototype.toString.call(input);
}