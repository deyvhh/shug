import {
    Button, Center, Flex, LoadingOverlay,
    Notification, Paper, PasswordInput, Stack, Text, TextInput
} from '@mantine/core';
import { IconX } from '@tabler/icons';
import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/login.css';

function Login() {
    const [isLoading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const email = useRef('');
    const password = useRef('');
    const location = useLocation();
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [location]);
    const handleLogIn = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email.current.value);
        formData.append('password', password.current.value);
        const res = await fetch('/login', {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        if(data.status === "error") {
            setLoginError(true);
        } else {
            setLoginError(false);
            localStorage.setItem('token', data.token)
            navigate('/');
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    return (
        <>
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            {!isLoading && <div className="login-container">
                <Paper radius="md" p="xl" withBorder>
                    <Center>
                        <Text size="lg" weight={500}>
                            Welcome
                        </Text>
                    </Center>

                    <form onSubmit={handleLogIn}>
                        <Stack>
                            <TextInput
                                ref={email}
                                required
                                error={loginError}
                                label="Email"
                                placeholder="hello@pure.human"
                            />

                            <PasswordInput
                                ref={password}
                                required
                                label="Password"
                                error={loginError}
                                placeholder="Your password"
                            />
                        </Stack>

                        <Flex
                            gap="md"
                            justify="center"
                            align="center"
                            direction="column"
                            mt="xl"
                            wrap="wrap"
                        >
                            {loginError && <Notification disallowClose  icon={<IconX size={16} />} color="red" radius="md" title="Account not found" />}
                            <Button type="submit">Log in</Button>
                        </Flex>
                    </form>
                </Paper>
            </div>}
        </>
    );
}

export default Login;
