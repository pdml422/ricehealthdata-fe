import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);

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

            // Assuming your delete API endpoint is available at http://100.96.184.148:8080/image/hyper/{imageId}
            await axios.delete(`http://100.96.184.148:8080/image/hyper/${imageId}`, config);

            // After deletion, refetch the user data
            await getUsers();

            message.success('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Error deleting image');
        }
    };

    const addUserImage = async (userId, imageData) => {
        try {
            const formData = new FormData();
            formData.append('header', imageData.hdr);
            formData.append('image', imageData.img);

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: userId,
                    'Content-Type': 'multipart/form-data', // Ensure the Content-Type is set to multipart/form-data
                },
            };

            // Assuming your add image API endpoint is available at http://100.96.184.148:8080/users/{userId}/image
            await axios.post(`http://100.96.184.148:8080/image/hyper`, formData, config);

            // After adding, refetch the user data
            await getUsers();

            message.success('Image added successfully');
        } catch (error) {
            console.error('Error adding image:', error);
            message.error('Error adding image');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getUsers();
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchImageForUser = async (userId) => {
            // Check if the user has associated image data
            if (!data.some((user) => user.id === userId && user.files)) {
                await fetchImageAndSetData(userId);
            }
        };

        if (data.length > 0) {
            const userId = data[1].id;
            fetchImageForUser(userId);
        }
    }, [data]);

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
                        <Button type="link" onClick={() => deleteUserImage(record.id)} style={{ color: 'red' }}>
                            Delete
                        </Button>
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
                <Form form={form} layout="vertical" name="addImageForm">
                    <Form.Item
                        name="hdrFile"
                        label="HDR File"
                        rules={[{ required: true, message: 'Please upload an HDR file!' }]}
                    >
                        <Input type="file" accept=".hdr" />
                    </Form.Item>
                    <Form.Item
                        name="imgFile"
                        label="IMG File"
                        rules={[{ required: true, message: 'Please upload an IMG file!' }]}
                    >
                        <Input type="file" accept=".img" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Home;
