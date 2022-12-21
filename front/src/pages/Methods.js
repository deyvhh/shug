import { ActionIcon, Button, Flex, Grid, LoadingOverlay, NumberInput, Paper, Stack, Table, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Methods(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        access: 0,
        admin: 0
    })
    const [methods, setMethods] = useState([])
    const handleAddMethod = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("namemethod", method.current.value);
        formData.append("apimethod", sendMethod.current.value);
        formData.append("time", maxTime.current.value);
        formData.append("category", category.current.value);
        const res = await fetch('/addmethod', {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setMethods(data.methods)
        showNotification({
            title: 'Notification!',
            message: 'Method added!',
            color: "green"
        })
    }
    const handleRemoveMethod = async (id) => {
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("methodid", id);
        const res = await fetch('/removemethod', {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setMethods(data.methods)
        showNotification({
            title: 'Notification!',
            message: 'Method removed!',
            color: "green"
        })
    }
    const method = useRef('')
    const sendMethod = useRef('')
    const maxTime = useRef(0)
    const category = useRef('')
    useEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"));
            const res = await fetch('/getmethods', {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            setMethods(data.methods)
        }
        setUser(props.user)
        if(!props.user.admin){
            navigate("/");
        }
        fetchData();
    }, []);
    return (<>
        {user.admin ?
            <Grid>
                 <Grid.Col span={4}>
                        <Paper shadow="xs" p="md" withBorder>
                            <>
                                <Title mb="xs" order={3}>Add method</Title>
                                <form onSubmit={handleAddMethod}>
                                    <Stack>
                                        <TextInput
                                            ref={method}
                                            required
                                            label="METHOD LABEL"
                                            placeholder="Type here"
                                        />
        
                                        <TextInput
                                            ref={sendMethod}
                                            required
                                            label="METHOD API LABEL"
                                            placeholder="Type here"
                                        />

                                        <NumberInput
                                            ref={maxTime}
                                            required
                                            label="MAX TIME"
                                            placeholder="Type here"
                                        />

                                        <TextInput
                                            ref={category}
                                            required
                                            label="GROUP"
                                            placeholder="Type here"
                                        />
                                    </Stack>
        
                                    <Flex
                                        mt="xl"
                                        direction="column"
                                        gap="sm"
                                    >
                                        <Button type="submit">Add</Button>
                                    </Flex>
                                </form>
                            </>
                        </Paper>
                    </Grid.Col>
                <Grid.Col span={8}>
                    <Paper shadow="xs" p="md" withBorder>
                        <Title mb="xs" order={3}>Methods</Title>
                        <Table highlightOnHover>
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>LABEL</th>
                                <th>API LABEL</th>
                                <th>TIME</th>
                                <th>GROUP</th>
                                <th>OPERATIONS</th>
                                </tr>
                            </thead>
                            <tbody>{methods.map(method => {
                                return (
                                <tr key={method.id}>
                                    <td>{method.id}</td>
                                    <td>{method.displayMethod}</td>
                                    <td>{method.sendMethod}</td>
                                    <td>{method.maxTime}</td>
                                    <td>{method.category}</td>
                                    <td><ActionIcon onClick={() => handleRemoveMethod(method.id)} variant="outline" color="red"><IconX size={16}/></ActionIcon></td>
                              </tr>);
                            })}</tbody>
                        </Table>
                    </Paper>
                </Grid.Col>
            </Grid>
        :
            <LoadingOverlay overlayBlur={2} />
        }
        </>
    );
}

export default Methods;
