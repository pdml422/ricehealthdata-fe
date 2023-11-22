import { Button, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'

const { Column } = Table

const About = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address'
    }
  ]
  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`
    })
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 0

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getPostList = async () => {
    setIsLoading(true)
    try {
      await axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
        setIsLoading(false)
        setPosts(response.data)
      })
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPostList()
  }, [])

  return (
    <div className="about-page">
      <Table
        dataSource={posts}
        pagination={false}
        rowKey={(obj) => obj.id}
        // onChange={onTableChange}
        loading={isLoading}
      >
        <Column
          title="ID"
          key="id"
          dataIndex="id"
          render={(id) => <p>{id}</p>}
        />
        <Column
          title={'Title'}
          key="title"
          dataIndex="title"
          sorter={(a, b) => a.title.localeCompare(b.title)}
          render={(title) => <p>{title}</p>}
        />
        <Column
          title={'Body'}
          key="body"
          dataIndex="body"
          sorter={(a, b) => a.title.localeCompare(b.title)}
          render={(body) => <p>{body}</p>}
        />
      </Table>
    </div>
  )
}

export default About
