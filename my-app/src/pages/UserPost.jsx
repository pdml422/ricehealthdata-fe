import { useParams } from 'react-router-dom'

const UserPost = () => {
    const { id } = useParams()
    console.log(id)

    const name = 'Nam'

    const array = [
        {
            id: 1,
            label: 'Water'
        },
        {
            id: 2,
            label: 'Fire'
        },
        {
            id: 3,
            label: 'Wind'
        }
    ]

    return (
        <div>
            User Post {id}
            <p>My name is {name}</p>
            <ul>
                {array.map((item) => (
                    <li key={item.id}>{item.label}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserPost
