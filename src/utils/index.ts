/**
 * 数据类型校验
 * @param type 待校验类型
 */
export function isType (type:any){
  return  Object.prototype.toString.call(type).slice(8,-1)
}

/* 字符串类型 */
export function isString (type:any) {
    return isType(type) === 'String'
}

/* 数字类型 */
export function isNumber (type:any){
    return isType(type) === 'Number'
}

/* 函数类型 */
export function isFuntion (type:any){
    return isType(type) === 'Function'
}

/* 数组类型 */
export function isArray (type:any){
    return isType(type) === 'Array'
}

/* 对象类型 */
export function isObject (type:any){
    return isType(type) === 'Object'
}

/**
 * 解析URL
 * @param urlStr 当前需解析的URL
 */
export function parseQueryString(urlStr:string){
    const pos = urlStr.indexOf('?') + 1
    const paramsStr = urlStr.substring(pos)
    const obj :any= {}
    const paramsArr = paramsStr.split('&')
    paramsArr.forEach( function(element:string) {
        const _arr = element.split('=')
        obj[_arr[0]] =  _arr[1]
    })
    return obj
}

/* 上传文件，选择文件 */
export function selectUploadFile (callback:any) {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.onchange = callback
    input.click()
}

/* 退出登陆 */
export function loginOut(history:any){
    window.localStorage.removeItem('token')
    history.push('/login')
}

/* 格式化数组 根据pid 找到父子对应关系 */
export function formatList(list:Array<any>){
    const rootList = list.filter(i=>i.pid===0)
    const notRootList = list.filter(i=>i.pid!==0)
    if(notRootList.length !== 0){
        const object = {}
        list
        .forEach(item=>{
            object[String(item.id)] = item
        })
        notRootList
        .forEach(item=>{
            const parent = object[String(item.pid)]
            if(!parent.children) parent.children = []
            parent.children.push(item)
        })
    }
    return rootList
}