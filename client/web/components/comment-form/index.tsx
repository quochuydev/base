import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Avatar,
    Text,
    Textarea,
    Flex,
    Alert,
    AlertIcon,
    Button,
    CloseButton,
    Collapse,
    Tooltip,
    IconButton,
} from '@chakra-ui/core';
import isLength from 'validator/lib/isLength';
import { Box, ButtonGroup } from '@chakra-ui/core';
import { v4 as uuidv4 } from 'uuid';
import Emoji from './emoji';
import { debounce } from 'lodash';
import { USER_COMMENT_INFO_KEY } from './constant';
import MarkdownBody from '../markdown-body';
import axios from '@blog/client/web/utils/axios';
import { gernateAvatarImage } from '@blog/client/common/helper.util';
import marked from '@blog/client/libs/marked';
import { rem } from 'polished';

interface Props {
    url: string;
    replyId?: string;
    articleId?: string;
}

export const CommentForm = (props: Props) => {
    const [userInfo, setUserInfo] = useState<{ nickName: string; email: string }>({
        nickName: '',
        email: '',
    });
    const $textarea = useRef(null);
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isShowEmotion, setIsShowEmotion] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isShowPreview, setIsShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const debounceContent = useCallback(
        debounce((value: string) => {
            setContent(value);
            if (!isShowPreview) {
                setPreviewHtml(marked(value));
            }
        }),
        [1]
    );
    const showPreview = () => {
        if (!isShowPreview) {
            setPreviewHtml(marked(content));
        }
        setIsShowPreview(!isShowPreview);
    };
    const onEmojiInput = (text: string) => {
        setContent((val) => {
            const d = val + text;
            if ($textarea.current) {
                $textarea.current.value = d;
            }
            setPreviewHtml(marked(d));
            return d;
        });
    };
    useEffect(() => {
        const info = localStorage.getItem(USER_COMMENT_INFO_KEY);
        if (info) {
            const data: any = JSON.parse(info);
            setUserInfo(data);
        } else {
            const ids = uuidv4().split('-');
            const nickName = 'nickName_' + ids[0] + ids[1];
            const data = {
                nickName,
                email: null,
            };
            localStorage.setItem(USER_COMMENT_INFO_KEY, JSON.stringify(data));
            setUserInfo(data);
        }
    }, [1]);

    const submit = (): any => {
        const data: any = {
            nickName: userInfo.nickName,
            email: userInfo.email,
            article: props.articleId,
            content,
        };
        if (props.replyId) {
            Object.assign(data, {
                reply: props.replyId,
            });
        }
        if (!isLength(data.content, { min: 6 })) {
            return setErrorMessage('isLength');
        } else if (!isLength(data.content, { max: 490 })) {
            return setErrorMessage('isLength');
        }
        setButtonLoading(true);
        axios
            .post(props.url, data)
            .then(() => {
                location.reload();
            })
            .catch((e) => {
                setErrorMessage(JSON.stringify(e));
            });
    };
    return (
        <Flex flexDirection="column">
            <Alert
                status="info"
                color="theme.primaryText"
                variant="subtle"
                fontSize={rem(14)}
                mb={3}
                backgroundColor="theme.blackground"
                position="relative"
                py={1}
            >
                <AlertIcon size="14px" />
                <Tooltip aria-label="tip" placement="right-end" label="tip">
                    <IconButton
                        width="20px"
                        color="theme.primaryText"
                        variant="solid"
                        aria-label="tip"
                        icon="question-outline"
                        bg="transparent"
                        size="sm"
                        verticalAlign="text-bottom"
                        _hover={{
                            backgroundColor: 'none',
                        }}
                        _focus={{
                            boxShadow: 'none',
                        }}
                    ></IconButton>
                </Tooltip>
            </Alert>
            <Flex pb={3} alignItems="center" color="theme.primaryText">
                <Text fontSize={rem(14)} mr={1}>
                    Flex
                </Text>
                <Avatar
                    p={1}
                    borderRadius="md"
                    size="xs"
                    backgroundColor="theme.blackground"
                    name={userInfo.nickName}
                    src={gernateAvatarImage(userInfo.nickName) || ''}
                />
                <Text fontSize={rem(14)} ml={2}>
                    {userInfo.nickName}
                </Text>
            </Flex>
            <Box color="theme.primaryText">
                {errorMessage && (
                    <Alert status="error" mb={1} color="theme.primaryText" variant="subtle" fontSize={rem(14)}>
                        <AlertIcon size="12px" />
                        {errorMessage}
                        <CloseButton
                            size="sm"
                            position="absolute"
                            right="8px"
                            top="11px"
                            onClick={() => {
                                setErrorMessage('');
                            }}
                        />
                    </Alert>
                )}
                <Textarea
                    bg="theme.blackground"
                    color="theme.primaryText"
                    focusBorderColor="none"
                    fontSize={rem(14)}
                    name="content"
                    ref={$textarea}
                    borderRadius={0}
                    placeholder="textarea~"
                    resize="none"
                    isInvalid={!!errorMessage}
                    onChange={(event) => {
                        debounceContent(event.target.value);
                    }}
                ></Textarea>
                <Collapse mb={3} isOpen={isShowPreview}>
                    <Box
                        overflowY="auto"
                        minHeight="90px"
                        maxHeight="90px"
                        py={2}
                        borderStyle="dashed"
                        borderBottomWidth="1px"
                        borderBottomColor="#dedede"
                    >
                        <MarkdownBody content={previewHtml}></MarkdownBody>
                    </Box>
                </Collapse>
                <Box mt={2}>
                    <Collapse mb={3} isOpen={isShowEmotion}>
                        <Box borderBottom="1px dashed #dedede">
                            <Emoji
                                onInput={(text) => {
                                    onEmojiInput(text);
                                }}
                            ></Emoji>
                        </Box>
                    </Collapse>
                    <Flex
                        flexDirection={['column', 'row']}
                        justifyContent="space-between"
                        fontSize={rem(14)}
                        alignItems="center"
                    >
                        <Text as="span" mb={['10px', '0']}>
                            🚀 支持markdown语法
                        </Text>
                        <ButtonGroup spacing={4} color="theme.primaryText">
                            <Button
                                bg="theme.blackground"
                                variant="solid"
                                size="sm"
                                fontWeight="normal"
                                onClick={() => setIsShowEmotion(!isShowEmotion)}
                            >
                                {isShowEmotion ? '关闭表情' : '打开表情'}
                            </Button>
                            <Button
                                fontWeight="normal"
                                bg="theme.blackground"
                                variant="solid"
                                size="sm"
                                onClick={() => showPreview()}
                            >
                                {isShowPreview ? '关闭预览' : '预览'}
                            </Button>
                            <Button
                                fontWeight="normal"
                                isLoading={buttonLoading}
                                loadingText="正提交..."
                                variantColor="blue"
                                variant="solid"
                                size="sm"
                                onClick={() => submit()}
                            >
                                提 交
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};
