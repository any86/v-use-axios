import { Ref } from 'vue';
export type UseAxiosReturn<T> = [Ref<boolean>, Ref<T>, { error: Ref<any>, up: Ref<number>, down: Ref<number> }]
export type TransformResponse<T = any> = (a: any) => T;
export type PayloadOrTransformResponse = Record<string | number, any> | TransformResponse
export interface progressEvent {
    total: number;
    loaded: number;
}

// declare module '@vue/runtime-core' {
//     export interface ComponentCustomProperties {
//         $axios: AxiosInstance;
//     }
// }