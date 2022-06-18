import axios from 'axios'

const verifyUrl = 'https://api.line.me/oauth2/v2.1/verify'

export default async (token) => {
    try {
        const response = await axios.post(verifyUrl, {
            id_token: token,
            client_id: process.env.CLIENT_ID,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        if (!response || response.status !== 200) { throw response }    
    } catch (error) {
        console.error(error)
        return null
    }
    return {
        id: response.data.sub,
        name: response.data.name,
    }
}
