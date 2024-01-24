import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from './App.tsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { register } from 'swiper/element/bundle'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

register()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer autoClose={3000} />
      <RouterProvider router={BrowserRouter} />
    </AuthProvider>
  </React.StrictMode>,
)
