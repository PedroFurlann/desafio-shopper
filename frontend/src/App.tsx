import { BrowserRouter } from "react-router-dom"
import { Routes } from "./routes"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
    <ToastContainer />
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    </>
  )
}

export default App
