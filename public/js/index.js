/*eslint-disable */
import '@babel/polyfill';

import { login } from './login';

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('pwd').value
    login(email, password)
})