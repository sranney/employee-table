import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useReducer } from 'react'
import type { Employee } from '../../../types'

//form is for either editing existing employee data or creating new employee entries
type TableRowFormProps = {
  employee?: PartialBy<Employee, 'id'>
  handleFormSubmit: (employee: PartialBy<Employee, 'id'>) => void
  submitButtonIcon: IconProp
  cancelOnClick: () => void
}

/**
 * state is Partial<Employee> because only when editing an existing employee will all fields be present
 * the inclusion of id in the state object will only be when editing an existing employee
 * when adding a new employee, state will be an empty object, so even in that case all employee properties are optional
 **/
const employeeStateReducer = (
  state: Partial<Employee>,
  action: Omit<Partial<Employee>, 'id'>
) => ({ ...state, ...action })

export const TableRowForm = ({
  employee = { DOB: '', fullName: '', role: '' }, // this is needed to avoid warning stating that we are changing uncontrolled form element to controlled form element (discovered via test)
  handleFormSubmit,
  cancelOnClick,
  submitButtonIcon,
}: TableRowFormProps) => {
  // reducer takes actions dispatched with objects with a single key representing a single data point for an employee
  // this reducer operates similarly to setState, where actions passed to dispatch override previous state values
  // employee is only passed in as a prop if we are editing an existing employee's data
  const [employeeDataInternal, dispatch] = useReducer(
    employeeStateReducer,
    employee || {}
  )

  /**
   * isSufficientEmployeeData - determines if partial employee data suffices for making API calls
   * API calls for creating a new employee in the db only require fullName, DOB and role
   */
  const isSufficientEmployeeData = (
    employeeData: Partial<Employee>
  ): employeeData is PartialBy<Employee, 'id'> => {
    return !!employeeData.fullName && !!employeeData.DOB && !!employeeData.role
  }

  /**
   * submitButtonEnabled
   * 2 circumstances:
   * 1. existing employee edit: submit button should be enabled if at least one of the fields has a different value than what is present in the employee's data already
   * 2. new employee create: submit button should be enabled if fullName, DOB and role have all been provided values
   */
  const submitButtonEnabled = (): boolean => {
    if (
      !!employeeDataInternal.fullName &&
      !!employeeDataInternal.DOB &&
      !!employeeDataInternal.role &&
      !!employeeDataInternal.id &&
      !!employee
    ) {
      /**
       * we need truthy values for fullName, DOB and role before we should enable the form submit button
       * (!!employeeDataInternal.id && !!employee) being true means that the form is for an existing employee edit
       * in addition to truthy values, we need to make sure that all data is not exactly the same as it exists currently for employee
       */
      return !(
        employeeDataInternal.fullName === employee.fullName &&
        employeeDataInternal.DOB === employee.DOB &&
        employeeDataInternal.role === employee.role
      )
    } else {
      // otherwise, new employee create, and only need to have all fields filled in
      return (
        !!employeeDataInternal.fullName &&
        !!employeeDataInternal.DOB &&
        !!employeeDataInternal.role
      )
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSufficientEmployeeData(employeeDataInternal)) {
      handleFormSubmit(employeeDataInternal)
    }
  }

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    cancelOnClick()
  }
  
  return (
    <form
      className="grid gap-x-2 py-2 grid-cols-table"
      aria-label="Add or Edit Employee"
      onSubmit={onSubmit}
    >
      <input
        className="border-solid border-2 border-theme-grey-400 border px-2"
        aria-labelledby="employee-fullname"
        required
        name="fullName"
        title="Enter Employee Full name"
        value={employeeDataInternal.fullName}
        onChange={(event) => dispatch({ fullName: event.target.value })}
      />
      <input
        className="border-solid border-2 border-theme-grey-400 border px-2"
        pattern="\d{1,2}/\d{1,2}/\d{4}"
        aria-labelledby="employee-dob"
        required
        name="Date of Birth"
        title="Enter Employee D.O.B."
        value={employeeDataInternal.DOB}
        onChange={(event) => dispatch({ DOB: event.target.value })}
      />
      <input
        className="border-solid border-2 border-theme-grey-400 border px-2"
        aria-labelledby="employee-role"
        required
        name="role"
        title="Enter Employee role"
        value={employeeDataInternal.role}
        onChange={(event) => dispatch({ role: event.target.value })}
      />
      <div className="grid gap-2 grid-flow-col justify-end">
        <button
          type="submit"
          className="relative border-none p-2 h-8 w-8 rounded-full bg-theme-blue disabled:bg-theme-blue-200 shadow-md"
          name="Submit"
          disabled={!submitButtonEnabled()}
          aria-label="submit form"
        >
          <FontAwesomeIcon
            color="white"
            icon={submitButtonIcon}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
        <button
          type="button"
          className="relative bg-theme-blue border-none p-2 h-8 w-8 rounded-full shadow-md"
          name="Cancel"
          onClick={onCancel}
          aria-label="cancel form action"
        >
          <FontAwesomeIcon
            color="white"
            icon={faXmark}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </form>
  )
}
