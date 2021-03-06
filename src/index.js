import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './pages'

import 'antd/dist/antd.less'


ReactDOM.render(
    <AppContainer>
        <App />
    </AppContainer>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept()
}
