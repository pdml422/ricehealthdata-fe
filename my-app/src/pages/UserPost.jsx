    import React, {useEffect, useRef, useState} from 'react';
    import {Space, Table, Modal, notification, Form, Input, Button} from 'antd';
    import axios from "axios";
    import {SearchOutlined} from "@ant-design/icons";
    import Highlighter from "react-highlight-words";

    const UserPost = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [currentPage] = useState(1);
        const [selectedData, setSelectedData] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [searchedColumn, setSearchedColumn] = useState('');
        const searchInput = useRef(null);


        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
        };
        const handleReset = (clearFilters) => {
            clearFilters();
            setSearchText('');
        };
        const getColumnSearchProps = (dataIndex) => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div
                    style={{
                        padding: 8,
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{
                            marginBottom: 8,
                            display: 'block',
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => clearFilters && handleReset(clearFilters)}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({
                                    closeDropdown: false,
                                });
                                setSearchText(selectedKeys[0]);
                                setSearchedColumn(dataIndex);
                            }}
                        >
                            Filter
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            close
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered ? '#1677ff' : undefined,
                    }}
                />
            ),
            onFilter: (value, record) =>
                record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text) =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: '#ffc069',
                            padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });


        const showModal = (stadata) => {
            setSelectedData(stadata);
            setIsModalOpen(true);
        };

        const showDeleteModal = (stadata) => {
            setSelectedData(stadata);
            setIsDeleteModalOpen(true);
        };

        const showAddModal = () => {
            setIsAddModalOpen(true);
        }

        const handleOk = async () => {
            setIsModalOpen(false);
            await updateData(selectedData);
            setSelectedData(null);
        };

        const handleDeleteOk = async () => {
            setIsDeleteModalOpen(false);
            await deleteData(selectedData);
        };


        const handleCancel = () => {
            setIsModalOpen(false);
            setIsDeleteModalOpen(false);
            setSelectedData(null);
        };

        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        UserId: localStorage.getItem('userId'),
                    },
                    params: {
                        page: currentPage,  // Send the current page as a query parameter
                    },
                };

                const response = await axios.get('http://100.96.184.148:8080/statistical/searchAll', config);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };


        const createData = async (values) => {
            try {
                const configHeader = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                };
                await axios.post(`http://100.96.184.148:8080/statistical/create`, values, configHeader);
                await fetchData()
                notification.success({
                    message: 'Data created successfully',
                })
            } catch (error) {
                console.error('Error creating data:', error);
            }
        };

        const updateData = async (stadata) => {
            try {
                const configHeader = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                };
                await axios.put(`http://100.96.184.148:8080/statistical/${stadata.id}`, stadata, configHeader);
                await fetchData();
            } catch (error) {
                console.error('Error updating data:', error);
            }
        };

        const deleteData = async (stadata) => {
            try {
                const configHeader = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                };
                await axios.delete(`http://100.96.184.148:8080/statistical/${stadata.id}`, configHeader);
                await fetchData();
                notification.success({
                    message: 'Data deleted successfully',
                });
            } catch (error) {
                console.error('Error deleting data:', error);
                notification.error({
                    message: 'Error deleting data',
                });
            }
        };


        useEffect(() => {
            fetchData();
        }, [currentPage]);


        const columns  = [
            {
                title: 'Replicate',
                width: 100,
                dataIndex: 'replicate',
                fixed: 'left',
                ...getColumnSearchProps('replicate')
            },
            {
                title: 'Sub-replicate',
                width: 100,
                dataIndex: 'subReplicate',
                fixed: 'left',
                ...getColumnSearchProps('subReplicate')
            },
            {
                title: 'Date',
                width: 120,
                dataIndex: 'date',
                fixed: 'left',
                ...getColumnSearchProps('date')
            },
            {
                title: 'Longitude',
                dataIndex: 'longitude',
                width: 120,
            },
            {
                title: 'Latitude',
                dataIndex: 'latitude',
                width: 120,
            },
            {
                title: 'Chlorophyll',
                dataIndex: 'chlorophyll',
                width: 120,
            },
            {
                title: 'P Conc',
                dataIndex: 'PConc',
                width: 120,
            },
            {
                title: 'K Conc',
                dataIndex: 'KConc',
                width: 120,
            },
            {
                title: 'N Conc',
                dataIndex: 'NConc',
                width: 120,
            },
            {
                title: 'Wet Weight',
                dataIndex: 'wetWeight',
                width: 120,
            },
            {
                title: 'Dried Weight',
                dataIndex: 'driedWeight',
                width: 120,
            },
            {
                title: 'Moiture',
                dataIndex: 'moiture',
                width: 120,
            },
            {
                title: 'Digesion',
                dataIndex: 'digesion',
                width: 120
            },
            {
                title: 'Action',
                fixed: 'right',
                width: 100,
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
                <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 1500 }}
                // antd site header height
                sticky={{ offsetHeader: 64 }}
                />
                {selectedData && (
                    <Modal
                        title="Edit Data"
                        visible={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form >
                            <Form.Item label="Chlorophyll" name="chlorophyll">
                                <Input
                                    defaultValue={selectedData.chlorophyll}
                                    value={selectedData.chlorophyll}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            chlorophyll: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="P Conc" name="pConc">
                                <Input
                                    defaultValue={selectedData.PConc}
                                    value={selectedData.PConc}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            PConc: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="K Conc" name="kConc">
                                <Input
                                    defaultValue={selectedData.KConc}
                                    value={selectedData.KConc}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            KConc: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="N Conc" name="nConc">
                                <Input
                                    defaultValue={selectedData.NConc}
                                    value={selectedData.NConc}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            NConc: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="Wet weight" name="wetWeight">
                                <Input
                                    defaultValue={selectedData.wetWeight}
                                    value={selectedData.wetWeight}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            wetWeight: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="Dried weight" name="driedWeight">
                                <Input
                                    defaultValue={selectedData.driedWeight}
                                    value={selectedData.driedWeight}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            driedWeight: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="Moiture" name="moiture">
                                <Input
                                    defaultValue={selectedData.moiture}
                                    value={selectedData.moiture}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            moiture: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                            <Form.Item label="Digesion" name="digesion">
                                <Input
                                    defaultValue={selectedData.digesion}
                                    value={selectedData.digesion}
                                    onChange={(e) =>
                                        setSelectedData((prevData) => ({
                                            ...prevData,
                                            digesion: e.target.value,
                                        }))
                                    }

                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                )}

                {selectedData && (
                    <Modal
                        title="Confirm Delete"
                        visible={isDeleteModalOpen}
                        onOk={handleDeleteOk}
                        onCancel={handleCancel}
                    >
                        <p>Are you sure you want to delete this data?</p>
                    </Modal>
                )}
            </>
        );
    };

    export default UserPost;
