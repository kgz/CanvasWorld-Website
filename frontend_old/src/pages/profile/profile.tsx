import { Route, Routes, NavLink, Navigate } from "react-router-dom";
import Account from "./account/account";
import styles from './profile.module.scss';
const Profile = () => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.links}>
                <NavLink className={styles.link} to="/profile/account">
                    <div className={styles.link_header}>Account</div>
                    <div className={styles.link_subheader}>change your account settings</div>    
                </NavLink>
                <NavLink className={styles.link} to="/profile/security">
                    <div className={styles.link_header}>Security</div>
                    <div className={styles.link_subheader}>change your security settings</div>
                </NavLink>

            </div>
            <div className={styles.content}>
                <Routes>
                    <Route path="" element={
                        <Navigate to="/profile/account" />
                    } />
                    <Route path="/account" element={<Account/>} />

                    <Route path="/security" element={
                        <>
                            <h1>security</h1>
                        </>

                    } />
                </Routes>
            </div>
        </div>

    );
};

export default Profile;