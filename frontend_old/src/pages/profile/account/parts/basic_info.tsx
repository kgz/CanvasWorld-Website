import React, { useContext, useEffect } from 'react';
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import type { TUser } from '../../../../@types/TUser';
import { useAppDispatch, useAppSelector } from '../../../../@store/store';
import { setUserData } from '../../../../@store/user.slice';
import axios from 'axios';

const BasicInfo = () => {

    const {
        user 
    } = useAppSelector(state => state.UserSlice.data);

    const dispatch = useAppDispatch();

    const [errors, setErrors] = React.useState({});
    const onFinish = (values: any) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        setErrors({});
        axios.post<{UserBasicForm: TUser['data']}>('/api/me/update', JSON.stringify(values), {
            headers: headers,
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                void dispatch(setUserData(response.data.UserBasicForm));
            } else {
                setErrors(response.data);
            }
        }).catch(error => {
            console.log(error.response.data);
            // setErrors(error.response.data);
        });

    }

    useEffect(() => {
        console.log(Object.values(errors));
    }, [errors])

    return (
        <Form
            name="basic"
            size="middle"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}

            fields={
                [
                    {
                        name: ['username'],
                        value: user?.data?.username
                    },
                    {
                        name: ['email'],
                        value: user?.data?.email
                    },
                    {
                        name: ['validation_type'],
                        value: "userBasic"
                    }
                ]
            }
            onFinish={onFinish} 
            autoComplete="off"
            layout='vertical'
        >
            {Object.values(errors)?.map((x: any, y:any) => {
                return <Alert type="error" key={'bas_' + y} message={x} showIcon style={{marginBottom:15}}/> 
            })}
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input addonBefore = "Display Name"/>
            </Form.Item> 

            <Form.Item
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
            >
                <Input addonBefore="Email"/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            <Form.Item name='validation_type'  style={{ display: 'none' }}>
                <Input type='hidden' />
            </Form.Item>
        </Form>
    )
}

export default BasicInfo;