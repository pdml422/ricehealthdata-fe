import React, { useEffect, useState } from 'react';
import { Space, Table, message, Popconfirm } from 'antd';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);

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

        return <Table columns={columns} dataSource={imageData} pagination={false} />;
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
        </>
    );
};

export default Home;
