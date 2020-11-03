/* eslint-disable*/
import axios from 'axios'
import { showAlert } from './alert';

// const paystack = PaystackPop.setup({ key: 'pk_test_4d86e605c8f28dec0a2b7e883b67da3881eed49a' });


export const bookHotelRoom = async (hotelId, roomId) => {

    try {

        //1.get checkout session from api
        const { data } = await axios(
            `/api/v1/bookings/checkout-session/${hotelId}/room/${roomId}`
        )
        // console.log(data)
        //2.create checkout form + charge credit card
        const redirectUri = data.data.authorization_url;
        window.location.href = redirectUri;

    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
}
