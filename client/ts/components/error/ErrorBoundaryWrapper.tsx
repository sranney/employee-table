import { Component } from 'react'
import { ErrorDialog } from '../error/ErrorDialog'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type State = {
  error: Error | null
}

export class ErrorBoundaryWrapper extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error): State {
    return {
      error: error,
    }
  }
  closeDialog(): void {
    this.setState({ error: null })
  }
  render() {
    const { children } = this.props
    const { error } = this.state

    if (error) {
      return (
        <>
          {<ErrorDialog error={error} closeDialog={() => this.closeDialog()} />}
          {children}
        </>
      )
    } else {
      return <>{children}</>
    }
  }
}
