import Versions from './components/Versions'
import { Button } from './components/ui/button'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="p-4 bg-slate-50">
      <p className="text-3xl font-bold underline">Hello world!</p>
      <Button className="action">
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </Button>
      <Versions />
    </div>
  )
}

export default App
