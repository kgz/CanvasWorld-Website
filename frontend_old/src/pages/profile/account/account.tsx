import { Button, Collapse, Descriptions, Form, Input } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './account.module.scss';
import Cookies from 'universal-cookie';
import Image from '../../../fetch/image';
import fetch_api from '../../../fetch/fetch';
import Modal from 'antd/es/modal/Modal';
import BasicInfo from './parts/basic_info';
import { useAppSelector, useAppDispatch } from '../../../@store/store';
import { setProfileCache, setProfileUrl, setUserData } from '../../../@store/user.slice';

const Account = () => {
    const [update, setUpdate] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [err, setErr] = useState('');
    const { loggedIn } = useAppSelector(state => state.UserSlice.data);
    const dispatch = useAppDispatch();
    const { Panel } = Collapse;
    const cookies = new Cookies();

    const handleFile = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        const Controller = new AbortController();
        const signal = Controller.signal;

        reader.onload = () => {
            if (reader.readyState === 2) {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + cookies.get('token')
                }
                if (file.size > 1000000) {
                    setErr('File size is too big');
                    setIsModalOpen(true);
                    return;
                }
                fetch('/me', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        img: reader.result
                    }),
                    signal: signal
                })
                    .then(res => {
                        if (res.status === 200) {
                            // throw new Error("not implemented");
                            // setUser({ ...user, profileCache: new Date().getTime().toString() });
                            void dispatch(setProfileCache(new Date().getTime().toString()));
                            setUpdate(update+1);
                            return res.text();
                        }
                        throw new Error(res.statusText);

                    })
                    .catch(err => {
                        console.log(err);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        setErr(err.message);
                        setIsModalOpen(true);
                    })
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        reader.readAsDataURL(file);
    }
    const onFinish = (values: any) => {
        console.log('Success:', values);
      };
      
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


    return (
        <div className={styles.wrapper}>
            <div className={styles.account_logo}>
                <div className={styles.account_logo__img}>
                    <Image key={update} src={"/me"} alt="profile" />
                </div>
                <div className={styles.account_logo__name}>
                    <span className={styles.desc}>
                        Upload a photo that identifies you
                    </span>
                    <br />
                </div>
                {/* uplaod button */}
                <div className={styles.account_logo__upload}>
                    <button onClick={() => {
                        document.getElementById('file')?.click();
                    }}>Upload</button>
                </div>
                <input type="file" name="file" id="file" className={styles.inputfile}
                    onChange={handleFile}
                    accept="image/*"
                />
            </div>

            <div className={styles.account_form}>

                <Collapse style={{background:'white'}} activeKey={1}>
                    <Panel header="Basic Infomation" key="1" >
                
                        {/* <Input className={styles.input} addonBefore={"Display Name"} placeholder={user.data?.username}  />
                        <Input type='email' addonBefore={"Contact"} placeholder={user.data?.email}  /> */}


                         {/* <Form
                            name="basic"
                            initialValues={{
                                name: user.data?.username,
                                email: user.data?.email
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                         >
                            <Form.Item 
                                label="Display Name" 
                                name="name"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            > 
                                <Input />
                            </Form.Item>

                            <Form.Item 
                                label="Email" 
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                                initialValue={user.data?.email}
                            > <Input type="email" />
                            </Form.Item>


                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form> */}
                        <BasicInfo />
                    </Panel>
                    <Panel header="Security" key="2">
                        <p>Content of Panel 2</p>
                    </Panel>
                    <Panel header="Privacy" key="3">
                        <p>Content of Panel 3</p>
                    </Panel>

                </Collapse>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={() => setIsModalOpen(false)} cancelText={false}>
                <p>{err}</p>
            </Modal>

        </div>


    );
};

export default Account;