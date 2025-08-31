import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="m-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Something went wrong. Please refresh.
        </div>
      )
    }
    return this.props.children
  }
}
