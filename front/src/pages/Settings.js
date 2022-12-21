import { Badge, Button, Flex, Grid, LoadingOverlay, Paper, PasswordInput, Stack, Title } from "@mantine/core";
import { useRef, useState } from "react";

function Settings(props) {
    const oldPassword = useRef('');
    const newPassword = useRef('');
    const [changedPass, setChangedPass] = useState({
        changed: false,
        status: null,
        message: "",
        isChanging: false
    })
    const handleChangePass = async (e) => {
        e.preventDefault();
        setChangedPass(e => {return {...e, isChanging: true}})
        const formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("oldpass", oldPassword.current.value);
        formData.append("newpass", newPassword.current.value);
        const res = await fetch("/changepass", {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setChangedPass({
            changed: true,
            ...data,
            isChanging: false
        })
    }
    return (
        <Grid>
            <Grid.Col span={4}>
                <Paper shadow="xs" p="md" withBorder>
                    {changedPass.isChanging ? <LoadingOverlay overlayBlur={2} /> : 
                    <>
                        <Title mb="xs" order={3}>Change Password</Title>
                        <form onSubmit={handleChangePass}>
                            <Stack>
                                <PasswordInput
                                    ref={oldPassword}
                                    required
                                    label="Old password"
                                    error={changedPass.status === "error"}
                                    placeholder="Type here"
                                />

                                <PasswordInput
                                    ref={newPassword}
                                    required
                                    label="New password"
                                    error={changedPass.status === "error"}
                                    placeholder="Type here"
                                />
                            </Stack>

                            <Flex
                                mt="xl"
                                direction="column"
                                gap="sm"
                            >
                                {changedPass.changed ? <Badge color={changedPass.status === "error" ? "red" : "green"}>{changedPass.message}</Badge> : ''}
                                <Button type="submit">Change</Button>
                            </Flex>
                        </form>
                    </>
                    }
                </Paper>
            </Grid.Col>
        </Grid>
    );
}

export default Settings;
