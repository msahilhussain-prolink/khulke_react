import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
   *{
       margin:0;
       padding:0;
       box-sizing:border-box;
       /* font-family: ${(props) => props.theme.font.family}; */
       font-family: 'Work Sans';
    }

    .css-12rl710-MuiPaper-root-MuiDialog-paper {
      border-radius: 0.6rem !important;
      
    }
    .css-ypiqx9-MuiDialogContent-root{
        ::-webkit-scrollbar {
          width: 0.3em;
          }

        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                  }

        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: darkgrey;
            outline: 1px solid lightgray;
        }
    }


 

  html,body{
      scroll-behavior: smooth;
  }


  :root{
      --primary-heading-color:#161F3A;
      --secondary-heading-color:#11141C;
      --muted-dark-color:#475376;
      --muted-light-color:#63779C;
      --success-color: #66B984;
      --muted-gray-color: #E4E9F0;
      --grayed-out-color: #F4F4F4;
      --twitter-color: #25BCF5;
  }


  @font-face {
      font-family: 'Poppins-Black';
      src: url('../assets/fonts/Poppins-Black.ttf');
  }


  @font-face {
      font-family: 'Poppins-BlackItalic';
      src: url('../assets/fonts/Poppins-BlackItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Bold';
      src: url('../assets/fonts/Poppins-Bold.ttf');
  }


  @font-face {
      font-family: 'Poppins-BoldItalic';
      src: url('../assets/fonts/Poppins-BoldItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-ExtraBold';
      src: url('../assets/fonts/Poppins-ExtraBold.ttf');
  }


  @font-face {
      font-family: 'Poppins-ExtraBoldItalic';
      src: url('../assets/fonts/Poppins-ExtraBoldItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-ExtraLight';
      src: url('../assets/fonts/Poppins-ExtraLight.ttf');
  }


  @font-face {
      font-family: 'Poppins-ExtraLightItalic';
      src: url('../assets/fonts/Poppins-ExtraLightItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Italic';
      src: url('../assets/fonts/Poppins-Italic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Light';
      src: url('../assets/fonts/Poppins-Light.ttf');
  }


  @font-face {
      font-family: 'Poppins-LightItalic';
      src: url('../assets/fonts/Poppins-LightItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Medium';
      src: url('../assets/fonts/Poppins-Medium.ttf');
  }


  @font-face {
      font-family: 'Poppins-MediumItalic';
      src: url('../assets/fonts/Poppins-MediumItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Regular';
      src: url('../assets/fonts/Poppins-Regular.ttf');
  }


  @font-face {
      font-family: 'Poppins-SemiBold';
      src: url('../assets/fonts/Poppins-SemiBold.ttf');
  }


  @font-face {
      font-family: 'Poppins-SemiBoldItalic';
      src: url('../assets/fonts/Poppins-SemiBoldItalic.ttf');
  }


  @font-face {
      font-family: 'Poppins-Thin';
      src: url('../assets/fonts/Poppins-Thin.ttf');
  }


  @font-face {
      font-family: 'Poppins-ThinItalic';
      src: url('../assets/fonts/Poppins-ThinItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Black';
      src: url('../assets/fonts/WorkSans-Black.ttf');
  }


  @font-face {
      font-family: 'WorkSans-BlackItalic';
      src: url('../assets/fonts/WorkSans-BlackItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Bold';
      src: url('../assets/fonts/WorkSans-Bold.ttf');
  }


  @font-face {
      font-family: 'WorkSans-BoldItalic';
      src: url('../assets/fonts/WorkSans-BoldItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-ExtraBold';
      src: url('../assets/fonts/WorkSans-ExtraBold.ttf');
  }


  @font-face {
      font-family: 'WorkSans-ExtraBoldItalic';
      src: url('../assets/fonts/WorkSans-ExtraBoldItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-ExtraLight';
      src: url('../assets/fonts/WorkSans-ExtraLight.ttf');
  }


  @font-face {
      font-family: 'WorkSans-ExtraLightItalic';
      src: url('../assets/fonts/WorkSans-ExtraLightItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Italic-VariableFont_wght';
      src: url('../assets/fonts/WorkSans-Italic-VariableFont_wght.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Italic';
      src: url('../assets/fonts/WorkSans-Italic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Light';
      src: url('../assets/fonts/WorkSans-Light.ttf');
  }


  @font-face {
      font-family: 'WorkSans-LightItalic';
      src: url('../assets/fonts/WorkSans-LightItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Medium';
      src: url('../assets/fonts/WorkSans-Medium.ttf');
  }


  @font-face {
      font-family: 'WorkSans-MediumItalic';
      src: url('../assets/fonts/WorkSans-MediumItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Regular';
      src: url('../assets/fonts/WorkSans-Regular.ttf');
  }


  @font-face {
      font-family: 'WorkSans-SemiBold';
      src: url('../assets/fonts/WorkSans-SemiBold.ttf');
  }


  @font-face {
      font-family: 'WorkSans-SemiBoldItalic';
      src: url('../assets/fonts/WorkSans-SemiBoldItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-Thin';
      src: url('../assets/fonts/WorkSans-Thin.ttf');
  }


  @font-face {
      font-family: 'WorkSans-ThinItalic';
      src: url('../assets/fonts/WorkSans-ThinItalic.ttf');
  }


  @font-face {
      font-family: 'WorkSans-VariableFont_wght';
      src: url('../assets/fonts/WorkSans-VariableFont_wght.ttf');
  }


  h1,h2,h3,h4,h5,h6{
      font-family: 'WorkSans-Bold';
      letter-spacing: 0px;
  }

  .primary-heading{
      font-family: 'WorkSans-Bold';
      color:var(--primary-heading-color);
      font-size: 1.75rem;
  }
  .secondary-heading{
      font-family: 'WorkSans-Regular';
      color:var(--secondary-heading-color);
  }

  .text-muted-dark{
      color:var(--muted-dark-color);    
  }
  .text-muted{
      color:var(--muted-light-color);
  }

  .alert-text{
      color: var(--muted-light-color);
      font-family: 'WorkSans-Regular';
  }
  a{
      color: var(--primary-heading-color);
      text-decoration: underline;
  }

  .primary-btn-blk{
      width:100%;
      background-color: var(--secondary-heading-color);
      color: white;
      padding: 0.9rem 1rem;
      text-transform: uppercase;
      border-radius: 5px;
      outline: none;
      border:none;
      font-family: 'WorkSans-Light';
      font-size: 1rem !important;
      font-weight: lighter;
      margin: 5% 0px;
  }

  .primary-btn-gray{
      width:100%;
      background-color: var(--muted-gray-color);
      color: var(--muted-light-color);
      padding: 0.9rem 1rem;
      text-transform: uppercase;
      border-radius: 5px;
      outline:none;
      border:none;
      font-family: 'WorkSans-Light';
      font-size: 1.2rem !important;
      font-weight: lighter;
      margin: 5% 0px;
  }

  .twitter_btn{
      color: var(--twitter-color);
      background-color: white;
      border: 1px solid var(--twitter-color);
      border-radius: 10px;
      align-items: center;
      padding : 0.9rem 1rem;
      width: 100%;
      font-weight: 600;
      font-size: 1rem;
      margin: 5% 0px;
  }

  .twitter_btn img{
      height: 23px;
      width: 23px;
  }

  .link-button{
      outline:none;
      border:none;
      background-color: transparent;
      color:#AEBDD3;
      text-transform: capitalize;
      font-size: 0.8rem;
      font-weight: 600;
  }

  .link-button:hover{
      color:#333;
      text-decoration: underline;
  }

  .avatar{
      border-radius: 8px;
      height:50px;
      width:50px;
  }

  .list-name{
      font-family: 'WorkSans-Medium';
      font-weight: bold;
      color:#161F3A;
      text-transform: capitalize;
  }

  .follow-button{
      text-transform: capitalize;
      color:white;
      background-color: #66B984;
      border-radius: 60px;
      padding: 0.5rem 1.9rem;
      outline:none;
      border:none;
      font-size: 0.8rem;
      align-content: center;
  }


  .following-button{
      text-transform: capitalize;
      color:var(--muted-dark-color);
      background-color: var(--grayed-out-color);
      border-radius: 60px;
      padding: 0.5rem 1.3rem;
      outline:none;
      border:none;
      font-size: 0.8rem;
  }

  .friends-list{
      max-height: 39vh;
      overflow-x:hidden;
      overflow-y:scroll;
  }

  .friends-list::-webkit-scrollbar{
    width: 5px;
  }
  .friends-list::-webkit-scrollbar-track{
      background-color:#F0F4F8;
  }
  .friends-list::-webkit-scrollbar-thumb{
    border-radius: 6px;
    background-color: #AEBDD3;
  }

  .friends-list::-webkit-scrollbar-thumb:hover{
    background-color: #11141C;
  }
`;

export const Logo = styled.img`
  height: 75px;
  width: 75px;

  @media screen and (max-width: 968px) {
    width: 50px;
    margin-left: -0.5rem;
  }
`;

export const FullName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin: 10px 0 0 0;
`;

export const Username = styled.p`
  font-size: 0.95rem;
  opacity: 0.5;
  margin: 0;
  :hover {
    color: blue;
    cursor: pointer;
  }
`;

export default GlobalStyle;
