// create a laoding component that can be placed anywhere
// and will show a loading animation

import React from 'react';
import styles from './loading.module.scss';

function Loader() {
    
    return (
        // <div className={styles.loading_container}>
        //     <div className={styles.loading}></div>
        //     <div className={styles.loading_text}>
        //         <h1>Looking under the couch</h1>

        //     </div>
        // </div>

        <div className={styles.spinner}>
            <div className={styles.bounce1} />
            <div className={styles.bounce2} />
            <div className={styles.bounce3} />
        </div>

    );
}

export default Loader;
