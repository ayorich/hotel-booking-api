/*eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alert';

import { login, logout, signUp } from './auth';
import { updateSettings } from './updateSettings';
import { bookHotelRoom } from './paystack';

const loginForm = document.querySelector('#login-form')
const signUpForm = document.querySelector('#signup-form')
const logOutBtn = document.querySelector('.sign-out')
const userDataForm = document.querySelector('#userdata-form')
const userPasswordForm = document.querySelector('#pwd-form')
const bookBtn = document.querySelectorAll('#book-room')

if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('pwd').value

        login(email, password)
    })
}

if (signUpForm) {

    signUpForm.addEventListener('submit', e => {
        e.preventDefault()
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const password = document.getElementById('pwd').value
        const confrimPassword = document.getElementById('cpwd').value

        signUp(email, password, confrimPassword, name)
    })
}


if (logOutBtn) logOutBtn.addEventListener('click', logout)


if (userDataForm) {

    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])

        // console.log(form)
        updateSettings(form, 'data')
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

if (bookBtn) {
    bookBtn.forEach(el => el.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { hotelId, roomId } = e.target.dataset;
        bookHotelRoom(hotelId, roomId)
    })
    )
}
// showAlert('success', 'Do check API documentation. Site rendering still in progress...!', 180000)