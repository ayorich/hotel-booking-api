/*eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alert';

import { login, logout } from './login';
import { updateSettings } from './updateSettings'

const loginForm = document.querySelector('#login-form')
const logOutBtn = document.querySelector('.sign-out')
const userDataForm = document.querySelector('#userdata-form')
const userPasswordForm = document.querySelector('#pwd-form')

if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('pwd').value

        login(email, password)
    })
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)
if (userDataForm) {

    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        updateSettings({ name, email }, 'data')
    })
}
if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.getElementById('pwd-btn').textContent = 'updating....'


        const passwordCurrent = document.getElementById('pwd').value
        const password = document.getElementById('newpwd').value
        const passwordConfirm = document.getElementById('confirmpwd').value
        if (password.length < 8) return showAlert('error', 'Password length is less than 8', 5000)
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')
        document.getElementById('pwd-btn').textContent = 'Save Password',
            document.getElementById('pwd').value = '',
            document.getElementById('newpwd').value = '',
            document.getElementById('confirmpwd').value = ''

    })
}
// showAlert('success', 'Do check API documentation. Site rendering still in progress...!', 180000)