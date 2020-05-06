import React, {useEffect} from 'react'
import io from 'socket.io-client'
/** style */
import * as El from './Channels.style'

const Channel = () => {
  let socket = null
  let video = null
  let checkAgain = null
  window.externalLib = {
    rtc: false,
    io: false
  }

  useEffect(() => {
    video = document.getElementById('video')

    connectSocket()
    // handleConnection()
  })

  const connectSocket = () => {
    socket = io({transports: ['websocket'], upgrade: false})
    console.log('< SOCKET > ', socket)

    navigator.getUserMedia = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia

    // const mediaOptions = {
    //   video: {
    //     mandatory: {
    //       minWidth: 1280,
    //       minHeight: 720,
    //       maxWidth: 1920,
    //       maxHeight: 1080,
    //       minAspectRatio: 1.77
    //     }
    //   },
    //   audio: true
    // }
    // navigator.getUserMedia({...mediaOptions}, stream => {
    //   video = document.querySelector('video')
    //   video.srcObject = stream
    //   video.controls = true
    //   video.muted = true
    //   video.onloadedmetadata = () => {
    //     video.play()
    //  }
    // })

    socket.on('connect', () => {
      console.log('< CLIENT SOCKET CONNECTED > ', socket.id)
      socket.emit('create-room', String(window.location.pathname))
      socket.emit('add-user-room', socket.id, String(window.location.pathname))
      
      handleConnection()
    })

    socket.on('chat-message', msg => {
      console.log('< RECEIVING MESSAGE > ', msg)
      let node = document.createElement('li')
      node.innerText = msg
      document.getElementById('messages').appendChild( node )
    })

    socket.on('add-user-room', (users, userId) => {
      console.log('< ADD USER ROOM > ', users, userId)
      // if (userId && userId !== socket.id && !document.getElementById(`attendant-${userId}`) ) {
      //   /** create image for attendant */
      //   let node = document.createElement('video')
      //   node.setAttribute('autoplay', 'autoplay')
      //   node.setAttribute('id', `attendant-${userId}`)
      //   document.getElementById('attendants').appendChild(node)
      // }
    })

    socket.on('remove-user-room', rooms => {
      console.log('< REMOVE USER FROM ROOM > ', rooms)
    })

  }

  const handleConnection = async () => {
    const isRTCLoaded = await externalLibIsLoaded('rtc')
    const isIOLoaded = await externalLibIsLoaded('io')
    console.log('< CHECK LIB > ', isRTCLoaded, isIOLoaded)
    if (!isRTCLoaded || !isIOLoaded) return false

    const RTCMultiConnection = window.RTCMultiConnection
    const connection = new RTCMultiConnection()
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
    connection.session = {
      audio: true,
      video: true
    }
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }
    connection.mediaConstraints = {
      video: {
        width: {ideal: 1280},
        height: {ideal: 720},
        frameRate: 30
      },
      audio: true
    }
    connection.iceServers = [{
      'urls': [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun.l.google.com:19302?transport=udp',
      ]
    }]

    connection.onstream = event => {
      console.log('< ON STREAM > ', event)
        let checkElement = document.getElementById(`attendant-${event.streamid}`)

        if (checkElement) {
          /** duplicated element */
          checkElement.remove()
        }

        event.mediaElement.removeAttribute('src')
        event.mediaElement.removeAttribute('srcObject')
        event.mediaElement.muted = true
        event.mediaElement.volume = 0

        let video = document.createElement('video')

        try {
            video.setAttributeNode(document.createAttribute('autoplay'))
            video.setAttributeNode(document.createAttribute('playsinline'))
            video.setAttribute('id', `attendant-${event.streamid}`)
        } catch (e) {
            video.setAttribute('autoplay', true)
            video.setAttribute('playsinline', true)
        }

        if (event.type === 'local') {
          video.volume = 0
          try {
              video.setAttributeNode(document.createAttribute('muted'))
          } catch (e) {
              video.setAttribute('muted', true)
          }
        }

        document.getElementById('attendants').appendChild( video )

        video.srcObject = event.stream
    }

    connection.onstreamended = event => {
      let checkElement = document.getElementById(`attendant-${event.streamid}`)
      if (checkElement) {
        checkElement.remove()
      }
    }

    connection.onMediaError = e => {
      console.warn('< ERROR > ', e)
      if (e.message === 'Concurrent mic process limit.') {
        connection.join(connection.sessionid)
      }
    }

    connection.openOrJoin(window.location.pathname)
    
    console.log('< connection > ', connection )
  }

  const externalLibIsLoaded = (name) => (
    new Promise(resolve => {
      // const isArrayEmpty = Object.keys( window.externalLib ).length
      console.log('< external name > ', name)
      if ( window.externalLib[name] ) resolve(true)
      
      if ( !window.externalLib[name] ) {
        let count = 0
        let checkAgain = setInterval(() => {
          
          if ( !window.externalLib[name] && count >= 5 ) {
            clearInterval(checkAgain)
            resolve(false)
          }

          if ( window.externalLib[name] ) {
            clearInterval(checkAgain)
            resolve(true)
          }

          count++
        }, 1000)
      }

    })
  )

  const loadFail = error => {
    console.warn('< ERROR > ', error)
  }

  const sendEvent = () => {
    console.log('< SEND EVENT > ', socket)

    socket.emit('chat-message', socket.id, String(window.location.pathname), `${ document.getElementById('message-input').value }`)

    document.getElementById('message-input').value = ''
  }

  return (
    <El.ChannelContainer>

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