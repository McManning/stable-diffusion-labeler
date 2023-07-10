import React, { createContext, useState, useEffect, useContext } from 'react'
import DragSelect from 'dragselect'

type ProviderProps = {
  children: React.ReactNode
  settings?: ConstructorParameters<typeof DragSelect>[0]
}

const Context = createContext<DragSelect | undefined>(undefined)

/**
 * @ref https://dragselect.com/docs/guided-examples/React
 */
function DragSelectProvider({ children, settings = {} }: ProviderProps) {
  const [ds, setDS] = useState<DragSelect>()

  useEffect(() => {
    setDS((prevState) => {
      if (prevState) return prevState
      return new DragSelect({})
    })

    return () => {
      if (ds) {
        ds.stop()
        setDS(undefined)
      }
    }
  }, [ds])

  useEffect(() => {
    ds?.setSettings(settings)
  }, [ds, settings])

  return <Context.Provider value={ds}>{children}</Context.Provider>
}

function useDragSelect() {
  return useContext(Context)
}

export { DragSelectProvider, useDragSelect }
