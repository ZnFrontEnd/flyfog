import React, { Component } from 'react'
import { Form, Modal, Table, Alert, Button, Popconfirm, Input, Select } from 'antd'

@Form.create()
class TableConfig extends Component {
    state = {
        dataSource: [],
        keyNum: 0,
    }

    componentDidMount() {
        const { data } = this.props
        const dataSource = data.map((d, index) => ({ ...d, cusKey: index }))
        this.setState({
            dataSource,
        })
    }

    handleConfirm = () => {
        const { onConfirm = () => {} } = this.props
        const { dataSource } = this.state
        const data = dataSource.map(d => {
            delete d.cusKey
            if ('type' in d && d.type == null) {
                delete d.type
            }
            return d
        })
        onConfirm(data)
    }

    handleCancel = () => {
        const { onCancle = () => {} } = this.props

        onCancle()
    }

    // 添加行
    handleAddRow = () => {
        const { dataSource, keyNum } = this.state
        if (dataSource[dataSource.length - 1] && dataSource[dataSource.length - 1].type === 'oprate') {
            dataSource.splice(-1, 0, { dataIndex: `key-${keyNum}`, cusKey: `key-${keyNum}` })
        } else {
            dataSource.push({ dataIndex: `key-${keyNum}`, cusKey: `key-${keyNum}` })
        }

        this.setState({
            dataSource,
            keyNum: keyNum + 1,
        })
    }

    // 删除行
    handleRemoveRow = record => {
        const { dataSource } = this.state
        const res = dataSource.filter(d => d.cusKey !== record.cusKey)
        console.log(res)
        this.setState({
            dataSource: res,
        })
    }

    // 编辑单元格
    handleChangeEditTable = (newReocrd, record) => {
        const { dataSource } = this.state
        const newData = dataSource.map(data => {
            if (data.cusKey === record.cusKey) {
                if (newReocrd.type === 'oprate') {
                    newReocrd.title = '操作'
                    newReocrd.dataIndex = 'oprate'
                }
                return Object.assign({}, record, newReocrd)
            }
            return { ...data }
        })
        this.setState({
            dataSource: newData,
        })
    }

    render() {
        const { dataSource } = this.state

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
                <Alert
                    type="info"
                    message="提示"
                    closable
                    description={
                        <ol style={{ listStyle: 'decimal' }}>
                            <li>只有最后一行可以选择操作列，键值固定 toolcol</li>
                            <li>date 、 amount 为自定义类型，使用 BasicTable 组件时生效</li>
                            <li>注意 dataIndex 键值不能重复，我还没有写判重代码</li>
                        </ol>
                    }
                />
                <br />
                <Button type="primary" onClick={this.handleAddRow}>
                    添加行
                </Button>
                <Table
                    rowKey="cusKey"
                    columns={[
                        {
                            title: '列名 - title',
                            dataIndex: 'title',
                            render: (text, record) => {
                                return (
                                    <Input
                                        value={text}
                                        disabled={record.type === 'oprate'}
                                        onChange={e =>
                                            this.handleChangeEditTable(
                                                { title: e.target.value },
                                                record
                                            )
                                        }
                                    />
                                )
                            },
                        },
                        {
                            title: '键值 - dataIndex',
                            dataIndex: 'dataIndex',
                            render: (text, record) => {
                                return (
                                    <Input
                                        value={text}
                                        disabled={record.type === 'oprate'}
                                        onChange={e =>
                                            this.handleChangeEditTable(
                                                { dataIndex: e.target.value },
                                                record
                                            )
                                        }
                                    />
                                )
                            },
                        },
                        {
                            title: '类型 - type',
                            dataIndex: 'type',
                            render: (text, record) => {
                                return (
                                    <Select
                                        value={text}
                                        style={{ width: '100%' }}
                                        allowClear
                                        onChange={value =>
                                            this.handleChangeEditTable({ type: value }, record)
                                        }
                                    >
                                        <Select.Option value="date">日期 - date</Select.Option>
                                        <Select.Option value="amount">金额 - amount</Select.Option>
                                        <Select.Option value="longText">长字段 - longText</Select.Option>
                                        {record.cusKey ===
                                            dataSource[dataSource.length - 1].cusKey && (
                                            <Select.Option value="oprate">
                                                操作列 - oprate
                                            </Select.Option>
                                        )}
                                    </Select>
                                )
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
            </Modal>
        )
    }
}

export default TableConfig
