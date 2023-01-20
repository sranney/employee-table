import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import type { Dispatch, SetStateAction } from 'react'
import type { Employee } from '../../../types'


type TableRowProps = {
  employee: Employee
  editEmployee: (employeeId: string) => void
  setEmployees: Dispatch<SetStateAction<Employee[]>>
}

export const TableRow = ({
  employee,
  editEmployee,
  setEmployees,
}: TableRowProps) => {
  const deleteEmployee = (): void => {
    fetch(`/employees/${employee.id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((employees: Employee[]) => setEmployees(employees))
      .catch((error: string) => {
        // TODO: refine error handling
        console.error(
          `Error in DELETE request to delete employee ${employee.fullName}: ${error}`
        )
      })
  }

  return (
    <>
      <td>{employee.fullName}</td>
      <td className="text-center">{employee.DOB}</td>
      <td className="text-center">{employee.role}</td>
      <td className="grid gap-2 grid-flow-col justify-end">
        <button
          className="relative bg-theme-blue border-none p-2 h-8 w-8 rounded-full shadow-md"
          name="edit"
          onClick={() => editEmployee(employee.id)}
          aria-label="edit employee"
        >
          <FontAwesomeIcon
            color="white"
            icon={faPencil}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
        <button
          className="relative bg-theme-blue border-none p-2 h-8 w-8 rounded-full shadow-md"
          name="delete"
          onClick={() => deleteEmployee()}
          aria-label="delete employee"
        >
          <FontAwesomeIcon
            color="white"
            icon={faTrashCan}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
      </td>
    </>
  )
}
