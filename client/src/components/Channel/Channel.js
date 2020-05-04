import React, {useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {
  let socket = null
  let video = null
  let canvas = null
  let context = null

  useEffect(() => {
    video = document.getElementById('video')
    canvas = document.getElementById('preview')
    context = canvas.getContext('2d')

    getUserMedia()
    connectSocket()
  })

  const connectSocket = () => {
    socket = io({transports: ['websocket'], upgrade: false})
    console.log('< SOCKET > ', socket)

    socket.on('connect', () => {
      console.log('< CLIENT SOCKET CONNECTED > ', socket.id)

      socket.emit('create-room', String(window.location.pathname))
      // socket.emit('add-user', socket.id)
    })

    socket.on('chat-message', msg => {

      console.log('< RECEIVING MESSAGE > ', msg)
      let node = document.createElement('li')
      node.innerText = msg
      document.getElementById('messages').appendChild( node )
    })

    socket.on('add-user', data => {
      console.log('< RECEIVING STREAM > ', data)

    })

  }

  const loadCamera = stream => {

    try {
      console.log('< LOAD CAM > ', stream)
      video.srcObject = stream
      video.onloadedmetadata = (e) => {
        console.log('< VIDEO ON > ', e)
        video.play()
     }

    } catch(e) {
      video.src = URL.createObjectURL(stream)
      console.log(e)
    }

  }

  const loadFail = () => {
    console.log('< FAIL TO LOADING CAM >')
  }
  
  const Draw = (video, context) => {
    context.drawImage(video,0,0,1200,900)
    socket.emit('stream', socket.id, String(window.location.pathname), canvas.toDataURL('image/webp'))
  } 

  const getUserMedia = () => {
    console.log('< GET USER MEDIA >')
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia )

    if ( navigator.getUserMedia ) {

      navigator.getUserMedia({
        video: true,
        audio: false
      },
        loadCamera,
        loadFail
      )
      setInterval(() => {
          Draw(video, context)
      }, .1)
    }

  }

  const sendEvent = () => {
    console.log('< SEND EVENT > ', socket)

    socket.emit('chat-message', socket.id, String(window.location.pathname), `${ document.getElementById('message-input').value }`)

    document.getElementById('message-input').value = ''
  }

  return (
    <El.ChannelContainer>
      <El.ChannelVideo autoplay="true" id="video" />
      <El.ChannelPreview id="preview" />
      <El.ChannelChat>
        <ul id="messages"></ul>
        <El.ActionChat>
          <input 
            id="message-input"
          />
          <button onClick={() => sendEvent()}>Send</button>
        </El.ActionChat>
      </El.ChannelChat>
    </El.ChannelContainer>
  )
}

export default Channel