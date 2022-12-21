import { Flex } from "@mantine/core";
import { IconError404 } from "@tabler/icons";

function NoPage() {
    return (
        <Flex sx={{
            width: "100%",
            height: "100%"
        }}
            justify="center"
            align="center"
        >
            <IconError404 color="white" size={150}></IconError404>
        </Flex>
    );
}

export default NoPage;
