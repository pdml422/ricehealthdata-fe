import React, { useState, useEffect } from 'react';
import { Card, Space, Form, Input, notification, Button } from 'antd';
import axios from 'axios';

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState({ name: '', email: '', role: '' });
    const [editMode, setEditMode] = useState(false);

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

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleSaveClick = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            // Set the user ID from local storage to the userData state
            setUserData((prevUserData) => ({
                ...prevUserData,
                id: localStorage.getItem('userId'),
            }));

            // Make an API call to update user data
            await axios.put(`http://100.96.184.148:8080/users/${localStorage.getItem('userId')}`, userData, config);

            notification.success({
                message: 'Success',
                description: 'User data saved successfully',
            });

            // Exit edit mode after saving
            setEditMode(false);
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
            <Card
                title="Profile"
                extra={
                    editMode ? (
                        <Button onClick={handleSaveClick}>Save</Button>
                    ) : (
                        <Button onClick={handleEditClick}>Edit</Button>
                    )
                }
                style={{ width: 800 }}
            >
                <Form.Item label={<strong style={{ fontWeight: 'bold' }}>Name</strong>}>
                    {editMode ? (
                        <Input
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        />
                    ) : (
                        userData.name
                    )}
                </Form.Item>
                <Form.Item label={<strong style={{ fontWeight: 'bold' }}>Mail</strong>}>
                    {editMode ? (
                        <Input
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                    ) : (
                        userData.email
                    )}
                </Form.Item>
                <Form.Item label={<strong style={{ fontWeight: 'bold' }}>Role</strong>}>
                    {editMode ? (
                        <Input
                            disabled = {true}
                            value={userData.role}
                            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                        />
                    ) : (
                        <span>{userData.role}</span>
                    )}
                </Form.Item>
            </Card>
        </Space>
    );
};

export default UserProfile;
