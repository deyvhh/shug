import { Button, Card, Center, Flex, Group, NumberInput, Select, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        access: 0,
        admin: 0
    })
    const [methods, setMethods] = useState([])
    const host = useRef(null);
    const port = useRef(null);
    const time = useRef(null);
    const method = useRef(null);
    const handleAttack = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("host", host.current.value);
        formData.append("port", port.current.value);
        formData.append("time", time.current.value);
        formData.append("method", method.current.value);
        const res = await fetch('/sendAttack', {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        showNotification({
            title: 'Notification!',
            message: data.message,
            color: data.status === "error" ? "red" : "green"
        })
    }
    useEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"));
            const res = await fetch('/getmethods', {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            setMethods(data.methods.map(method => {
                return {
                    value: method.displayMethod,
                    label: method.displayMethod,
                    group: method.category
                }
            }))
        }
        setUser(props.user)
        if(!props.user.access){
            navigate("/settings");
        }
        fetchData();
    }, [])
    return (
        <Flex sx={{
            height: "100%",
            width: "100%"
        }}
            align="center"
            justify="center"
        >
            <Card p="xl" withBorder>
                <form onSubmit={handleAttack}>
                <Center mt="xl" mb="xl"><Title order={2}>STRESSER</Title></Center>
                <Group mt="xl">
                    <TextInput ref={host} required label="HOST"></TextInput>
                    <NumberInput min={1} required ref={port} max={100000} label="PORT"></NumberInput>
                </Group>
                <NumberInput min={1} required ref={time} max={1800} label="TIME"></NumberInput>
                <Select
                    label="METHOD"
                    ref={method}
                    required
                    placeholder="Choose"
                    data={methods}
                    />
                <Center mb="xl" mt="md">
                    <Button type="submit" variant="outline">ATTACK</Button>
                </Center>
                </form>
            </Card>
        </Flex>
    );
}

export default Home;
