import React, { useEffect, useState } from 'react';
import { Table, Space, Modal, Input, Form, Select, Button, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const About = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const showModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const showDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        await updateUser(selectedUser);
    };

    const handleDeleteOk = async () => {
        setIsDeleteModalOpen(false);
        await deleteUser(selectedUser);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const getUsers = async () => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://localhost:8080/users', configHeader);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateUser = async (user) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.put(`http://localhost:8080/users/${user.id}`, user, configHeader);
            await getUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (user) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.delete(`http://localhost:8080/users/${user.id}`, configHeader);
            await getUsers();
            notification.success({
                message: 'User deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            notification.error({
                message: 'Error deleting user',
            });
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

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
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => showModal(record)}>Edit</a>
                    <a style={{ color: 'red' }} onClick={() => showDeleteModal(record)}>
                        Delete
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} />
            {selectedUser && (
                <Modal
                    title="Edit User"
                    visible={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    {/* Display the details of the selected user in the modal */}
                    <Form>
                        <Form.Item label="Name" name="name">
                            <Input
                                value={selectedUser.name}
                                onChange={(e) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        name: e.target.value,
                                    }))
                                }
                                defaultValue={selectedUser.name}
                            />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        email: e.target.value,
                                    }))
                                }
                                defaultValue={selectedUser.email}
                            />
                        </Form.Item>
                        <Form.Item label="Role" name="role">
                            <Select
                                value={selectedUser.role}
                                onChange={(value) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        role: value,
                                    }))
                                }
                                defaultValue={selectedUser.role}
                                style={{ width: '150px', height: '30px' }}
                            >
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                            </Select>
                        </Form.Item>
                        {/* Add other form fields for user details */}
                    </Form>
                </Modal>
            )}

            {selectedUser && (
                <Modal
                    title="Confirm Delete"
                    visible={isDeleteModalOpen}
                    onOk={handleDeleteOk}
                    onCancel={handleCancel}
                >
                    <p>Are you sure you want to delete this user?</p>
                </Modal>
            )}
        </>
    );
};

export default About;
