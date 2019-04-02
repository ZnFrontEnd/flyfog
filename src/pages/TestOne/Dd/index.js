import React, { Component } from 'react'
import { connect } from 'dva'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SearchForm from '@/components/SearchForm'
import BasicTable from '@/components/BasicTable'

@connect(() => ({}))
class ER extends Component {
    state = {}

    componentDidMount () {
        this.fetchData()
    }

    // 请求表格的数据
    fetchData = () => {

    }

    // 查询表单搜索
    handleFormSearch = values => {
        console.log(values)
        this.fetchData(values)
    }

    // 查询表单下载
    handleFromDownload = values => {
        console.log(values)
    }

    render () {
        const { dataSrouce=[] } = this.props

        return (
            <PageHeaderWrapper>
                <SearchForm
                    data={[                        {
                            label: '输入框',
                            type: 'input',
                            key: 'inputKey',
                        },                        {
                            label: '选择框',
                            type: 'select',
                            options: [{"key":1,"value":"选择1"},{"key":2,"value":"选择2"}],
                            key: 'selectKey',
                        },                        {
                            label: '时间选择器',
                            type: 'datepicker',
                            key: 'dateKey',
                        },                        {
                            label: '范围时间选择器',
                            type: 'rangepicker',
                            key: 'rangedateKey',
                        },
                    ]}
                    buttonGroup={[                        { onSearch: this.handleFormSearch },                        { onDownload: this.handleFromDownload }
                    ]}
                />
                <BasicTable
                    columns={[                        {
                            title: '列1',
                            dataIndex: 'col1',
                        },                        {
                            title: '列2',
                            dataIndex: 'col2',
                        },                        {
                            title: '金额',
                            dataIndex: 'amount',
                            type: 'amount',
                        },                        {
                            title: '日期',
                            dataIndex: 'datecol',
                            type: 'date',
                        },                        {
                            type: 'oprate',
                            buttons: [{"text":"查看详情"},{"text":"编辑"}],
                        },
                    ]}
                    dataSource={dataSrouce}
                />
            </PageHeaderWrapper>
        )
    }
}

export default ER
