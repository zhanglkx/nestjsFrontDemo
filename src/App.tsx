import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import { useState } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState<unknown | null>(null)
 

  const fetchClick = () => {
    // Use Vite proxy: /api/users/me -> http://localhost:3000/users/me
    axios.get('/api/users/me')
      .then(response => {
        console.log('API Response:', response.data);
        setUser(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the API!', error);
      });
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={fetchClick}>
          Get current user
        </button>
        {user != null ? (
          <div style={{ marginTop: 12, textAlign: 'left' }}>
            <strong>Response:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(user as Record<string, unknown>, null, 2)}</pre>
          </div>
        ) : null}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
