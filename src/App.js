import { HashRouter } from 'react-router-dom'
import './App.css'
import BaseRouter from './router/BaseRouter'

function App() {
  return (
    <HashRouter>
      {/* 一级路由 */}
      <BaseRouter>
      </BaseRouter>
    </HashRouter>
  )
}

export default App