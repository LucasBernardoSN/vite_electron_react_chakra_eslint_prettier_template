import { render } from '@testing-library/react';

import { App } from '../App';

describe('App Component', () => {
  it('must show welcome greeting', () => {
    const { getByText } = render(<App />);
    expect(getByText('Hello Electron!')).toBeInTheDocument();
  });
});
