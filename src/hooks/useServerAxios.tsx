import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default function useServerAxios() {
    return instance;
}