import { LoadingOverlay } from "@mantine/core";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("token", token);
            await fetch("/logout", {
                method: "POST",
                body: formData
            })
            localStorage.removeItem("token");
            navigate('/login');
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, []);
    return (
        <LoadingOverlay overlayBlur={2} />
    );
}

export default Logout;
