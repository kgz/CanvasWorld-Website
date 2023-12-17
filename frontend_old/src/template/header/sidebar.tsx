import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.scss';
import { DashboardOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import logo from './logo.png';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
           <div className={styles.sidebar__nav}>
                <div className={styles.sidebar__nav__item} title="Dashboard">
                    <NavLink to="/"><DashboardOutlined /></NavLink>
                </div>
                <div className={styles.sidebar__nav__item} title="migrations">
                    <NavLink to="/migrations"><DatabaseOutlined /></NavLink>
                </div>
                <div className={styles.sidebar__nav__item} title="migrations">
                    <NavLink to="/profile"><UserOutlined /></NavLink>
                </div>
                {/* <div className={styles.header__nav__item}>
                    <NavLink to="/login">Login</NavLink>
                </div> */}
            </div>
        </div>

    )
}

export default Sidebar
