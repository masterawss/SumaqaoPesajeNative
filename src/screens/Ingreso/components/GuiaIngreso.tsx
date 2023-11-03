import { Button, Text } from "react-native-paper"
import { useCallback, useMemo, useRef, useState } from "react";
import {View, StyleSheet} from 'react-native';
import SimpleCard from "../../GuiaIngreso/components/SimpleCard";

const GuiaIngreso = ({navigation, ticketId}: any) => {
    const [open, setOpen] = useState(false);
    const [guiaIngresos, setGuiaIngresos] = useState<any[]>([{id:1}, {id:2}, {id:3}]);

    return <>
        <View style={{ padding: 10 }}>
            {
                guiaIngresos.map((item, index) => <SimpleCard key={index} guiaIngreso={item} />)
            }
        </View>

        <Button style={{ position: 'absolute', bottom:0, right:0, margin: 10 }} mode="contained"
            onPress={() => navigation.navigate('guia_ingreso.search')}
        >
            Agregar guía ingreso
        </Button>

    </>
}


const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   padding: 24,
    //   backgroundColor: 'grey',
    // },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });
  

export default GuiaIngreso;