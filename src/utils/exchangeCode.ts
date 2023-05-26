import "dotenv/config";
import { request } from "./request";
import { parse } from "querystring";

export async function exchangeCodeForAcessToken(code: string) {
    const { GITHUB_TOKEN_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, REDIRECT_URL } = process.env

    const response = await request.post(GITHUB_TOKEN_URL, {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
    }, {
        headers: {
            "Contente-Type": "application/json"
        },
    })

    const data = parse(response.data);
    
    const userResponse = await request.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${data.access_token}`
        }
    });

    return userResponse.data
}