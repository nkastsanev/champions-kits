import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.container}>
            <h1>404 Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">
                <button className={styles.backHomeBtn}>Go Back Home</button>
            </Link>
        </div>
    );
};

export default NotFoundPage;