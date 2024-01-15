import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
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
            // {
            //     title: 'Action',
            //     dataIndex: 'operation',
            //     render: () => (
            //         <Space size="middle">
            //             <a style={{ color: 'red' }}> Delete </a>
            //         </Space>
            //     ),
            // },
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
