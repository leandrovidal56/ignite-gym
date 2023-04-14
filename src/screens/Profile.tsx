import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, ScrollView, VStack, Skeleton, Text, Heading } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading ] = useState(true)

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>
            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                   {
                    photoIsLoading ? 
                    <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded="full"/>
                    :
                    <UserPhoto
                        source={{uri: 'http://github.com/leandrovidal56.png'}}
                        size={PHOTO_SIZE}
                        alt="Foto de perfil"
                    />
                    }
                    <TouchableOpacity>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8} >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    <Input
                        bg="gray.600"
                        placeholder="Nome"
                    />
                    <Input
                        bg="gray.600"
                        placeholder="E-mail"
                        isDisabled
                    />

                    <Heading color="gray.200" fontSize="md" mb={2} mt={12}  alignSelf="flex-start">
                        Alterar senha
                    </Heading>
                    <Input
                        bg="gray.600"
                        placeholder="Senha antiga"
                        secureTextEntry
                        />

                    <Input
                        bg="gray.600"
                        placeholder="Nova senha"
                        secureTextEntry
                        />

                    <Input
                        bg="gray.600"
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                        />
                    <Button
                        title="Atualizar"
                        mt={4}
                        />
                        </Center>
                {/* </VStack> */}
            </ScrollView>
        </VStack>
    )

}