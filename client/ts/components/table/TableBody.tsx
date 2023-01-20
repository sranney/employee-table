import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Employee } from '../../../types'
import { TableRowForm } from './TableRowForm'
import { TableRow } from './TableRow'

type TableBodyProps = {
  employees: Employee[]
  setEmployees: Dispatch<SetStateAction<Employee[]>>
}

export const TableBody = ({ employees, setEmployees }: TableBodyProps) => {
  const [listOfActivelyEditedEmployees, setListOfActivelyEditedEmployees] =
    useState<string[]>([])
  // add id for employee to employees being edited - this causes a re-render and causes row in table to
  const editEmployee = (employeeId: string) =>
    setListOfActivelyEditedEmployees((editingEmployeeId) => [
      ...editingEmployeeId,
      employeeId,
    ])

  // handleFormSubmit is for editing employee information here
  const handleFormSubmit = (employee: PartialBy<Employee, 'id'>): void => {
    if (!employee.id)
      throw new Error(
        'error in editing existing employee data - no id provided to submit handler'
      )

    const employeeId = employee.id
    const employeePayload = {
      fullName: employee.fullName,
      DOB: employee.DOB,
      role: employee.role,
    }

    fetch(`/employees/${employeeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeePayload),
    })
      .then((res) => res.json())
      .then((newEmployeeData: Employee) => {
        // TODO: this operates differently than API does. If we refresh the page after editing an employee, we see that the edited employee is now at the bottom of the page.
        // This would be a bit jolting to the end user who was editing an employee towards the top of the list to all of a sudden have the employee moved to the bottom of the list.
        // Because of that, I think that there's a possible TODO for the backend to not adjust the order of the list upon edits. I'm keeping the order of the list present here.
        // Otherwise, we will still have a potentially jolting behavior if the user proceeds to remove another employee close to the one they just edited
        setEmployees((employees) =>
          employees.map((employeeItem) =>
            employeeItem.id === employee.id ? newEmployeeData : employeeItem
          )
        )
        setListOfActivelyEditedEmployees((editingEmployees) =>
          editingEmployees.filter((employeeId) => employeeId !== employee.id)
        )
      })
      .catch((error: string) => {
        console.error(
          `Error in PATCH request to update employee ${employee.fullName}: ${error}`
        )
      })
  }
  const cancelOnClick = (employeeId: string) => {
    setListOfActivelyEditedEmployees((editingEmployees) =>
      editingEmployees.filter((employeeIdItem) => employeeIdItem !== employeeId)
    )
  }

  return (
    <tbody>
      {employees.map((employee: Employee, idx) => (
        <tr
          data-testid={`table-body-row-${idx}`}
          key={employee.id}
          className={`border-b border-solid border-theme-grey${
            listOfActivelyEditedEmployees.includes(employee.id)
              ? ''
              : ' grid gap-x-2 py-2 grid-cols-table'
          }`}
        >
          {!listOfActivelyEditedEmployees.includes(employee.id) ? (
            <TableRow
              employee={employee}
              setEmployees={setEmployees}
              editEmployee={editEmployee}
            />
          ) : (
            <td>
              <TableRowForm
                employee={employee}
                handleFormSubmit={handleFormSubmit}
                cancelOnClick={() => cancelOnClick(employee.id)}
                submitButtonIcon={faCheck}
              />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  )
}
