import React from 'react';

const Footer = () => {
    return (
        <footer
            className="justify-content-center col-12 p-3 text-light text-center d-flex align-items-end"
            style={{ background: 'var(--secondary)', position: 'absolute', bottom: 0}}
        >
            <p 
                className="py-3 m-0"
            >This site was developed by Santiago Vallejo - 2020</p>
        </footer>
    );
}

export default Footer;