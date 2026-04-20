import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Task 5: Accessibility - Global Dynamic Type configuration
// Ensures all text scales for visually impaired users without breaking UX bounds
interface TextWithDefaultProps extends Function {
  defaultProps?: { allowFontScaling?: boolean; maxFontSizeMultiplier?: number };
}

((Text as unknown) as TextWithDefaultProps).defaultProps = {
  ...((Text as unknown) as TextWithDefaultProps).defaultProps,
  allowFontScaling: true,
  maxFontSizeMultiplier: 2.0,
};

((TextInput as unknown) as TextWithDefaultProps).defaultProps = {
  ...((TextInput as unknown) as TextWithDefaultProps).defaultProps,
  allowFontScaling: true,
  maxFontSizeMultiplier: 2.0,
};

export default function App() {
  useEffect(() => {
    // Task 6: Attempt to start performance tracing on app load
    try {
      const perf = require('@react-native-firebase/perf').default;
      perf().setPerformanceCollectionEnabled(true);
    } catch(e) {}
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
