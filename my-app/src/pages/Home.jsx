import React, { useEffect, useState } from 'react';
import {Space, Table, Button, Modal, Form, Input, message, notification, Popconfirm} from 'antd';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState([]);

    const getUsers = async () => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://100.96.184.148:8080/users', configHeader);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchImageAndSetData = async (userId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            const response = await axios.get(`http://100.96.184.148:8080/image/hyper/${userId}`, config);

            // Update data with imageFiles for the specific user
            setData((prevData) =>
                prevData.map((user) => (user.id === userId ? { ...user, files: response.data } : user))
            );
        } catch (error) {
            console.error('Error fetching image data:', error);
        }
    };

    const deleteUserImage = async (imageId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            await axios.delete(`http://100.96.184.148:8080/image/hyper/${imageId}`, config);

            // Update data with the deleted image removed immediately
            setData((prevData) => {
                const newData = prevData.map((user) => ({
                    ...user,
                    files: user.files ? user.files.filter((file) => file.id !== imageId) : [],
                }));
                return newData;
            });

            message.success('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Error deleting image');
        }
    };

    const handleFile = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'hdr') {
            setHdrFile(file);
        } else if (fileType === 'img') {
            setImgFile(file);
        } else {
            // Show an error notification for unsupported file types
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose an HDR (.hdr) or IMG (.img) file.',
            });
        }
    };

    const addUserImage = async (userId) => {
        try {
            if (!hdrFile || !imgFile) {
                notification.error({
                    message: 'Error',
                    description: 'Please choose both an HDR (.hdr) and an IMG (.img) file to upload.',
                });
                return;
            }

            const formData = new FormData();
            formData.append('header', hdrFile);
            formData.append('image', imgFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: userId,
                    'Content-Type': 'multipart/form-data',
                },
            };

            // Asynchronous upload
            await axios.post(`http://100.96.184.148:8080/image/hyper`, formData, config);

            // Immediately fetch and update image data for the user
            await fetchImageAndSetData(userId);

            // Update data with the added image immediately
            setData((prevData) => {
                const newData = prevData.map((user) => {
                    if (user.id === userId) {
                        return {
                            ...user,
                            files: [...(user.files || []), { /* Add properties for the new image */ }],
                        };
                    }
                    return user;
                });
                return newData;
            });

            message.success('Image added successfully');
        } catch (error) {
            console.error('Error adding image:', error);
            message.error('Error adding image');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://100.96.184.148:8080/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                const users = usersResponse.data;

                setData(users);

                // Fetch image data for all users concurrently
                const fetchImagePromises = users.map((user) => fetchImageAndSetData(user.id));
                await Promise.all(fetchImagePromises);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchImageForUser = async (userId) => {
            try {
                // Check if the user has associated image data
                const user = data.find((user) => user.id === userId);
                if (user && user.files) {
                    return;
                }

                // Check if image data has already been fetched for this user
                if (!fetchedUsers.includes(userId)) {
                    await fetchImageAndSetData(userId);

                    // Update the fetchedUsers state to mark this user as fetched
                    setFetchedUsers((prevUsers) => [...prevUsers, userId]);
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        if (data.length > 0) {
            const userId = data[1].id; // Assuming you want to fetch images for the second user
            fetchImageForUser(userId);
        }
    }, [data, fetchedUsers]);

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'File',
                dataIndex: 'path',
                fixed: 'left',
            },
            {
                title: 'Type',
                dataIndex: 'type',
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <Popconfirm
                            title="Are you sure to delete this file?"
                            onConfirm={() => deleteUserImage(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a style={{ color: 'red' }}> Delete </a>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        // Check if the user has associated image data
        const imageData = record.files || [];

        return (
            <div>
                <Table columns={columns} dataSource={imageData} pagination={false} />
                <Button type="primary" onClick={() => showAddImageModal(record.id)}>
                    Add Image
                </Button>
            </div>
        );
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];

    // Add Image Modal
    const [isAddImageModalVisible, setAddImageModalVisible] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const showAddImageModal = (userId) => {
        setCurrentUserId(userId);
        setAddImageModalVisible(true);
    };

    const handleAddImageOk = async () => {
        try {
            const values = await form.validateFields();
            const { hdrFile, imgFile } = values;

            // Assuming your image data structure contains 'hdr' and 'img' properties
            const imageData = { hdr: hdrFile, img: imgFile };

            await addUserImage(currentUserId, imageData);
            setAddImageModalVisible(false);
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    const handleAddImageCancel = () => {
        setAddImageModalVisible(false);
    };



    return (
        <>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: data.length > 0 ? [data[0].id] : [],
                }}
                dataSource={data}
            />
            <Modal
                title="Add Image"
                visible={isAddImageModalVisible}
                onOk={handleAddImageOk}
                onCancel={handleAddImageCancel}
            >
                <p>HDR file</p>
                {/* Choose HDR file input */}
                <input type="file" accept=".hdr" onChange={handleFile}/>
                <p>IMG file</p>
                {/* Choose IMG file input */}
                <input type="file" accept=".img" onChange={handleFile}/>
            </Modal>
        </>
    );
};

export default Home;
