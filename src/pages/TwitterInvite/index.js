import React from 'react';
import InviteIllustration from '../../assets/images/twitter_invite_hires.png'
import UnauthorizedLayout from '../Layouts/UnauthorizedLayout';
import InviteFriends from './invite_component';
const TwitterInvite = () => {
    return (
        <UnauthorizedLayout illustration={InviteIllustration} left_heading={"Conversation Matters"} left_subheading={"This is the beginning of a strong friendship"} rightcomponent={<InviteFriends />} />
    )
}


export default TwitterInvite;
