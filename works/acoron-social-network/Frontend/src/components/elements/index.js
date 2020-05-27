/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import './spinner.css';
import styled from '@emotion/styled';

export const Avatar = ({ avatar, size = '3.5rem', responsiveSize= '3rem' }) => {
    return (
        <div
            className="mx-2 p-0 d-flex"
            css={css`
                border-radius: 50%;
                overflow: hidden;
                flex: 0 0 ${size};
                height: ${size};
                width: ${size};
                @media (max-width: 576px) {
                    flex: 0 0 ${responsiveSize};
                    height: ${responsiveSize};
                    width: ${responsiveSize};
                }
            `}
        >
            <img
                src={avatar}
                alt="user avatar"
                css={css`
                    width: 100%;
                    height: 100%;
                `}
            />
        </div>
    )
}

export const Spinner = () => {
    return (
        <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
        </div>
    )
}

export const GeneralPanelBox = (props) => {
    return (
        <div
            className="d-flex flex-column align-items-center pb-3"
            css={css`
                background: var(--terciary);
            `}
        >
            {props.children}
        </div>
    )
}


export const Box404 = styled.div`
    box-shadow: 2px 2px 2px 2px var(--secondary-muted);
    background: var(--terciary);
    display: flex;
    text-decoration: none;
    color: var(--secondary);
`;

export const NotFoundBox = ({ children }) => {
    return (
        <Box404
            className="p-3 mb-2 rounded d-block alert-warning"
        >
            {children}
        </Box404>
    )
}
