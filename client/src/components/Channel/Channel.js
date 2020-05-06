import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

/** style */
import * as El from './Channels.style'
/** components */
import Controls from '../Controls/Controls'
/** notification */
import { toast } from 'react-toastify'

const Channel = ({socket}) => {
  window.midiaControls = {}
  let checkAgain = null

  useEffect(() => {
    if (socket) {
      console.log('< SOCKET CHANNELS > ', socket)
      handleConnection()
    }
  }, [socket])

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
        window.midiaControls = {
          mute: event.stream.mute,
          unMute: event.stream.unmute
        }
        video.volume = 0
        try {
          video.setAttributeNode(document.createAttribute('muted'))
        } catch (e) {
          video.setAttribute('muted', true)
        }
      }
      if (event.type === 'remote') toast.success(`${event.streamid} entrou`)

      document.getElementById('attendants').appendChild( video )
      video.srcObject = event.stream
    }

    connection.onstreamended = event => {
      let checkElement = document.getElementById(`attendant-${event.streamid}`)
      if (checkElement) {
        toast.warn(`${event.streamid} saiu`)
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
        checkAgain = setInterval(() => {
          
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

  return (
    <El.ChannelContainer>
      <El.ChannelAttendants id="attendants" />

      {socket && (
        <Controls
          socket={socket}
        />
      )}
    </El.ChannelContainer>
  )
}

Channel.propTypes = {
  socket: PropTypes.object
}

export default Channel

/*
https://rtcmulticonnection.herokuapp.com/demos/
*/