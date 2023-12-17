import { NavLink } from 'react-router-dom';
import styles from './header.module.scss';
import Image from '../../fetch/image';

import logo from './logo.png';
import { useAppSelector } from '../../@store/store';

const Header = () => {

    const {user} = useAppSelector(state => state.UserSlice.data);

    return (
        <header className={styles.header}>
            <div className={styles.header__logo}>
                <img src="/static/media/logo.png" alt="logo" />
            </div>
            {/* <div className={styles.header__search}>
                <input type="text" placeholder="Search" />
            </div> */}
            <div className={styles.header__profile}>
                <>{user.data?.username}</>
                <Image className={styles.icon} src="/me" key={0} alt={'Profile Image'} />
            </div>
        </header>

    )
}

export default Header
