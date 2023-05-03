import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTo";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Center, Heading, SectionList, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";

export function History() {
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast();
    const [ exercises, setExercises ] = useState<HistoryByDayDTO[]>([
   
    ]);
    async function fetchHistory(){
        console.log('passou por aqui000')
        try{
            setIsLoading(true)
            const response = await api.get('/history');
            setExercises(response.data)

        }catch(error){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'
            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally{
            console.log('passou por aqui3')
            return setIsLoading(false)
        }
    }
    useFocusEffect(useCallback(() => {
        fetchHistory()
    },[]))

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />
                <SectionList
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HistoryCard data={item} />
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há exercícios registrados ainda. {'\n'}
                        Vamos fazer exercícios hoje? 
                    </Text>
                )}
                showsHorizontalScrollIndicator={ false}
            />
        </VStack>
    )
}