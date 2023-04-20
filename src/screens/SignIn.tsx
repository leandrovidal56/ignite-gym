import {VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'
import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useForm, Controller} from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormData = {
    email: string
    password: string
}

export function SignIn(){
    const [ isLoading, setIsLoading] = useState(false)
    const { signIn } = useAuth();
    const { control, handleSubmit, formState: {errors} } = useForm<FormData>();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const toast = useToast()

    function handleNewAccount(){
        navigation.navigate('signUp')
    }

    async function handleSignIn({ email, password}: FormData){
        try {
            setIsLoading(true)
            await signIn(email, password)
        }catch(error){
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
            setIsLoading(false)
            toast.show({ 
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
            <Image
                source={BackgroundImg}
                defaultSource={BackgroundImg}
                alt="Pessoas treinando na academia"
                resizeMode='contain'
                position="absolute"
            />
            <Center my={24}>
                <LogoSvg/>
                <Text color="gray.100" fontSize="sm" >
                    Treine sua mente e o seu corpo
                </Text>
            </Center>
            <Center>
                <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                    Acesse sua conta
                </Heading>
                <Controller
                    control={control}
                    name="email"
                    rules={{ required: "informe o email"}}
                    render={({ field: {onChange}}) => (
                        <Input 
                            placeholder='E-mail'
                            keyboardType='email-address'
                            onChangeText={onChange}
                            errorMessage={errors.email?.message}
                            autoCapitalize='none'
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: "informe a senha"}}
                    render={({ field: {onChange}}) => (
                        <Input 
                            placeholder='Senha'
                            onChangeText={onChange}
                            errorMessage={errors.email?.message}
                            secureTextEntry
                        />
                    )}
                />
                <Button 
                    onPress={handleSubmit(handleSignIn)} 
                    title="Acessar"
                    isLoading={isLoading}
                />
            </Center>
            <Center mt={24}>
                <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body" >
                    Ainda não tem acesso? 
                </Text>
                <Button 
                    title="Criar conta" 
                    variant="outline"
                    onPress={handleNewAccount}
                />
            </Center>
        </VStack>
        </ScrollView>

    )
}