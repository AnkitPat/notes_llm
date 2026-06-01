import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

test('sample test', () => {
  render(<div>Hello World</div>)
  expect(screen.getByText('Hello World')).toBeInTheDocument()
})
