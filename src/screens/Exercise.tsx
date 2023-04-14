import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { VStack, Text, Icon, HStack, Heading, Image, Box } from "native-base";
import { Feather } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native";

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";

export function Exercise() {
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleGoBack(){
        navigation.goBack()
    }
    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name="arrow-left" color="green.500" size={6}/>
                </TouchableOpacity>
                <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center" >
                    <Heading color="gray.100" fontSize="lg" flexShrink={1}>
                        Puxada frontal
                        lorem
                    </Heading>
                    <HStack alignItems="center">
                        <BodySvg/>
                        <Text  color="gray.200" ml={1} textTransform="capitalize">
                            Costas
                        </Text>

                    </HStack>
                </HStack>
            </VStack>
            <VStack p={8}> 
                <Image
                    w="full"
                    h={80}
                    source={{ uri: 'https://files.passeidireto.com/7dceacb9-8013-4e9c-b30b-dd174f2e525d/7dceacb9-8013-4e9c-b30b-dd174f2e525d.jpeg'}}
                    alt="Pessoa fazendo exercício de remada unilateral"
                    mb={3}
                    resizeMode="cover"
                    rounded="lg"
                />
                <Box bg="gray.600" rounded="md" pb={4} px={4}>
                    <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                        <HStack>
                            <SeriesSvg/>
                            <Text color="gray.200" ml="2">
                                3 séries
                            </Text>
                        </HStack>
                        <HStack>
                            <RepetitionSvg/>
                            <Text color="gray.200" ml="2">
                                12 repetiçes
                            </Text>
                        </HStack>
                    </HStack>
                    <Button
                        title="Marcar como realizado"
                    />

                </Box>
            </VStack>
        </VStack>
    )

}