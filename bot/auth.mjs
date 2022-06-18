import axios from 'axios'

const verifyUrl = 'https://api.line.me/oauth2/v2.1/verify'

export default async (token) => {
    const params = new URLSearchParams()
    params.append('id_token', token)
    params.append('client_id', process.env.LIFF_CLIENT_ID)

    let response = null
    try {
        response = await axios.post(verifyUrl, params, {
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
