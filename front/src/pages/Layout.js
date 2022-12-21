import { ActionIcon, AppShell, NavLink, Flex, Header, LoadingOverlay, Navbar, Title, Tooltip } from "@mantine/core";
import { IconChevronRight, IconDoorExit, IconHome, IconSettings, IconVip } from "@tabler/icons";
import {useLayoutEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

function Layout(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState({
        access: 0,
        admin: 0
    })
    const [pathname, setPathname] = useState("/");
    const location = useLocation();
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("token", token);
            const res = await fetch('/getuser', {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            if(data.status === "error"){
                navigate('/logout');
            } else {
                props.setGlobalUser(data.data);
                setUser(data.data);
                setIsLoaded(true);
            }
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setPathname(location.pathname);
            fetchData();
        }
    }, [location]);
    return (
        <>
            {isLoaded ? 
                <AppShell
                    padding="md"
                    header={<Header height={60} p="xs">
                        <Flex px="md" align="center" direction="row" justify="space-between">
                            <Title order={2} color="white">STRESSER</Title>
                            <Link to="/logout">
                                <Tooltip label="logout">
                                    <ActionIcon variant="filled"><IconDoorExit size={16} /></ActionIcon>
                                </Tooltip>
                            </Link>
                        </Flex>
                    </Header>}
                    navbar={
                        <Navbar width={{ base: 300 }} height="100%" p="xs">
                            {user?.access ? <Link to="/"><NavLink
                                label="Stresser"
                                icon={<IconHome size={16} stroke={1.5} />}
                                active={pathname === "/"}
                                rightSection={<IconChevronRight size={12} stroke={1.5} />}
                            /></Link> : ''}
                            <Link to="/settings"><NavLink
                                label="Settings"
                                icon={<IconSettings size={16} stroke={1.5} />}
                                active={pathname === "/settings"}
                                rightSection={<IconChevronRight size={12} stroke={1.5} />}
                            /></Link>
                            {user?.admin ? <Link to="/admin"><NavLink
                                label="Admin panel"
                                icon={<IconVip size={16} stroke={1.5} />}
                                active={pathname === "/admin"}
                                rightSection={<IconChevronRight size={12} stroke={1.5} />}
                            /></Link> : ''}
                        </Navbar>
                    }
                    styles={(theme) => ({
                        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                    })}
                >
                    <Outlet />
                </AppShell>
            :
                <LoadingOverlay overlayBlur={2} />
            }
        </>
    );
}

export default Layout;
