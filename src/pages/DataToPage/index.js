import React, { PureComponent } from 'react'
import { Tree, Form, Input, Checkbox, Button, Popconfirm, Modal, Drawer } from 'antd'
import SearchForm from 'components/SearchForm'
import BasicTable from 'components/BasicTable'
import SearchFormConfig from './SearchFormConfig'
import TableConfig from './TableConfig'

import { generatePage, getPages } from './services'
import {
    formData as formDataInState,
    formButtonGrouop as formButtonGrouopInState,
    tableColumns as tableColumnsInState,
} from './templateMap'

import styles from './index.less'

const { TreeNode } = Tree
const FormItem = Form.Item

@Form.create()
class DataToPage extends PureComponent {
    state = {
        showConfig: false,
        isConfiguring: false,
        showSearchFormConfig: false,
        showTableConfig: false,
        searchFormData: formDataInState,
        searchFormButtonGrouop: formButtonGrouopInState,
        tableColumns: tableColumnsInState,
        pages: [],
    }

    componentDidMount() {
        getPages().then(res => {
            if (res && res.success) {
                this.setState({
                    pages: res.data,
                })
            }
        })
    }

    // 确认添加一个新的页面
    handleAddNewPage = page => {
        const { isConfiguring } = this.state
        const {
            form: { setFieldsValue },
        } = this.props

        if (isConfiguring) {
            Modal.confirm({
                title: '警告',
                content: '当前正在配置页面，是否重制并在新的配置生成？',
                onOk: () => {
                    this.setState(
                        {
                            showConfig: true,
                        },
                        () => {
                            setFieldsValue({ path: `/${page}` })
                        }
                    )
                },
            })
            return
        }
        this.setState(
            {
                isConfiguring: true,
                showConfig: true,
            },
            () => {
                setFieldsValue({ path: `/${page}` })
            }
        )
    }

    // 确认生成页面
    handleConfirmGenerate = () => {
        const { searchFormData, searchFormButtonGrouop, tableColumns } = this.state
        const {
            form: { validateFields },
        } = this.props

        validateFields((errors, values) => {
            if (!errors) {
                // fileName \ componentName \ functions \ path
                const data = Object.assign({}, values, {
                    formData: searchFormData,
                    formButtonGrouop: searchFormButtonGrouop,
                    tableColumns,
                })

                generatePage(data).then(res => {
                    if (res && res.success) {
                        Modal.success({
                            title: "成功!",
                        })
                    }
                })
            }
        })
    }

    // 取消此次操作
    handleCancleGenerate = () => {
        this.setState({
            showConfig: false,
            isConfiguring: false,
        })
    }

    // 显示配置
    handleShowConfig = () => {
        this.setState({
            showConfig: true,
        })
    }

    // 隐藏配置
    handleHideConfig = () => {
        this.setState({
            showConfig: false,
        })
    }

    // ============
    // 表单的配置
    onShowSearchFormConfig = () => {
        this.setState({
            showSearchFormConfig: true,
        })
    }

    handleConfirmSearchFormConfig = (searchFormData, searchFormButtonGrouop) => {
        this.setState({
            searchFormData,
            searchFormButtonGrouop,
            showSearchFormConfig: false,
        })
    }

    handleCancleSearchFormConfig = () => {
        this.setState({
            showSearchFormConfig: false,
        })
    }
    // ============

    // ============
    // 表格的配置
    onShowTableConfig = () => {
        this.setState({
            showTableConfig: true,
        })
    }

    handleConfirmTableConfig = tableColumns => {
        this.setState({
            tableColumns,
            showTableConfig: false,
        })
    }

    handleCancleTableConfig = () => {
        this.setState({
            showTableConfig: false,
        })
    }
    // ============

    // 生成预览的表格数据
    generatePreviewTableData = columns => {
        const res = []
        const data = {}

        columns.forEach(col => {
            if (col.type === 'date') {
                data[col.dataIndex] = new Date()
            } else if (col.type === 'amount') {
                data[col.dataIndex] = Math.floor(Math.random() * 1000)
            } else if (col.type !== 'oprate') {
                data[col.dataIndex] = '模拟数据'
            }
        })
        res.push(Object.assign({}, data))
        res.push(Object.assign({}, data))
        res.push(Object.assign({}, data))
        res.push(Object.assign({}, data))
        return res
    }

