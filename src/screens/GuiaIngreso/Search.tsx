import { Appbar, Text, Searchbar } from "react-native-paper"
import { SafeAreaView, View } from "react-native"
import React from "react";
import SimpleCard from "../../components/Ticket/SimpleCard";
const Search = ({navigation}:any) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query: any) => setSearchQuery(query);

    return (
        <SafeAreaView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title="Buscar guía de ingreso" />
            </Appbar.Header>
            <View style={{ padding: 10 }}>
                <View style={{ marginBottom: 10 }}>
                    <SimpleCard />
                </View>

                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
            </View>
        </SafeAreaView>

    )
}

export default Search