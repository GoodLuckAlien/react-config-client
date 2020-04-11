import React,
 { useState, useMemo , useEffect , useRef } from 'react'
import { 
Tree, 
Modal, 
Form, 
Input,
Button,
Popconfirm,
message
 } from 'antd'
import {
PlusCircleOutlined,
DownOutlined,
DeleteOutlined,
FormOutlined
} from '@ant-design/icons'
import './config-router.scss'
import Api from '../../http/api/routerMenus'
import { formatList } from '../../utils/index'

type formProps = {
    path:string,
    name:string,
    icon?:string
}

interface treeDateItem extends formProps{
    id:number
    pid:number
}

const { 
apiCreateRouterMenus, 
apiGetMenusList,
apiDeleteMenus,
apiPutEditMenus
} = Api

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
}

const iconStyle = { 
    color: '#1890ff', 
    marginRight: '10px' 
}

const AddRouter = ({ id, setModelShow, getList, isEdit , editData }) => {
    const formContext :any = useRef()
    useEffect(()=>{
        if(editData){ /* 编辑 */
             formContext.current.setFieldsValue(editData)
        }else{ 
            formContext.current.resetFields()
        }  
    },[id ,editData ])
    /* 表单提交 */
    const handerSubmit =async (value:formProps)=>{
        const payload :any= {
            ...value,
        }
        function handerRequsetSuccess(){
            formContext.current.resetFields()
            setModelShow(false)
            getList()
        }
        if(!isEdit){ /* 新建路由 */
            payload.pid = id
            const res = await apiCreateRouterMenus(payload)
            const { code } = res
            if(code===0){
                message.success('创建成功！') 
                handerRequsetSuccess()
            }
        }else {
            const res = await apiPutEditMenus(editData.id,payload)
            if(res.code===0){
                message.success('编辑成功！') 
                handerRequsetSuccess() 
            }
        }
    }
    return (
        <Form 
            {...layout}
            ref={ formContext}
            onFinish={handerSubmit}
        >
            <Form.Item
                label="路由名称"
                name="name"
                rules={[{ 
                    required: isEdit ? false : true, 
                    message: '请输入路由名称!' 
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="path"
                name="path"
                rules={[{ 
                    required: isEdit ? false : true, 
                    message: '请输入路由路径!' 
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="图标"
                name="icon"
            >
                <Input />
            </Form.Item>
            <Form.Item >         
                <Button  type="primary" htmlType="submit">
                    { isEdit ? '编辑' : '创建' }
                </Button>
            </Form.Item>
        </Form>
    )
}

export default () => { 
    const isFlush = true
    const [ modelShow, setModelShow] = useState(false)
    const [ isRootRouter, setRootRouter] = useState(false)
    const [ Pid ,setPid ] = useState(null)
    const [ treeData ,setTreeData ] = useState([])
    const [ cacheData , setCacheData ] = useState([]) 
    const [ selectKeys ,setSelectKeys ] = useState([])
    const [ isEdit , setIsEdit ] = useState(false)
    const [ editData , setEditData ] = useState(null)
    /* 获取路由菜单列表 */
    const getMeunsList = async ()=>{
        const { code ,data } = await apiGetMenusList()
        if(code===0){  
            const newList :any = formatList(data
                .map((item:treeDateItem)=>(
                    {
                        ...item,
                        title:item.name,
                        icon: <PlusCircleOutlined/>,
                        key:item.id
                    }
                )))
            setCacheData(data)    
            setTreeData(newList)
        }
    }
    /* 删除路由菜单 */
    const Confirm = async ()=>{
        const deleteId = selectKeys[0]
        if(!deleteId) return message.error('当前路由不存在！')
        const childrenList = cacheData
        .filter((i:treeDateItem)=>i.pid===deleteId)
        if(childrenList.length >0) return message.error('无法删除当前路由，请先删掉子路由') 
        const { code } = await apiDeleteMenus(deleteId)
        if(code===0){
            message.success('删除成功')
            getMeunsList()
            setSelectKeys([])
        }
    }
    /* 编辑路由 */
    const Edit = ()=>{
        if(!selectKeys[0]) return
        const theList = cacheData
        .filter((i:treeDateItem)=>i.id===selectKeys[0])[0]
        setModelShow(true)
        setRootRouter(false)
        setEditData(theList)
        setIsEdit(true)
    }
    useEffect(()=>{
        getMeunsList()
    },[ isFlush ])
    return <div>
        {useMemo(() => (
            <Tree
                showIcon
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                treeData={treeData}
                selectedKeys={selectKeys}
                onSelect={(value:any)=>setSelectKeys(value)}
            />), [treeData,selectKeys])
        }
        {
           selectKeys.length > 0 &&
           <div className='childrenAdd'>
                <div 
                    className='add' 
                    onClick={()=>{
                        setModelShow(true)
                        setRootRouter(false)
                        setEditData(null)
                        setIsEdit(false)
                        setPid(selectKeys[0])
                    }} 
                >
                    <PlusCircleOutlined 
                        style={iconStyle} 
                    />
                    添加子路由
                </div>
                <Popconfirm
                    onConfirm={Confirm}
                    title="确定删除次路由菜单？"
                >
                    <div className='add'>
                        <DeleteOutlined 
                            style={iconStyle} 
                        />
                     删除此路由
                    </div>
                </Popconfirm>
                
                <div className='add' onClick={Edit} >
                    <FormOutlined 
                        style={iconStyle} 
                    />
                    编辑此路由
                </div>
            </div>  
        }
        <div 
            className="add" 
            onClick={() =>{ 
               setModelShow(true)
               setRootRouter(true)
               setSelectKeys([])
               setEditData(null)
               setIsEdit(false)
             }} 
        >
            <PlusCircleOutlined 
                style={iconStyle} 
            />
            添加根路由
        </div>
        <Modal
            title={isRootRouter ? '新建根路由' : ( isEdit ? '编辑路由' : '新建子路由' )}
            visible={modelShow}
            getContainer={false}
            footer={[]}
            onCancel={() => setModelShow(false)}
        >
           { useMemo(()=> 
           (<AddRouter 
                id={ isRootRouter ? 0 : Pid } 
                setModelShow={setModelShow}  
                getList={getMeunsList}
                isEdit={isEdit}
                editData={editData}
            />)
           ,[Pid,isRootRouter,editData]) }
        </Modal>

    </div>
} 