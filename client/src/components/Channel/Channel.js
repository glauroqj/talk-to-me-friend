import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {
  let socket = null
  let video = null
  let canvas = null
  let context = null

  const [ state, setState] = useState({
    message: ''
  })

  useEffect(() => {
    socket = io.connect( window.location.href )
    video = document.getElementById('video')
    canvas = document.getElementById('preview')
    context = canvas.getContext('2d')

    connectSocket()
    getUserMedia()
  })

  const connectSocket = () => {
    console.log('< SOCKET > ', socket)

    socket.on('connect', () => {
      console.log('< CLIENT SOCKET CONNECTED >')
    })

    socket.on('stream', data => {

      console.log('< SEND DATA WITH SOCKET > ', data)

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
    socket.emit('stream', canvas.toDataURL('image/webp'))
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
    socket.emit('stream', `${state.message}`)

  }

  return (
    <El.ChannelContainer>
      <El.ChannelVideo autoplay="true" id="video" />
      <El.ChannelPreview id="preview" />
      <El.ChannelChat>
        <ul></ul>
        <El.ActionChat>
          <input 
            value={state.message}
            onChange={e => setState({ ...state, message: e.target.value })}
          />
          <button onClick={() => sendEvent()}>Send</button>
        </El.ActionChat>
      </El.ChannelChat>
    </El.ChannelContainer>
  )
}

export default Channel