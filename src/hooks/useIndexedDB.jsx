import { useState, useEffect } from 'react'

import configIndexedDatabase from '../indexeddb/database-config'

export function useDB() {
    const [db, setDB] = useState(null)
    const [isDBReady, setDBReady] = useState(false)

    const { dbName, dbVersion, dbTable } = configIndexedDatabase

    useEffect(() => {

        function intiDB() {
            const request = indexedDB.open(dbName, dbVersion)

            request.onupgradeneeded = () => {
                const database = request.result
                if (!database.objectStoreNames.contains(dbTable)) {
                    database.createObjectStore(dbTable, { autoIncrement: true, keyPath: 'id' })
                }
            }

            request.onsuccess = () => {
                setDB(request.result)
                setDBReady(true)
            }

            request.onerror = () => {
                console.log('Connection Error')
                setDBReady(true)
            }

        }

        return () => {
            if (!db) {
                intiDB()
            }
        }

    }, [])

    return { db, isDBReady, dbTable }
}

function getTransaction(db, tableName, mode) {
    if (!db) throw newError('Database is not ready')
    return db.transaction(tableName, mode).objectStore(tableName)
}

export function usePutData(db, tableName, data) {
    return new Promise((resolve, reject) => {
        try {
            const store = getTransaction(db, tableName, 'readwrite')
            const request = store.add(data)
            request.onsuccess = () => resolve('Data added successfully')
            request.onerror = () => reject('Failed to add data')
        } catch (error) {
            reject(error)
        }
    })
}

export function useGetAllData(db, tableName) {
    return new Promise((resolve, reject) => {
        try {
            const store = getTransaction(db, tableName, 'readonly')
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject('Failed to get data')

        } catch (error) {
            reject(error)
        }
    })
}