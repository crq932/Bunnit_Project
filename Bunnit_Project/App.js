import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

import Calendar from './calander/Calendar';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
    </View>
  );
}

function CalendarScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Calendar/>
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Library</Text>
    </View>
  );
}

function MyPageScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>My Page</Text>
    </View>
  );
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HOME" component={HomeScreen} options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="CALENDAR" component={CalendarScreen} options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="tablet" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="LIBRARY" component={LibraryScreen} options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="book" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="MY PAGE" component={MyPageScreen} options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="circle" color={color} size={size} />
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}