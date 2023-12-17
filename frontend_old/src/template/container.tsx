import Header from "./header/header";
import styles from "./container.module.scss";
import { useContext } from "react";
import Sidebar from "./header/sidebar";
import { useAppSelector } from "../@store/store";
const Container = (props: any) => {

    const { loggedIn } = useAppSelector(state => state.UserSlice.data);

    const { children, ...rest } = props;
    return (
        <span className={styles.main}>
            {loggedIn &&  <>
                <Header />
                <Sidebar/>
            </>
             }
            <div className={loggedIn ? styles.main_content : ''}>
                {children}
            </div>
        </span>
    );
};

export default Container;