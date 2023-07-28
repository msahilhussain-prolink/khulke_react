import React from 'react';

const FriendTile = ({avatar, name, follow_status}) => {
    return(
        <div className="d-flex justify-content-between mb-3">
            <div className="d-flex justify-content-start">
                <img src={avatar} alt={`${name}'s profile picture`} className="avatar"/>
                <span style={{visibility:'hidden'}}>sp</span>
                <p className="pt-2 friend-name">{name}</p>
            </div>
            <div>
                {
                    follow_status?(
                        <button className="following-button">Following</button>
                    ):(
                        <button className="follow-button">Follow</button>
                    )
                }
            </div>
        </div>
    );
}


export default FriendTile;