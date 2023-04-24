import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, ScrollView, VStack, Skeleton, Text, Heading,  useToast } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from "@hooks/useAuth";
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere')
    .when('password', {
		is: (Field: any) => Field,
		then: (schema) =>
			schema.nullable().required('Informe a confirmação da senha.'),
    })
})

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading ] = useState(false)
    const [userPhoto, setUserPhoto] = useState('http://github.com/leandrovidal56.png');

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema)
    })

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
    async function handleProfileUpdate(data: FormDataProps){
        try{
            setIsUpdating(true)

            const userUpdated = user;
            userUpdated.name = data.name;

            await updateUserProfile(userUpdated)

            await api.put('/users', data)

            toast.show({
                title: 'Perfil atualizado com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });
        }catch(error){
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';

            toast.show({
                title: 'Perfil atualizado com sucesso',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false)
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
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: {onChange ,value}}) => (
                            <Input
                                bg="gray.600"
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: {value, onChange}}) => (
                                <Input
                                bg="gray.600"
                                placeholder="E-mail"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />

                    <Heading color="gray.200" fontSize="md" mb={2} mt={12}  alignSelf="flex-start" fontFamily="heading">
                        Alterar senha
                    </Heading>
                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { onChange}}) => (
                            <Input
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                isDisabled
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange}}) => (
                            <Input
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                isDisabled
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange}}) => (
                            <Input
                                bg="gray.600"
                                placeholder="Confirmar senha"
                                secureTextEntry
                                isDisabled
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    />
        
                    <Button
                        title="Atualizar"
                        mt={4}
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                        />
                    </Center>
            </ScrollView>
        </VStack>
    )

}