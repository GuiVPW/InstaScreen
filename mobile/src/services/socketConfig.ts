import io from 'socket.io-client'
import { baseURL } from './api'

export const socket = io(baseURL, {
    autoConnect: true,
})

export default socket