    // 构建菜单树
    mapTreeNode = nodes => {
        return nodes.map(nd => (
            <TreeNode
                title={
                    <div>
                        <span
                            style={{
                                marginRight: 15,
                            }}
                        >
                            {`${nd.name} - ${nd.component}`}
                        </span>
                        <Popconfirm
                            title={`是否确定在 ${nd.name} 下添加子页面`}
                            onConfirm={() => this.handleAddNewPage(nd.component)}
                        >
                            <Button type="primary" shape="circle" icon="plus" size="small" />
                        </Popconfirm>
                    </div>
                }
                key={nd.component}
            >
                {nd.pages &&
                    nd.pages.map(p => (
                        <TreeNode title={`${p.name} - ${p.component}`} key={p.component} />
                    ))}
            </TreeNode>
        ))
    }

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props
        const {
            pages,
            showConfig,
            searchFormData,
            searchFormButtonGrouop,
            tableColumns,
            isConfiguring,
            showSearchFormConfig,
            showTableConfig,
        } = this.state

        const buttonGroup = searchFormButtonGrouop.map(key => {
            if (key === 'search') {
                return {
                    onSearch: value => console.log(value),
                }
            }
            if (key === 'download') {
                return {
                    onDownload: value => console.log(value),
                }
            }
            return {}
        })

        const previewTableData = this.generatePreviewTableData(tableColumns)
        const mockSearchForm = <SearchForm data={searchFormData} buttonGroup={buttonGroup} />
        const mockTable = <BasicTable columns={tableColumns} dataSource={previewTableData} />
        const formLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }
        const configTemp = (
            <Form>
                <FormItem {...formLayout} label="页面位置">
                    {getFieldDecorator('path', {
                        rules: [{ required: true, message: '位置必须填！' }],
                    })(<Input disabled />)}
                </FormItem>
                <FormItem {...formLayout} label="文件名">
                    {getFieldDecorator('fileName', {
                        rules: [
                            { required: true, message: '组件名称必填！' },
                            { pattern: /^[A-Z][a-zA-Z]+$/, message: '首字母大写，只能英文' },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formLayout} label="组件名">
                    {getFieldDecorator('componentName', {
                        rules: [
                            { required: true, message: '组件名称必填！' },
                            { pattern: /^[A-Z][a-zA-Z]+$/, message: '首字母大写，只能英文' },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formLayout} label="页面功能">
                    {getFieldDecorator('functions', {
                        initialValue: ['SearchForm', 'BasicTable'],
                    })(
                        <Checkbox.Group>
                            <Checkbox disabled value="SearchForm">
                                搜索表单
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={this.onShowSearchFormConfig}
                                >
                                    配置数据
                                </Button>
                            </Checkbox>
                            <br />
                            <br />
                            <Checkbox disabled value="BasicTable">
                                基础表格
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={this.onShowTableConfig}
                                >
                                    配置数据
                                </Button>
                            </Checkbox>
                            <br />
                            <br />
                            <Checkbox value="ButtonGroup" disabled>
                                按钮组
                            </Checkbox>
                        </Checkbox.Group>
                    )}
                </FormItem>
                <FormItem {...formLayout}>
                    <Button type="primary" onClick={this.handleConfirmGenerate}>
                        确认生成页面
                    </Button>
                    <br />
                    <Button type="danger" onClick={this.handleCancleGenerate}>
                        取消此次操作
                    </Button>
                </FormItem>
            </Form>
        )

        return (
            <div className={styles.container}>
                <div className={styles.menu}>
                    <h3>页面菜单</h3>
                    <Tree>{this.mapTreeNode(pages)}</Tree>
                </div>
                {!isConfiguring && <div className={styles.addPageTip}>快来添加页面</div>}
                {isConfiguring && (
                    <div className={styles.preview}>
                        <h3>预览</h3>
                        {mockSearchForm}
                        {mockTable}
                    </div>
                )}
                {isConfiguring && (
                    <div className={styles.config}>
                        <div className={styles.configShowButton} onClick={this.handleShowConfig}>
                            {`<<<<<<`}
                            点击修改配置
                            {`<<<<<<`}
                        </div>
                        <Drawer
                            title="配置"
                            placement="right"
                            width="400"
                            maskClosable={false}
                            onClose={this.handleHideConfig}
                            visible={showConfig}
                        >
                            {configTemp}
                        </Drawer>
                    </div>
                )}
                {showSearchFormConfig && (
                    <SearchFormConfig
                        onConfirm={this.handleConfirmSearchFormConfig}
                        onCancle={this.handleCancleSearchFormConfig}
                        data={searchFormData}
                        buttonGroup={searchFormButtonGrouop}
                    />
                )}
                {showTableConfig && (
                    <TableConfig
                        data={tableColumns}
                        onConfirm={this.handleConfirmTableConfig}
                        onCancle={this.handleCancleTableConfig}
                    />
                )}
            </div>
        )
    }
}

export default DataToPage
