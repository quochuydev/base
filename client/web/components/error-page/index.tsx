import React from 'react';
import { Text, Flex, Heading, Box, Image, Divider, Link } from '@chakra-ui/core';
import { rem } from 'polished';
import { useSelector } from 'react-redux';
import { RootState } from '@blog/client/redux/store';

interface Props {
    statusCode: number;
}

const Error = (props: Props) => {
    const { statusCode } = props;
    const appConfig = useSelector((state: RootState) => state.app.config);

    return (
        <Flex
            backgroundColor="theme.errorPage.bg"
            height="calc(100vh - 50px)"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            fontSize={rem(16)}
            color="rgba(0, 0, 0, 0.65)"
            lineHeight={1.5}
        >
            <Box>
                <Flex alignItems="center">
                    <Box mt={3}>
                        <Image mr={3} src={appConfig.siteLogo} size="80px"></Image>
                    </Box>
                    {statusCode >= 400 && statusCode < 500 ? (
                        <Box maxW="450px">
                            <Heading as="h3" fontSize={rem(24)} fontWeight={500} my={2}>
                                h3
                            </Heading>
                            <Link href="/" color="#1890ff">
                                home
                            </Link>
                        </Box>
                    ) : (
                        <Box maxW="450px">
                            <Heading as="h3" fontSize={rem(24)} fontWeight={500} mb={2}>
                                h3
                            </Heading>
                        </Box>
                    )}
                </Flex>
                <Divider width="100%"></Divider>
            </Box>
        </Flex>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
