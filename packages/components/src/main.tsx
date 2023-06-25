import React from 'react'
import ReactDOM from 'react-dom/client'
import { FhirApp } from './FhirApp'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FhirApp>
      Hello world
    </FhirApp>
  </React.StrictMode>,
)
