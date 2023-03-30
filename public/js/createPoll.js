/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const createPoll = async (data) => {
    try{ 
        const res = await axios({
            method: 'POST',
            url: '/api/v1/polls',
            data
        });

        if(res.data.status === 'success') {
            showAlert('success', 'You created a new poll')
            window.setTimeout(() => {
                location.assign('/polls')
            }, 1500)
        }

    }
    catch(err){
        showAlert('error', err.response.data.message);
    }
}

