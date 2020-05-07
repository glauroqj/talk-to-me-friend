import styled from 'styled-components'

export const ChannelContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #323232;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 56px;

  // 830px
  @media( max-width: 830px ) {
    
  }

  // 640px
  @media( max-width: 640px ) {

  }
`
export const ChannelAttendants = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;

  video {
    width: 50%;
    height: auto;

    &:first-child {
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }

  // 640px
  @media( max-width: 640px ) {
    flex-flow: column nowrap;

    video {
      width: 100%;
    }
  }
`

export const ChannelChat = styled.div`
  display: flex;
  position: relative;
  width: 20%;
`
export const ActionChat = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;

  input {
    width: 100%;
  }
`