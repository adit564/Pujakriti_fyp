import { createRoot } from 'react-dom/client'
import './app/styles/index.css'
import './assets/fonts/stylesheet.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/routes.tsx'
import React from 'react'


createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
)
