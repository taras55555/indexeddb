import { useState, useEffect } from 'react'

import { useDB, usePutData, useGetAllData } from './hooks/useIndexedDB'

function App() {
  const { db = null, isDBReady = false, dbTable } = useDB()

  const [inputValue, setInputValue] = useState('')
  const [allData, setAllData] = useState([])
  const [isDBRefresh, setIsDBRefresh] = useState(false)

  useEffect(() => {
    if (isDBReady) {
      useGetAllData(db, dbTable).then(data => setAllData(data))
    }
  }, [db, isDBRefresh])

  return (
    <main className='container'>
      <section className='header'>
        <>
          <h1>IndexedDB status: {isDBReady ? ' Ready' : ' Not Ready'}</h1>
          <input className='text-field' type='text' placeholder='Enter data' onChange={(e) => setInputValue(e.target.value)} />
          <button
            className='btn'
            onClick={() => {
              usePutData(db, dbTable, { key: inputValue, date: Date.now() })
              setIsDBRefresh((cState) => !cState)
            }}
          >
            Add Data
          </button>
        </>
      </section>

      <section className='data-list'>
        {[...allData].reverse().map((data) => (
          <div key={data.id} className='data-item'>
            <p>{data.key}</p>
            <p>{new Date(data.date).toUTCString()}</p>
          </div>
        )
        )}
      </section>
    </main>
  )
}

export default App
