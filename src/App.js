import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {changeLanguage, loadLanguage} from "./i18n";

export default function App() {
    const {t} = useTranslation();

    useEffect(() => {
        loadLanguage()
    }, []);


    const handleLanguageChange = (lang)=>{
        changeLanguage(lang);
    }

    return (
        <View style={styles.container}>
            <Text>{t('welcome')}</Text>
            <Button title={t('english')} onPress={()=>{handleLanguageChange('en')}}/>
            <Button title={t('ukrainian')} onPress={()=>{handleLanguageChange('uk')}}/>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
