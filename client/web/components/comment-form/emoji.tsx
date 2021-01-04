import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { css } from 'emotion';

interface Props {
    onInput: (val: string) => void;
}

export default (props: Props) => {
    const onClick = (event: any) => {
        let $el = null;
        if (event.target.nodeName.toLowerCase() === 'button') {
            $el = event.target;
        } else if (event.target.nodeName.toLowerCase() === 'img') {
            $el = event.target.parentNode;
        }
        if ($el) {
            const text = $el.getAttribute('data-input').trim();
            if (props.onInput) {
                props.onInput(text);
            }
            return;
        }
    };
    return (
        <ButtonGroup
            spacing={0}
            onClick={(e) => onClick(e)}
            className={css`
                button {
                    background-color: transparent;
                    &:focus {
                        box-shadow: none;
                    }
                }
                img {
                    width: 24px;
                }
            `}
        >
            <Button title="haha" data-input="@(haha">
                <img className="biaoqing newpaopao" title="haha" src="/static/images/emotion/haha.png" />
            </Button>
        </ButtonGroup>
    );
};
