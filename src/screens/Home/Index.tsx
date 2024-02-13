import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native';
import List from './List';

const Tab = createMaterialBottomTabNavigator();

const Index = () => {
  return (
    <Tab.Navigator
        barStyle={{ backgroundColor: 'white' }}
        labeled={true}
        activeColor='orange'
        inactiveColor='gray'
    >
        <Tab.Screen name="ingresos.index" component={List}
            options={{
                tabBarLabel: 'Ingresos',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="login" color={color} size={26} />
                ),
            }}
        />
        {/* <Tab.Screen name="proceso_mp.index" component={ProcesoMPScreen}
            options={{
                tabBarLabel: 'ProcesoMP',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="open-in-new" color={color} size={26} />
                ),
            }}
        /> */}
        <Tab.Screen name="exportacion.index"
            options={{
                tabBarLabel: 'Exportación',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="logout" color={color} size={26} />
                ),
            }}
        >
             {props => <List type={'exportacion'} {...props}/> }
        </Tab.Screen>
    </Tab.Navigator>
  );
}

export default Index;