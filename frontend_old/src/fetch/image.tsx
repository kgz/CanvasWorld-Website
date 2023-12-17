import { useContext, useEffect, useMemo, useState } from "react";
import Cookies from 'universal-cookie';
import { useAppDispatch, useAppSelector } from "../@store/store";
import { setProfileUrl } from "../@store/user.slice";


type ImageProps = {
    src: string;
    alt: string;
    key: number;
    noCahce?: boolean;
    [key: string]: any;
}

const Image = (props: ImageProps) => {
    const { src, alt, ...rest } = props;
    const [loading, setLoading] = useState(true);
    
    const { user } = useAppSelector(state => state.UserSlice.data);
    const { profileUrl, profileCache } = user;

    const dispatch = useAppDispatch();
    const cookies = useMemo(() => {
        return new Cookies();
    } ,[]);
    const [lastCache, setLastCache] = useState<any>();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const token = cookies.get('token');
        const headers = {
            // type image binanry   
            'Authorization': 'Bearer ' + token
        }

        if ((lastCache === profileCache) && profileUrl) {
            setLoading(false);
            return;
        }

        fetch('/me?' + user.profileCache ?? '', {
            method: 'GET',
            headers: headers,
            signal: signal
        })
            // image
            .then(res => res.blob())
            .then(blob => {
                console.log(blob)
                const url = URL.createObjectURL(blob);
                console.log(url)
                void dispatch(setProfileUrl(url));
                setLastCache(profileCache);

                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })

        return () => controller.abort();
    }, [user, profileCache, profileUrl, props.noCahce, cookies, lastCache, dispatch]);

    useEffect(() => {
        console.log({user});
    } ,[user]);

    if (loading) return <div></div>;
    return <img src={profileUrl} alt={alt} {...rest}
    // set download link name

    />;
};


export default Image;