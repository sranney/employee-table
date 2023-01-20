import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../ts/App'
import dbEmployeeData from './mockedServer/dbEmployeeData.json'

test('should render list of all employees', async () => {
  render(<App />)
  /**
   * this is a bit of a last resort - I tried to find different ways to access tbody rows,
   * but we have row(s) in the thead and there's seemingly not a logical way to distinguish them without getting into implementation details
   * testids aren't great, but it's much better than cracking open the JSDOM and trying to access via html markup which the end user won't know
   */
  const employeeTableRows = await screen.findAllByTestId(/table-body-row/i)
  // after data has finished loading we should have table rows representing all employees fetched
  expect(employeeTableRows).toHaveLength(dbEmployeeData.length)
  // data rendered is aligned in the correct columns
  const employeeTableColumnHeaders = screen.getAllByRole('columnheader')
  expect(employeeTableColumnHeaders).toHaveLength(4)
  // order of column headers
  expect(employeeTableColumnHeaders[0]).toHaveTextContent(/full name/i)
  expect(employeeTableColumnHeaders[1]).toHaveTextContent(/dob/i)
  expect(employeeTableColumnHeaders[2]).toHaveTextContent(/role/i)
  // ensure that table rows have data presented in the correct order...
  // unfortunately, not quite sure of a way of doing this other than through assuming something about the shape of the API data
  // TODO: look further into this to determine if there's a better way of doing this
  const tableRowCells = await within(employeeTableRows[0]).findAllByRole('cell')
  expect(tableRowCells[0]).toHaveTextContent(
    new RegExp(dbEmployeeData[0].fullName, 'i')
  )
  expect(tableRowCells[1]).toHaveTextContent(
    new RegExp(dbEmployeeData[0].dob, 'i')
  )
  expect(tableRowCells[2]).toHaveTextContent(
    new RegExp(dbEmployeeData[0].role, 'i')
  )
  // we should not have forms present on the page initially, only when user chooses to edit or add a new employee
  expect(screen.queryByRole('form')).not.toBeInTheDocument()
})

test('should allow users to add a new employee record', async () => {
  const user = userEvent.setup()
  render(<App />)
  const employeeTableRows = await screen.findAllByTestId(/table-body-row/i)
  // after data has finished loading we should have table rows representing all employees fetched
  expect(employeeTableRows).toHaveLength(dbEmployeeData.length)
  // user must click on the add employee button to then render the form to add employee record
  const addEmployeeBtn = screen.getByLabelText(/add employee/i)
  await user.click(addEmployeeBtn)
  // we now expect that the add employee form is rendered
  expect(screen.getByRole('form')).toBeInTheDocument()

  // submit button is disabled at first
  const submitBtn = screen.getByLabelText('submit form')
  expect(submitBtn).toBeDisabled()

  // we also expect that the add employee form button is disabled
  expect(addEmployeeBtn).toBeDisabled()

  // form should contain inputs for fullName, dob and role
  const fullNameInput = screen.getByLabelText(/full name/i)
  const dobInput = screen.getByLabelText(/dob/i)
  const roleInput = screen.getByLabelText(/role/i)

  // user entry and validation of full name input
  expect(fullNameInput).toBeInvalid()
  const userFullName = 'test user'
  await user.type(fullNameInput, userFullName)
  expect(fullNameInput).toBeValid()

  /**
   * user entry and validation of dob input - entry must follow pattern \d{1,2}/\d{1,2}/\d{4}
   * for instance 01/01/2001
   */
  expect(dobInput).toBeInvalid()
  await user.type(dobInput, 'asdfsdf') // invalid entry
  expect(dobInput).toBeInvalid()
  await user.clear(dobInput)
  await user.type(dobInput, '01/01/01') // invalid entry #2
  expect(dobInput).toBeInvalid()
  await user.clear(dobInput)
  await user.type(dobInput, '01/01/2001') // valid entry #2
  expect(dobInput).toBeValid()

  // user entry and validation of role input
  expect(roleInput).toBeInvalid()
  await user.type(roleInput, 'automated tester')
  expect(roleInput).toBeValid()

  // after all entries meet requirements, submit button should be enabled again
  expect(submitBtn).not.toBeDisabled()

  await user.click(submitBtn)

  const newLengthOfEmployeeRecords = dbEmployeeData.length + 1

  await waitFor(async () => {
    expect(await screen.findAllByTestId(/table-body-row/i)).toHaveLength(
      newLengthOfEmployeeRecords
    )
  })
  // we expect that the new employee record is added to the end of the table
  expect(
    (await screen.findAllByTestId(/table-body-row/i))[
      newLengthOfEmployeeRecords - 1
    ]
  ).toHaveTextContent(userFullName)
  // we now expect that the form is no longer present on the page
  expect(screen.queryByRole('form')).not.toBeInTheDocument()
})

