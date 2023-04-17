import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, ScrollView, VStack, Skeleton, Text, Heading,  useToast } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading ] = useState(false)
    const [userPhoto, setUserPhoto] = useState('http://github.com/leandrovidal56.png');

    const toast = useToast();

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true)
        try{

            const photoSelected =  await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,            
            });
            console.log(photoSelected, 'take photo')
            if(photoSelected.canceled){
                return
            }
            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri)
                
                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
                    return toast.show({
                        title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }
                setUserPhoto(photoSelected.assets[0].uri)
            }
        }catch(error){
            console.error(error)
        } finally{
            setPhotoIsLoading(false)
        }

    }

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
                        source={{uri: userPhoto}}
                        size={PHOTO_SIZE}
                        alt="Foto de perfil"
                    />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
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

                    <Heading color="gray.200" fontSize="md" mb={2} mt={12}  alignSelf="flex-start" fontFamily="heading">
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