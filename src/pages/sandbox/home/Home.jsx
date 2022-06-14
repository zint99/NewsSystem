import React from 'react'
import axios from 'axios'
import { Button } from 'antd'

export default function Home() {
    const getData = () => {
        axios('http://localhost:5000/rights?_embed=children').then((data) => {
            console.log(data.data)
        })
    }

    return (
        <div>
            <Button type='danger' onClick={getData}> Home</Button>
        </div>
    )
}
