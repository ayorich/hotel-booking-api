/*eslint-disable */
import '@babel/polyfill';

import { login, logout } from './login';
import { showAlert } from './alert'


const loginForm = document.querySelector('.form')
const logOutBtn = document.querySelector('.sign-out')

if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('pwd').value

        login(email, password)
    })
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)

showAlert('success', 'Do check API documentation. Site rendering still in progress...!', 180000)