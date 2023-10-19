import {
    Tabs,
    TabScreen,
    useTabIndex,
    useTabNavigation,
    TabsProvider,
  } from 'react-native-paper-tabs';
import { View } from 'react-native';
import GuiaIngreso from '../components/GuiaIngreso';
import Pesaje from '../components/Pesaje';

const TabsSection = ({navigation, ticketId}:any) => {
    return <TabsProvider
            defaultIndex={0}
            // onChangeIndex={handleChangeIndex} optional
        >
        <Tabs
            tabLabelStyle={{ fontSize: 11 }} // optional
            iconPosition="top" // leading, top | default=leading
            style={{ backgroundColor:'#fff' }} // works the same as AppBar in react-native-paper
            showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
            // uppercase={false} // true/false | default=true (on material v2) | labels are uppercase
            // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
            // dark={false} // works the same as AppBar in react-native-paper
            // theme={} // works the same as AppBar in react-native-paper
            // mode="scrollable" // fixed, scrollable | default=fixed
            // disableSwipe={false} // (default=false) disable swipe to left/right gestures
        >
            <TabScreen label="Guías I." icon="newspaper">
                <GuiaIngreso ticketId={ticketId} navigation={navigation} />
            </TabScreen>
            <TabScreen label="Pesaje" icon="swap-vertical-circle">
                <Pesaje ticketId={ticketId} navigation={navigation} />
            </TabScreen>
            <TabScreen label="Sacos recib." icon="swap-vertical-circle">
                <View style={{ backgroundColor: 'black', flex:1 }} />
            </TabScreen>
            <TabScreen
                label="Resúmen"
                icon="newspaper"
                // optional props
                // badge={true} // only show indicator
                // badge="text"
                // badge={1}
                // onPressIn={() => {
                //   console.log('onPressIn explore');
                // }}
                // onPress={() => {
                //   console.log('onPress explore');
                // }}
            >
                <View style={{ backgroundColor: 'red', flex:1 }} />
            </TabScreen>
        </Tabs>
    </TabsProvider>
}

export default TabsSection;