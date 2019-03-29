import React, { Component } from 'react'
import { Form, Modal, Table, Checkbox, Button, Popconfirm, Input, Select } from 'antd'

@Form.create()
class SearchFormConfig extends Component {
    state = {
        dataSource: [],
        buttonGroup: [],
        keyNum: 0,
    }

    componentDidMount() {
        const { data, buttonGroup } = this.props
        const dataSource = data.map((d, index) => ({ ...d, cusKey: index }))
        this.setState({
            dataSource,
            buttonGroup: [...buttonGroup],
        })
    }

    handleConfirm = () => {
        const { onConfirm = () => {} } = this.props
        const { dataSource, buttonGroup } = this.state
        const data = dataSource.map(d => {
            delete d.cusKey
            return d
        })

        onConfirm(data, buttonGroup)
    }

    handleCancel = () => {
        const { onCancle = () => {} } = this.props

        onCancle()
    }

    // 添加行
    handleAddRow = () => {
        const { dataSource, keyNum } = this.state
        dataSource.push({ key: `key-${keyNum}` })

        this.setState({
            dataSource,
            keyNum: keyNum + 1,
        })
    }

    // 删除行
    handleRemoveRow = record => {
        const { dataSource } = this.state
        const res = dataSource.filter(d => d.cusKey !== record.cusKey)
        this.setState({
            dataSource: res,
        })
    }

    // 编辑单元格
    handleChangeEditTable = (newReocrd, record) => {
        const { dataSource } = this.state
        const newData = dataSource.map(data => {
            if (data.cusKey === record.cusKey) {
                // 对下拉框的数据进行处理
                if (newReocrd.type) {
                    if (newReocrd.type === 'select') {
                        newReocrd.options = [{ key: 1, value: '选择1' }, { key: 2, value: '选择2' }]
                    } else {
                        delete newReocrd.options
                    }
                }

                return Object.assign({}, record, newReocrd)
            }
            return { ...data }
        })
        this.setState({
            dataSource: newData,
        })
    }

    // 多选框change
    handleChangeCheckbox = (e, key) => {
        let { buttonGroup } = this.state

        if (e.target.checked) {
            buttonGroup.push(key)
        } else {
            buttonGroup = buttonGroup.filter(k => k !== key)
        }
        this.setState({
            buttonGroup,
        })
    }

    render() {
        const { dataSource, buttonGroup } = this.state

        return (
            <Modal
                title="配置查询表单"
                visible
                width={1000}
                maskClosable={false}
                onOk={this.handleConfirm}
                onCancel={this.handleCancel}
            >
                <h3>表单</h3>
                <Button type="primary" onClick={this.handleAddRow}>
                    添加行
                </Button>
                <Table
                    rowKey="cusKey"
                    columns={[
                        {
                            title: '标签 - label',
                            dataIndex: 'label',
                            render: (text, record) => {
                                return (
                                    <Input
                                        value={text}
                                        onChange={e =>
                                            this.handleChangeEditTable(
                                                { label: e.target.value },
                                                record
                                            )
                                        }
                                    />
                                )
                            },
                        },
                        {
                            title: '键值 - key',
                            dataIndex: 'key',
                            render: (text, record) => {
                                return (
                                    <Input
                                        value={text}
                                        onChange={e =>
                                            this.handleChangeEditTable(
                                                { key: e.target.value },
                                                record
                                            )
                                        }
                                    />
                                )
                            },
                        },
                        {
                            title: '表单类型 - type',
                            dataIndex: 'type',
                            render: (text, record) => {
                                return (
                                    <Select
                                        value={text}
                                        style={{ width: '100%' }}
                                        onChange={value =>
                                            this.handleChangeEditTable({ type: value }, record)
                                        }
                                    >
                                        <Select.Option value="input">输入框 - input</Select.Option>
                                        <Select.Option value="select">
                                            下拉框 - select
                                        </Select.Option>
                                        <Select.Option value="datepicker">
                                            日期选择器 - datepicker
                                        </Select.Option>
                                        <Select.Option value="rangepicker">
                                            范围日期选择器 - rangepicker
                                        </Select.Option>
                                    </Select>
                                )
                            },
                        },
                        {
                            title: '下拉框选择数据 - options',
                            dataIndex: 'options',
                            render: (text, record) => {
                                if (record.type === 'select') {
                                    return text ? JSON.stringify(text) : '[]'
                                }
                                return '--'
                            },
                        },
                        {
                            title: '操作',
                            dataIndex: 'oprater',
                            render: (_, record) => {
                                return (
                                    <Popconfirm
                                        title="是否确定删除该行数据"
                                        onConfirm={() => this.handleRemoveRow(record)}
                                    >
                                        <Button size="small">删除行</Button>
                                    </Popconfirm>
                                )
                            },
                        },
                    ]}
                    dataSource={dataSource}
                />
                <h3>按钮</h3>
                <div>
                    <Checkbox
                        checked={buttonGroup.includes('search')}
                        onChange={e => this.handleChangeCheckbox(e, 'search')}
                    >
                        搜索按钮
                    </Checkbox>
                    <Checkbox
                        checked={buttonGroup.includes('download')}
                        onChange={e => this.handleChangeCheckbox(e, 'download')}
                    >
                        下载按钮
                    </Checkbox>
                </div>
            </Modal>
        )
    }
}

export default SearchFormConfig
