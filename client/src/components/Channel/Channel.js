import React, {useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {

  useEffect(() => {
    getUserMedia()
    connectSocket()
  })

  const connectSocket = () => {
    const socket = io.connect( window.location.href )

    socket.on('news', data => {

      console.log('< CLIENT SOCKET > ', data)

    })

  }

  const getUserMedia = (mediaType, callback) => {
    console.log('< GET USER MEDIA >')

  }

  return (
    <El.ChannelContainer>
      CHANNEL
      <El.ChannelVideo autoplay="true" id="video" />
    </El.ChannelContainer>
  )
}

export default Channel