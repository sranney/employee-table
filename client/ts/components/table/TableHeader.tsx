import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Employee } from '../../../types'
import { TableRowForm } from './TableRowForm'


type ListHeaderProps = {
  setEmployees: Dispatch<SetStateAction<Employee[]>>
}

export const TableHeader = ({ setEmployees }: ListHeaderProps) => {
  const [addEmployeeVisible, toggleAddEmployeeVisible] = useState(false)
  const toggleAddEmployeeForm = () =>
    toggleAddEmployeeVisible((visibility) => !visibility)

  // for adding a new employee - fetch sends request to create new employee item on backend
  const handleFormSubmit = (employee: PartialBy<Employee, 'id'>) => {
    // here employee should not contain id property - user doesn't set id and new employee data doesn't have ids yet

    fetch('/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    })
      .then((res) => res.json())
      .then((newEmployee: Employee) => {
        // successful requests are responded to with the new employee data object
        // to show complete list of employees, we need to update the employees state and add this new employee to the end of the list
        setEmployees((currentEmployees) => [...currentEmployees, newEmployee])
        toggleAddEmployeeForm()
      })
      .catch((error: string) => {
        // TODO: refine error handling
        console.error(
          `Error in POST request to create new employee ${employee.fullName}: ${error}`
        )
      })
  }
  
  return (
    <thead>
      <tr className="grid gap-x-2 py-2 grid-cols-table border-b border-solid border-theme-grey">
        <th className="text-left" id="employee-fullname" scope="col">
          Full Name
        </th>
        <th id="employee-dob" scope="col">
          DOB
        </th>
        <th id="employee-role" scope="col">
          Role
        </th>
        <th className="grid gap-2 grid-flow-row justify-end">
          <button
            name="add"
            className="relative border-none p-2 h-8 w-8 rounded-full bg-theme-blue shadow-md disabled:bg-theme-blue-200"
            disabled={addEmployeeVisible}
            onClick={toggleAddEmployeeForm}
            aria-label="add employee"
          >
            <FontAwesomeIcon
              color="white"
              icon={faPlus}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </button>
        </th>
      </tr>
      {addEmployeeVisible ? (
        <tr className="border-b border-solid border-theme-grey">
          <th className="font-normal">
            <TableRowForm
              handleFormSubmit={handleFormSubmit}
              cancelOnClick={toggleAddEmployeeForm}
              submitButtonIcon={faPlus}
            />
          </th>
        </tr>
      ) : null}
    </thead>
  )
}
