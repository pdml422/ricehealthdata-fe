import React, { useState, useEffect } from 'react';
import { Card, Space, Form, Input, notification } from 'antd';
import axios from 'axios';

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState([]);

    const getUserData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://100.96.184.148:8080/users/me', config);

            if (response && response.data) {
                setUserData(response.data);
            } else {
                // Handle the case where the response or response.data is undefined
                notification.error({
                    message: 'Error',
                    description: 'Unexpected response format',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response ? error.response.data.message : 'Something went wrong',
            });
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <Space direction="vertical" size={16}>
            <Card title="Profile" extra={<a href="#">Edit</a>} style={{ width: 800 }}>
                <Form.Item
                    label="Name"
                >

                    {userData.name}
                </Form.Item>
                <Form.Item
                    label="Mail"

                >
                        {userData.email}
                </Form.Item>
                <Form.Item
                    label="Role"
                >
                    {userData.role}
                </Form.Item>
            </Card>
        </Space>
    );
};

export default UserProfile;
