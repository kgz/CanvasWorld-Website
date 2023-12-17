import { useEffect } from "react"
import fetch_api from "../fetch/fetch"

const Migrations = () => {
    useEffect(() => {
        fetch_api('migrations', 'GET', (data: any) => {
            console.log(data)
        })
    }, [])
    return (
        <div>

        </div>
    )
}


export default Migrations