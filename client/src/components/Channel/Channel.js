import React, {useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {
  let socket = null
  let video = null

  useEffect(() => {    
    video = document.getElementById('video')

    connectSocket()
    getUserMedia()
  })

  const connectSocket = () => {
    socket = io({transports: ['websocket'], upgrade: false})
    console.log('< SOCKET > ', socket)

    socket.on('connect', () => {
      console.log('< CLIENT SOCKET CONNECTED > ', socket.id)
      socket.emit('create-room', String(window.location.pathname))
      socket.emit('add-user-room', socket.id, String(window.location.pathname))
    })

    socket.on('stream-video', (userId, data) => {
      if ( userId && userId !== socket.id && document.getElementById(`attendant-${userId}`) ) {
        console.log('< STREAM VIDEO > ', userId, data)
        let image = document.getElementById(`attendant-${userId}`)
        // image.setAttribute('src', `${data}`)
        image.src = data
        // image.setAttribute('src', `data:image/webp;base64,${window.btoa(data)}`)
      }  
      if (userId && userId !== socket.id && !document.getElementById(`attendant-${userId}`) ) {
        /** create image for attendant */
        let node = document.createElement('img')
        node.setAttribute('id', `attendant-${userId}`)
        document.getElementById('attendants').appendChild(node)
      }

    })

    socket.on('chat-message', msg => {
      console.log('< RECEIVING MESSAGE > ', msg)
      let node = document.createElement('li')
      node.innerText = msg
      document.getElementById('messages').appendChild( node )
    })

    socket.on('add-user-room', users => {
      console.log('< ADD USER ROOM > ', users)
    })

    socket.on('remove-user-room', rooms => {
      console.log('< REMOVE USER FROM ROOM > ', rooms)
    })

  }

  const loadCamera = stream => {

    try {
      console.log('< LOAD CAM > ', stream)
      video.srcObject = stream
      video.controls = true
      video.muted = true
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

  const getUserMedia = () => {
    console.log('< GET USER MEDIA >')
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia )

    if ( navigator.getUserMedia ) {

      navigator.getUserMedia({
        video: {
          mandatory: {
            minWidth: 1280,
            minHeight: 720,
            maxWidth: 1920,
            maxHeight: 1080,
            minAspectRatio: 1.77
          }
        },
        audio: false
      },
        loadCamera,
        loadFail
      )

      setInterval(() => {
        const canvas = document.getElementById('preview')
        canvas.getContext('2d').drawImage(video, 0, 0, 260, 190)

        socket.emit('stream-video', socket.id, String(window.location.pathname), canvas.toDataURL('image/webp'))
      }, 1000 / 30)
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

      <El.ChannelAttendants id="attendants" />

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