import axios from 'axios';


const lotr = axios.create({
    baseURL: "https://the-one-api.herokuapp.com/v1",
    headers: {
        "Authorization": 'Bearer IPe-TOcIaEWm_QQ5tC7R'

    }
})

export default lotr;