/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts'
const stripe = Stripe("pk_test_51Mf95ZJsuRjOQrlgDzKkyLdUz43Dhw2p9AqNDykhc5vaqDykH1TkPMNrPe4RjKotJhbpcGZONDolYpnUQKqzcRIT00iZGLmpgP");   

// export const bookTour = async tourId => {
//     try{
//     //1 get session from the server
//     const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
//     console.log(session)
//     //`/chekout-session/:tourId`

//     //2 create checkout form and charge credit card
//     await stripe.redirectToCheckout({
//         sessionId: session.data.session.id  
//     });
//     } catch(err) {
//         console.log(err);
//         showAlert('error', err);
//     }
// }