import _Link, { LinkProps } from 'next/link';

export default class Link extends _Link {
    constructor(props: LinkProps) {
        super(props);
        if (process.env.NODE_ENV !== 'production') {
            if (props.prefetch) {
                console.warn(
                    'Next.js auto-prefetches automatically based on viewport. The prefetch attribute is no longer needed. More: #'
                );
            }
        }
        this.p = props.prefetch === true;
    }
}
