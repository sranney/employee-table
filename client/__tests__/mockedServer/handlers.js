import { rest } from 'msw'
import employeeData from './dbEmployeeData.json'
import { v4 as uuid } from 'uuid'

export const handlers = [
  rest.get('/employees', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(employeeData))
  }),
  rest.post('/employees', async (req, res, ctx) => {
    const requestBody = await req.json()
    const id = uuid()
    const responseData = { ...requestBody, id }
    return res(ctx.status(200), ctx.json(responseData))
  }),
  rest.delete('/employees/:employeeId', async (req, res, ctx) => {
    const filteredEmployeeData = employeeData.filter(
      (employee) => employee.id !== req.params.employeeId
    )
    return res(ctx.status(200), ctx.json(filteredEmployeeData))
  }),
  rest.patch('/employees/:employeeId', async (req, res, ctx) => {
    const requestBody = await req.json()
    return res(
      ctx.status(200),
      ctx.json({ ...requestBody, id: employeeData[0].id })
    )
  }),
]