test('should allow users to delete a employee record', async () => {
  const user = userEvent.setup()
  render(<App />)
  const employeeTableRows = await screen.findAllByTestId(/table-body-row/i)
  // we will delete the first employee record
  const deleteEmployeeBtn = within(employeeTableRows[0]).getByLabelText(
    /delete/i
  )
  // assert that the first record in the table is the first employee record in the database
  const firstEmployeeRecordCells = within(employeeTableRows[0]).getAllByRole(
    'cell'
  )
  expect(firstEmployeeRecordCells[0]).toHaveTextContent(
    dbEmployeeData[0].fullName
  )
  // delete this record
  await user.click(deleteEmployeeBtn)
  await waitFor(() => {
    // we now expect that the employee record is no longer present in the table
    expect(
      screen.queryByRole('cell', { name: dbEmployeeData[0].fullName })
    ).not.toBeInTheDocument()
  })
  expect(await screen.findAllByTestId(/table-body-row/i)).toHaveLength(4)
})

test('should allow users to edit an employee record', async () => {
  const user = userEvent.setup()
  render(<App />)
  const employeeTableRows = await screen.findAllByTestId(/table-body-row/i)
  // we will delete the first employee record
  const editEmployeeBtn = within(employeeTableRows[0]).getByLabelText(/edit/i)
  // assert that the first record in the table is the first employee record in the database
  const firstEmployeeRecordCells = within(employeeTableRows[0]).getAllByRole(
    'cell'
  )
  expect(firstEmployeeRecordCells[0]).toHaveTextContent(
    dbEmployeeData[0].fullName
  )
  // delete this record
  await user.click(editEmployeeBtn)
  // we now expect that the edit employee form is rendered
  expect(screen.getByRole('form')).toBeInTheDocument()

  /**
   * submit button is disabled at first - we need the user to have changed one of the values
   * in the form before we enable the button - doesn't make sense for them to be able to submit
   * the form with no edits
   */
  const submitBtn = screen.getByLabelText('submit form')
  expect(submitBtn).toBeDisabled()

  const roleInput = screen.getByLabelText(/role/i)

  expect(roleInput).toHaveValue(dbEmployeeData[0].role)
  await user.clear(roleInput)
  expect(submitBtn).toBeDisabled()
  const updatedEmployeeRole = 'test test test'
  await user.type(roleInput, updatedEmployeeRole)
  expect(submitBtn).not.toBeDisabled()

  await user.click(submitBtn)

  await waitFor(() => {
    // we now expect that the employee record has been updated in the table
    expect(
      screen.getByRole('cell', { name: updatedEmployeeRole })
    ).toBeInTheDocument()
  })

  const employeeTableRowsUpdated = await screen.findAllByTestId(
    /table-body-row/i
  )
  // the first row should still be the same employee record - we will determine this by full name
  const firstEmployeeRecordUpdatedCells = within(
    employeeTableRowsUpdated[0]
  ).getAllByRole('cell')
  expect(firstEmployeeRecordUpdatedCells[0]).toHaveTextContent(
    dbEmployeeData[0].fullName
  )
  // but the role has just been updated, so we expect that the updates are present
  expect(firstEmployeeRecordUpdatedCells[2]).toHaveTextContent(
    updatedEmployeeRole
  )

  expect(screen.queryByRole('form')).not.toBeInTheDocument()
})
