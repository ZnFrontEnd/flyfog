import React, { Component, Fragment } from 'react'
import { Table, Button } from 'antd'
import moment from 'moment'

class BasicTable extends Component {
    /**
     * 业务化的columns转换
     */
    transformColumns = columns => {
        const newCol = columns.map(column => {
            const col = { ...column }
            if (col.type === 'date' && !col.render) {
                col.render = text => moment(text).format(col.format || 'YYYY-MM-DD hh:mm:ss')
            }
            // TODO: 金额千分符的转换
            // if (col.type === 'amount' && !col.render) {
            //     col.render = text => thoundAmount(text)
            // }
            if (col.type === 'oprate') {
                col.title = col.title || '操作'
                col.dataIndex = col.dataIndex || 'toolcol'

                if (!col.render && col.buttons && col.buttons.length) {
                    col.render = (_, record) => {
                        return (
                            <Fragment>
                                {col.buttons.map(({ text, onClick, ...btnPrams }) => (
                                    <Button
                                        size="small"
                                        key={text}
                                        onClick={() => onClick(record)}
                                        style={{
                                            marginRight: 10,
                                        }}
                                        {...btnPrams}
                                    >
                                        {text}
                                    </Button>
                                ))}
                            </Fragment>
                        )
                    }
                }
            }
            return col
        })
        return newCol
    }

    transformData = data => {
        const { rowKey } = this.props
        if (rowKey) {
            return data
        }
        data.forEach((d, index) => {
            d.key = d.key || index
        })
        return data
    }

    render() {
        const { columns, dataSource, rowSelection, pagination, ...props } = this.props
        const columnsOption = this.transformColumns(columns)
        const dataOption = this.transformData(dataSource)

        return (
            <Table
                columns={columnsOption}
                dataSource={dataOption}
                rowSelection={rowSelection || {}}
                pagination={{
                    showQuickJumper: true,
                    ...pagination,
                }}
                {...props}
            />
        )
    }
}

export default BasicTable
