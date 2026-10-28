import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { restoreSession } from './auth';
import { API_BASE_URL } from './config/env';
import { RootNavigator } from './navigation';
import { setBaseUrl } from './services/api/apiClient';

setBaseUrl(API_BASE_URL);

function App() {
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
