import React, {useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {
  let socket = null
  let video = null
  let pc = null
  let sessionDescription = null
  let offer = null
  let answersFrom = {}

  useEffect(() => {    
    video = document.getElementById('video')

    connectSocket()
  })

  const connectSocket = () => {
    const peerConnection = window.RTCPeerConnection ||
                           window.mozRTCPeerConnection ||
                           window.webkitRTCPeerConnection ||
                           window.msRTCPeerConnection

    sessionDescription = window.RTCSessionDescription ||
                        window.mozRTCSessionDescription ||
                        window.webkitRTCSessionDescription ||
                        window.msRTCSessionDescription

    navigator.getUserMedia = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia

    socket = io({transports: ['websocket'], upgrade: false})
    console.log('< SOCKET > ', socket)

    pc = new peerConnection({
      iceServers: [{
          url: 'stun:stun.services.mozilla.com',
          username: 'somename',
          credential: `${socket.id}`
      }]
    })

    pc.onaddstream = obj => {
      console.log('< STREAM > ', obj)
      // document.getElementById(`attendant-${objuserId}`)
      // var vid = document.createElement('video')
      // vid.setAttribute('class', 'video-small')
      // vid.setAttribute('id', 'video-small')
      // document.getElementById('attendants').appendChild(vid)
      let vid = document.getElementById(`attendant`)
      vid.setAttribute('autoplay', 'true')
      vid.srcObject = obj.stream

    }

    const mediaOptions = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 1920,
          maxHeight: 1080,
          minAspectRatio: 1.77
        }
      },
      audio: true
    }
    navigator.getUserMedia({...mediaOptions}, stream => {
      video = document.querySelector('video')
      video.srcObject = stream
      video.controls = true
      video.muted = true
      video.onloadedmetadata = () => {
        // console.log('< VIDEO ON > ', e)
        video.play()
     }
      pc.addStream(stream)
    })

    socket.on('connect', () => {
      console.log('< CLIENT SOCKET CONNECTED > ', socket.id)
      socket.emit('create-room', String(window.location.pathname))
      socket.emit('add-user-room', socket.id, String(window.location.pathname))
    })

    // socket.on('stream-video', (userId, data) => {
    //   if ( userId && userId !== socket.id && document.getElementById(`attendant-${userId}`) ) {
    //     // console.log('< STREAM VIDEO > ', userId, data)
    //     let image = document.getElementById(`attendant-${userId}`)
    //     // image.setAttribute('src', `${data}`)
    //     image.src = data
    //     // image.setAttribute('src', `data:image/webp;base64,${window.btoa(data)}`)
    //   }  
    //   if (userId && userId !== socket.id && !document.getElementById(`attendant-${userId}`) ) {
    //     /** create image for attendant */
    //     let node = document.createElement('img')
    //     node.setAttribute('id', `attendant-${userId}`)
    //     document.getElementById('attendants').appendChild(node)
    //   }
    // })

    socket.on('chat-message', msg => {
      console.log('< RECEIVING MESSAGE > ', msg)
      let node = document.createElement('li')
      node.innerText = msg
      document.getElementById('messages').appendChild( node )
    })

    socket.on('add-user-room', (users, userId) => {
      if (userId && userId !== socket.id && !document.getElementById(`attendant-${userId}`) ) {
        console.log('< ADD USER ROOM > ', users, userId)
        /** create image for attendant */
        // let node = document.createElement('video')
        // node.setAttribute('autoplay', 'autoplay')
        // node.setAttribute('id', `attendant-${userId}`)
        // document.getElementById('attendants').appendChild(node)
        createOffer(userId)
      }
    })

    socket.on('remove-user-room', rooms => {
      console.log('< REMOVE USER FROM ROOM > ', rooms)
    })

    socket.on('offer-made', data => {
      offer = data.offer
      pc.setRemoteDescription(new sessionDescription(data.offer), () => {
        pc.createAnswer(answer => {
          pc.setLocalDescription(new sessionDescription(answer), () => {
            socket.emit('create-answer', {
              answer: answer,
              to: data.socket,
              roomName: String(window.location.pathname)
            })
          }, loadFail)
        }, loadFail)
      }, loadFail)

    })

    socket.on('answer-made', data => {
      pc.setRemoteDescription(new sessionDescription(data.answer), () => {
        document.getElementById(`attendant`).setAttribute('style', 'display: block')

        if ( !answersFrom[data.userId] ) {
          createOffer(data.userId)
          answersFrom[data.userId] = true
        }

      }, loadFail)
    })

  }

  const createOffer = id => {
    pc.createOffer(offer => {
      pc.setLocalDescription(new sessionDescription(offer), () => {
        socket.emit('create-offer', {
          offer: offer,
          to: id,
          roomName: String(window.location.pathname)
        })
      }, loadFail)
    }, loadFail)
  }

  // const loadCamera = stream => {

  //   try {
  //     console.log('< LOAD CAM > ', stream)
  //     video.srcObject = stream
    //   video.controls = true
    //   video.muted = true
    //   video.onloadedmetadata = (e) => {
    //     console.log('< VIDEO ON > ', e)
    //     video.play()
    //  }

  //   } catch(e) {
  //     video.src = URL.createObjectURL(stream)
  //     console.log(e)
  //   }

  // }

  const loadFail = error => {
    console.warn('< ERROR > ', error)
  }

  // const getUserMedia = () => {
  //   console.log('< GET USER MEDIA >')
  //   navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia )

  //   if ( navigator.getUserMedia ) {

  //     navigator.getUserMedia({
  //       video: {
  //         mandatory: {
  //           minWidth: 1280,
  //           minHeight: 720,
  //           maxWidth: 1920,
  //           maxHeight: 1080,
  //           minAspectRatio: 1.77
  //         }
  //       },
  //       audio: true
  //     },
  //       loadCamera,
  //       loadFail
  //     )

  //     // setInterval(() => {
  //     //   const canvas = document.getElementById('preview')
  //     //   canvas.getContext('2d').drawImage(video, 0, 0, 260, 190)

  //     //   socket.emit('stream-video', socket.id, String(window.location.pathname), canvas.toDataURL('image/webp'))
  //     // }, .1)
  //   }

  // }

  const sendEvent = () => {
    console.log('< SEND EVENT > ', socket)

    socket.emit('chat-message', socket.id, String(window.location.pathname), `${ document.getElementById('message-input').value }`)

    document.getElementById('message-input').value = ''
  }

  return (
    <El.ChannelContainer>
      <El.ChannelVideo autoPlay="true" id="video" />
      <El.ChannelPreview id="preview" />

      <video id="attendant" autoPlay="true" style={{display: 'none'}} />
      {/* <El.ChannelAttendants id="attendants" /> */}

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