import React from 'react';
import { Yapprightdiv,Message} from './style';


const Yapprightbar = () =>{
    return(
        <div style={{position:'relative',height: '100vh',width: '100%'}}>
        <Yapprightdiv>
            <Message>You dont have a message selected.</Message>
        </Yapprightdiv>
        </div>
    );
};

export default Yapprightbar;