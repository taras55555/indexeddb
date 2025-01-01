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
          <h1>IndexedDB status: <span className={isDBReady ? 'ready' : 'not-ready'}>{isDBReady ? ' Ready' : ' Not Ready'}</span></h1>
          <input className='text-field' type='text' placeholder='Enter data' onChange={(e) => setInputValue(e.target.value)} value={inputValue} disabled={!isDBReady} />
          <button
            className='btn'
            onClick={() => {
              usePutData(db, dbTable, { key: inputValue, date: Date.now() })
              setIsDBRefresh((cState) => !cState)
              setInputValue('')
            }}
            disabled={isDBReady && inputValue.length === 0}
          >
            Add Data
          </button>
        </>
      </section>

      <section className='data-list'>
        {[...allData].reverse().map((data) => (
          <div key={data.id} className='data-item'>
            <p>{data.key}</p>
            <p>{new Date(data.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>
        )
        )}
      </section>
    </main>
  )
}

export default App
