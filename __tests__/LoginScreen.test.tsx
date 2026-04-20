import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

// Mock the Firebase interactions and React Navigation
jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/config/firebaseConfig', () => ({
  auth: {},
  app: {}
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() })
}));

describe('LoginScreen UI and Logic Validation', () => {
  it('renders the branding title accurately', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('FanFlow')).toBeTruthy();
  });

  it('triggers anonymous authorization via button click', async () => {
    const { getByTestId, queryByTestId } = render(<LoginScreen />);
    
    const enterButton = getByTestId('enter-venue-button');
    expect(enterButton).toBeTruthy();
    
    // Validate state switch
    fireEvent.press(enterButton);
    
    // Ensure loading spinner surfaces
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
