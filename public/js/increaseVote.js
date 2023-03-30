/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const increaseVote = async (poll, vote)=> {
    try{


        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/polls/${poll}`,
            data: {
             vote
            }
        })

        if(res.data.status === 'success') {
            showAlert('success', 'You successfully voted')
        }

    }
    catch(err){
        showAlert('error', err.response.data.message);
    }
}