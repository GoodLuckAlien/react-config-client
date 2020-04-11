/* 常量 */
export const BASE_URL = 'http://127.0.0.1:7001/'

export const CODE = {
    EXPIRE: 402,  /* 402 过期 */
    UNAUTHORIZED:401 /* 未授权登陆 */
}

export const REQUEST_FAIL_MESSAGE = {
    '402':'token过期',
    '401':'未授权登陆,请先登陆！'
}