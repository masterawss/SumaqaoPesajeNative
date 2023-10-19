import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import IngresoScreen from '../Ingreso/Index';
import ExportacionScreen from '../Exportacion/Index';
import ProcesoMPScreen from '../ProcesoMP/Index';

const Tab = createMaterialBottomTabNavigator();

const Index = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="ingresos.index" component={IngresoScreen}
            options={{
                tabBarLabel: 'Ingresos',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="login" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen name="proceso_mp.index" component={ExportacionScreen}
            options={{
                tabBarLabel: 'ProcesoMP',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="open-in-new" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen name="exportacion.index" component={ProcesoMPScreen}
            options={{
                tabBarLabel: 'Exportación',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="logout" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>
  );
}

export default Index;