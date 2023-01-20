import React, { useEffect, useState } from 'react'

import type { Employee } from '../types'
import { ErrorBoundaryWrapper } from './components/error/ErrorBoundaryWrapper'
import { TableBody } from './components/table/TableBody'
import { TableHeader } from './components/table/TableHeader'

export const App = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  useEffect(() => {
    fetch('/employees')
      .then((res) => res.json())
      .then((employees: Employee[]) => {
        setEmployees(employees)
      })
      .catch((error: string) => {
        // TODO: refine error handling
        console.error(`Error in GET request fetching all employees: ${error}`)
      })
  }, [])

  return (
    <>
      <header className="text-3xl bg-theme-blue text-white px-6 py-12 mb-8 font-bold">
        <h1 className="m-0">Employees</h1>
      </header>
      <ErrorBoundaryWrapper>
        <div>
          <table
            className="mx-6"
            summary="Records of Employees Working at ACME Company"
          >
            <TableHeader setEmployees={setEmployees} />
            <TableBody employees={employees} setEmployees={setEmployees} />
          </table>
        </div>
      </ErrorBoundaryWrapper>
    </>
  )
}
