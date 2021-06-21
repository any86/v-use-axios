import { AxiosRequestConfig, AxiosInstance, AxiosResponse, Method } from 'axios';
import { Ref } from 'vue';
export type UseAxiosReturn<T> = [Ref<boolean>, Ref<T>, { error: Ref<any>, up: Ref<number>, down: Ref<number> }]

export interface UseAxios<T = AxiosResponse> {
    <T>(options: AxiosRequestConfig, transformResponse: (a: any) => T): UseAxiosReturn<T>;
    get?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    post?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    put?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    patch?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
    delete?: (url: string, payloadOrTransform: any, transformResponse: (a: any) => T) => UseAxiosReturn<T>;
}

export interface progressEvent {
    total: number;
    loaded: number;
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $useAxio: UseAxios;
    }
}