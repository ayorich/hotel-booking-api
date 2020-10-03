/*eslint-disable */
import axios from 'axios'

export const login = async (email, password) => {
    console.log(email, password)
    const data = {
        email,
        password
    }

    try {
        // axios.post('/api/v1/users/login', {
        //     ...data
        // })
        //     .then(function (response) {
        //         console.log(response);
        //     })
        const response = await axios({
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            url: '/api/v1/users/login',
            data: {
                ...data
            }
        })
        console.log(response)
        // return response;


    } catch (err) {
        console.log('login', err.message)
    }
}








// try {
//     const response = await axios('https://cors-anywhere.herokuapp.com/http://127.0.0.1:8000/api/v1/users/login', {
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: 'same-origin', // include, *same-origin, omit
//         headers: {
//             'Content-Type': 'application/json'
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         redirect: 'follow', // manual, *follow, error
//         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//         body: data // body data type must match "Content-Type" header
//     });
//     console.log(response.json())
//     return response;


// } catch (err) {
//     console.log(err)
// }