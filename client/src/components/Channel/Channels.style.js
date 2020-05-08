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
  flex-flow: column;

  // 830px
  @media( max-width: 830px ) {
    
  }

  // 640px
  @media( max-width: 640px ) {

  }
`
export const ChannelLoading = styled.div`
  width: 100%;
  height: 100%;
  display flex;
  justify-content: center;
`
export const ChannelAttendants = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;

  video {
    min-width: 200px;
    max-width: 50%;
    flex: 1 auto;
    height: auto;
    background-color: #cecece;
    border: 1px solid #323232;

    &:first-child {
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }

  // 640px
  @media( max-width: 640px ) {

    video {
      min-width: 50%;
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