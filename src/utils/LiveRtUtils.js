export const isSpeakerAccess = (role) => {
    return ["admin", "moderator", "admin-moderator", "admin-panellist", "panellist"].includes(role);
}

export const getGridStyle = (users, miniRT) => {
    if(users.length > 0){
        if(!miniRT){
            return {
                minWidth: "33vh !important"
            }
        }
    }

    return {}
}