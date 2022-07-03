import styled from "styled-components";

export const ChannelContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #323232;
  transition: background-color 0.2s ease;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 56px;
  flex-flow: column;

  // 830px
  @media (max-width: 830px) {
  }

  // 640px
  @media (max-width: 640px) {
  }
`;
export const ChannelLoading = styled.div`
  width: 100%;
  height: 100%;
  display flex;
  justify-content: center;
`;
export const ChannelAttendants = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  transition: width 0.4s ease;
  // height: 100vh;

  .attendant-name {
    position: absolute;
    right: 0;
    background: #fff;
    color: #323232;
    z-index: 1;
    bottom: 0;
    padding: 10px;
  }

  .box-attendant {
    flex: 1 1 40%;
    height: auto;
    position: relative;

    video {
      max-height: 100%;
      width: 100%;
      object-fit: contain;
      vertical-align: bottom;

      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);

      // width: 100px;
      // max-width: 50%;
      // flex: 1 1 40%;
      // object-fit: cover;
      // min-width: 70px;
      // max-width: 50%;
      // flex: 1 auto;
      // height: auto;
      // max-height: 350px;

      // &:first-child {
      // }
    }
  }

  // 640px
  @media (max-width: 640px) {
    // video {
    //   flex: 1 1 40%;
    // }
  }
`;
export const ChannelError = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 100%;
  justify-content: center;
  padding: 15px;

  h4 {
    color: #fff;
  }
`;
export const ChannelChat = styled.div`
  display: flex;
  position: relative;
  width: 20%;
`;
export const ActionChat = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;

  input {
    width: 100%;
  }
`;
