import React, {useEffect, useState} from 'react';
import { Space, Table } from 'antd';
import axios from "axios";
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Username',
        dataIndex: 'username',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        render: (text) => <a>{text}</a>,
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
        render: (_, record) => (
            <Space size="middle">
                <a>Edit {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const About = () => {
    const [data, setData] = useState([]);

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

    return <Table columns={columns} dataSource={data} />;
};

export default About;