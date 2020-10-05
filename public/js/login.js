/*eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'

export const login = async (email, password) => {
    const data = {
        email,
        password
    }

    try {

        const res = await axios({
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            url: '/api/v1/users/login',
            data: {
                ...data
            }
        })
        if (res.data.status === "Success") {
            showAlert('success', 'logged in sucessfully!', 5000)
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }

    } catch (err) {
        showAlert('error', 'Log In Failed', 5000)
    }
}


export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            url: '/api/v1/users/logout',

        })
        if (res.data.status === "Success") {
            window.setTimeout(() => {
                location.assign('/')
            }, 500)

        }

    } catch (err) {
        showAlert('error', 'Error logging out! Try again.', 5000)

    }
}








