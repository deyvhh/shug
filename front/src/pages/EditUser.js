import { Button, Checkbox, Flex, Grid, LoadingOverlay, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditUser(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: null,
        access: 0,
        admin: 0
    })
    const [editingUser, setEditingUser] = useState({
        access: 0,
        admin: 0
    });
    let { id } = useParams();
    const handleEditUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("userid", id);
        formData.append("access", access.current.checked);
        formData.append("admin", admin.current.checked);
        await fetch('/edituser', {
            method: "POST",
            body: formData
        })
        navigate('/admin')
    }
    const access = useRef(null);
    const admin = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"));
            formData.append("userid", id);
            const res = await fetch('/getuserbyid', {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            setEditingUser(data.user)
        }
        setUser(props.user)
        if(!props.user.admin){
            navigate("/");
        }
        fetchData();
    }, []);
    return (<>
        {user.admin && editingUser.email ?
            <Grid>
                 <Grid.Col span={12}>
                        <Paper shadow="xs" p="md" withBorder>
                            <>
                                <Title mb="xs" order={3}>Edit user</Title>
                                <form onSubmit={handleEditUser}>
                                    <Stack>
                                        <TextInput
                                            disabled
                                            value={editingUser.email}
                                            label="EMAIL"
                                        />
                                        <Checkbox
                                            defaultChecked={editingUser.access}
                                            ref={access}
                                            label="ACCESS"
                                        />
                                        <Checkbox
                                            defaultChecked={editingUser.admin}
                                            ref={admin}
                                            label="ADMIN"
                                        />
                                    </Stack>
        
                                    <Flex
                                        mt="xl"
                                        direction="column"
                                        gap="sm"
                                    >
                                        <Button type="submit">Save</Button>
                                    </Flex>
                                </form>
                            </>
                        </Paper>
                    </Grid.Col>
            </Grid>
        :
            <LoadingOverlay overlayBlur={2} />
        }
        </>
    );
}

export default EditUser;
