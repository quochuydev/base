import React, { useEffect, useState } from 'react';
import data from './data';
import GithubPinnedList from './github-pinned-list';
import Head from 'next/head';
import AppLayout from '@blog/client/web/layouts/app';
import { useSelector } from 'react-redux';
import { RootState } from '@blog/client/redux/store';
import { Box, Flex, List, ListItem, Image, Heading, Text } from '@chakra-ui/core';
import Icon from '../icon';
import HelperListItem from './helper-list-item';
import * as api from '@blog/client/web/api/article';
import PersonCommit from './person-commit';

export default () => {
    const config = useSelector((state: RootState) => state.app.config);
    const [userCommits, setUserCommits] = useState([]);
    useEffect(() => {
        api.fetchArticlesAggregationMapDate().then((res) => {
            setUserCommits(res);
        });
    }, [1]);
    let totalCountInYear = 0;
    const values = userCommits.map((item) => {
        totalCountInYear = totalCountInYear + item.articles.length;
        return {
            date: item._id,
            count: item.articles.length,
        };
    });
    return (
        <AppLayout>
            <Head>
                <title>{config.siteTitle}</title>
            </Head>
            <Flex fontSize={14} position="relative">
                <Box height="100%" color="theme.white" mr={[0, '240px']} position="relative" zIndex={100}>
                    <Box py={2} maxW="100%" margin="0 auto" pb={5}>
                        <List>
                            <ListItem mb={3}>
                                <Flex>
                                    <Image
                                        border="1px solid #ccc"
                                        borderRadius="50%"
                                        p="1px"
                                        src={require('@blog/client/assets/images/avatar.jpg')}
                                        alt="avatar"
                                        size="24px"
                                        mr={2}
                                    />
                                    <Heading as="h2" fontSize={20}>
                                        Jason Li
                                        <Text as="span" fontSize="13px" fontWeight="normal" ml={2}>
                                            Jason Li
                                        </Text>
                                    </Heading>
                                </Flex>
                            </ListItem>
                            <ListItem mb={3}>
                                <Icon name="place" fill="gray.500" mr={2} size="24px" />
                                Icon
                            </ListItem>
                            <ListItem mb={3}>
                                <Box width="20px" textAlign="center" display="inline-block" mr={2}>
                                    <Icon name="email" fill="gray.500" />
                                </Box>
                                Box
                            </ListItem>
                            <ListItem mb={3} display="flex">
                                <Box width="20px" textAlign="center" display="inline-block" mr={2}>
                                    <Icon name="tag" fill="gray.500" />
                                </Box>
                                Box
                            </ListItem>
                            <ListItem>
                                <Box width="20px" textAlign="center" display="inline-block" mr={2}>
                                    <Icon name="edit" color="gray.500" />
                                </Box>
                                coding
                            </ListItem>
                        </List>
                    </Box>
                </Box>
                <Box
                    position="absolute"
                    top="0"
                    right={['0', '-40px']}
                    bottom="0"
                    maxW="240px"
                    flex="1 0 auto"
                    fontSize={14}
                    height="auto"
                    backgroundSize="contain"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                    width="100%"
                    backgroundImage={`url(${require('@blog/client/assets/images/meihua.png')})`}
                ></Box>
            </Flex>
            <PersonCommit values={values} totalCountInYear={totalCountInYear}></PersonCommit>
            <Box mb={5} overflow="hidden" overflowX="auto" height="116.5px" mx={-3}>
                <Flex>
                    <Box
                        bg="theme.blackground"
                        p={5}
                        mx={3}
                        flex="1 0 auto"
                        textAlign="center"
                        borderRadius="sm"
                        animation="slideInUp .2s ease-in"
                    >
                        <Image
                            margin="0 auto"
                            size={10}
                            src={require('@blog/client/assets/images/telescope.png')}
                        ></Image>
                        <Text mt={2} color="theme.primaryText" fontSize={16}>
                            telescope
                        </Text>
                    </Box>
                    <Box
                        bg="theme.blackground"
                        p={5}
                        mx={3}
                        textAlign="center"
                        borderRadius="sm"
                        flex="1 0 auto"
                        animation="slideInUp .3s ease-in"
                    >
                        <Image margin="0 auto" size={10} src={require('@blog/client/assets/images/psd.png')}></Image>
                        <Text mt={2} color="theme.primaryText" fontSize={16}>
                            psd
                        </Text>
                    </Box>
                    <Box
                        bg="theme.blackground"
                        p={5}
                        mx={3}
                        textAlign="center"
                        borderRadius="sm"
                        flex="1 0 auto"
                        animation="slideInUp .4s ease-in"
                    >
                        <Image margin="0 auto" size={10} src={require('@blog/client/assets/images/pc.png')}></Image>
                        <Text mt={2} color="theme.primaryText" fontSize={16}>
                            pc
                        </Text>
                    </Box>
                    <Box
                        bg="theme.blackground"
                        p={5}
                        mx={3}
                        textAlign="center"
                        borderRadius="sm"
                        flex="1 0 auto"
                        animation="slideInUp .5s ease-in"
                    >
                        <Image margin="0 auto" size={10} src={require('@blog/client/assets/images/app.png')}></Image>
                        <Text mt={2} color="theme.primaryText" fontSize={16}>
                            app
                        </Text>
                    </Box>
                    <Box
                        bg="theme.blackground"
                        p={5}
                        mx={3}
                        flex="1 0 auto"
                        textAlign="center"
                        borderRadius="sm"
                        animation="slideInUp .6s ease-in"
                    >
                        <Image
                            margin="0 auto"
                            size={10}
                            src={require('@blog/client/assets/images/mini-program-fill.png')}
                        ></Image>
                        <Text mt={2} color="theme.primaryText" fontSize={16}>
                            program
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <GithubPinnedList userRepos={data.userRepos}></GithubPinnedList>
            <Box p={5}>
                <Text textAlign="center" mb={5}>
                    <Icon name="info" mr={2}></Icon>info
                </Text>
                {data.issues.map((issue) => {
                    return <HelperListItem key={issue._id} issue={issue}></HelperListItem>;
                })}
            </Box>
            <Flex justifyContent="center">
                <a href="#">
                    <img src={require('@blog/client/assets/banners/vultr_banner_728x90.png')} width="728" height="90" />
                </a>
            </Flex>
        </AppLayout>
    );
};
