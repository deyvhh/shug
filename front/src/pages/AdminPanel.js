import { ActionIcon, Button, Flex, Grid, Group, LoadingOverlay, Paper, PasswordInput, Stack, Table, TextInput, Title, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconHelp, IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminPanel(props) {
    const email = useRef('');
    const password = useRef('');
    const API = useRef('');
    const navigate = useNavigate();
    const [user, setUser] = useState({
        access: 0,
        admin: 0
    })
    const [users, setUsers] = useState([])
    const [addedUser, setAddedUser] = useState({
        added: false,
        status: null,
        message: "",
        isAdding: false
    })
    const handleAPIChange = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("api", API.current.value);
        await fetch("/changeapi", {
            method: "POST",
            body: formData
        })
        showNotification({
            title: 'Notification!',
            message: 'API has been changed!',
            color: "green"
        })
    }
    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddedUser(e => {return {...e, isAdding: true}})
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("email", email.current.value);
        formData.append("password", password.current.value);
        const res = await fetch("/adduser", {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setAddedUser({
            added: true,
            ...data,
            isAdding: false
        })
        setUsers(data.users)
        showNotification({
            title: 'Notification!',
            message: data.message,
            color: data.status === "error" ? "red" : "green"
        })
    }
    const handleRemoveUser = async id => {
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("userid", id);
        const res = await fetch("/removeuser", {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setUsers(data.users)
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
            const res = await fetch("/getalldata", {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            setUsers(data.data)
            API.current.value = data.link;
        }
        setUser(props.user)
        if(!props.user.admin){
            navigate("/");
        }
        fetchData();
    }, [])
    return (
        <>
            {user.admin ?
                <Grid>
                    <Grid.Col span={6}>
                        <Paper shadow="xs" p="md" withBorder>
                            {addedUser.isAdding ? <LoadingOverlay overlayBlur={2} /> : 
                            <>
                                <Title mb="xs" order={3}>Add user</Title>
                                <form onSubmit={handleAddUser}>
                                    <Stack>
                                        <TextInput
                                            ref={email}
                                            required
                                            label="Email"
                                            error={addedUser.status === "error"}
                                            placeholder="Type here"
                                        />
        
                                        <PasswordInput
                                            ref={password}
                                            required
                                            label="Password"
                                            error={addedUser.status === "error"}
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
                            }
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Paper sx={{
                        height: "100%"
                    }} shadow="xs" p="md" withBorder>
                                <Group>
                                <Title mb="xs" order={3}>Change API </Title><Tooltip label="Remember: {host} {port} {method} {time}"><ActionIcon variant="filled"><IconHelp  size={16}/></ActionIcon></Tooltip>
                                </Group>
                                <Link to="/methods"><Button variant="outline" mb="sm" mt="sm">Edit methods</Button></Link>
                                <form onSubmit={handleAPIChange}>
                                    <Stack>
                                        <TextInput
                                            ref={API}
                                            required
                                            label="API"
                                            placeholder="Type here"
                                        />
                                    </Stack>
        
                                    <Flex
                                        mt="xl"
                                        direction="column"
                                        gap="sm"
                                    >
                                        <Button type="submit">Change</Button>
                                    </Flex>
                                </form>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Paper shadow="xs" p="md" withBorder>
                            <Title mb="xs" order={3}>Users</Title>
                            <Table highlightOnHover>
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>E-MAIL</th>
                                    <th>PASSWORD</th>
                                    <th>IP</th>
                                    <th>ACCESS</th>
                                    <th>ADMIN</th>
                                    <th>OPERATIONS</th>
                                    </tr>
                                </thead>
                                <tbody>{users.map(user => {
                                    return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.password}</td>
                                        <td>{user.ip}</td>
                                        <td>{user.access}</td>
                                        <td>{user.admin}</td>
                                        <td>
                                            <Group>
                                            <Link to={`/edit/${user.id}`}><ActionIcon color="blue" variant="outline"><IconEdit size={16} /></ActionIcon></Link>
                                            <ActionIcon onClick={() => handleRemoveUser(user.id)} color="red" variant="outline"><IconX size={16} /></ActionIcon>
                                            </Group>
                                        </td>
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

export default AdminPanel;
