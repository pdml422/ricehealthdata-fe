import React, {useEffect, useState} from 'react';
import {Form, Modal, Space, Table, Input} from 'antd';
import axios from "axios";


const About = () => {
    const [data, setData] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getUsers = async () => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://localhost:8080/users', configHeader);
            setData(response.data); // Assuming the response data is an array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Call the getUsers function when the component mounts
        getUsers();
    }, []); // The empty dependency array ensures that this effect runs once when the component mounts

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        // {
        //     title: 'Tags',
        //     key: 'tags',
        //     dataIndex: 'tags',
        //     render: (_, { tags }) => (
        //         <>
        //             {tags.map((tag) => {
        //                 let color = tag.length > 5 ? 'geekblue' : 'green';
        //                 if (tag === 'loser') {
        //                     color = 'volcano';
        //                 }
        //                 return (
        //                     <Tag color={color} key={tag}>
        //                         {tag.toUpperCase()}
        //                     </Tag>
        //                 );
        //             })}
        //         </>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a onClick={showModal}>Edit </a>
                    <a style={{color: "red"}}>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <>
        <Table columns={columns} dataSource={data}/>
            <Modal title="Edit User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new Email!',
                            },
                        ]}
                    >
                        <Input Password />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )

};

export default About;