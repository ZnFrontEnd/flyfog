export const formData = [
    {
        label: '输入框',
        type: 'input',
        key: 'inputKey',
    },
    {
        label: '选择框',
        type: 'select',
        options: [{ key: 1, value: '选择1' }, { key: 2, value: '选择2' }],
        key: 'selectKey',
    },
    // {
    //     label: '检索下拉框',
    //     type: 'select',
    //     options: [
    //         { key: 1, value: '检索内容1' },
    //         { key: 2, value: '检索内容2' },
    //         { key: 3, value: '检索内容3' },
    //     ],
    //     showSearch: true,
    //     filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    //     key: 'searchKey',
    // },
    {
        label: '时间选择器',
        type: 'datepicker',
        key: 'dateKey',
    },
    {
        label: '范围时间选择器',
        type: 'rangepicker',
        key: 'rangedateKey',
    },
]

export const formButtonGrouop = ['search', 'download']

export const tableColumns = [
    {
        title: '列1',
        dataIndex: 'col1',
    },
    {
        title: '列2',
        dataIndex: 'col2',
    },
    {
        title: '金额',
        dataIndex: 'amount',
        type: 'amount',
    },
    {
        title: '日期',
        dataIndex: 'datecol',
        type: 'date',
    },
    {
        type: 'oprate',
        buttons: [
            {
                text: '查看详情',
                onClick: record => {
                    console.log(record)
                },
            },
            {
                text: '编辑',
                onClick: record => {
                    console.log(record)
                },
            },
        ],
    },
]
