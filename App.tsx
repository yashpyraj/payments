import React, {useContext, createContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppContaner from './components/app-container';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Children = {
  children: React.ReactNode;
};
const Stack = createNativeStackNavigator();
export const AuthContext = createContext({});

const AuthUserProvider = ({children}: Children) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
function Home(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function WelcomeScreen(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
function RootNavigator(): JSX.Element {
  const {user, setUser} = useContext(AuthContext);
  function onAuthStateChanged(user) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return <AppContaner>{user ? <Home /> : <WelcomeScreen />}</AppContaner>;
}

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <AuthUserProvider>
      <RootNavigator />
    </AuthUserProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
