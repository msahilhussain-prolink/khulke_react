import { ACTIVE_WILDCARD_MESSAGE, LIVE_RT_EXTENDED, RESET_LIVE_RT_TIMER, SET_LIVE_RT_TIMER, UPDATE_EXTEND_DIALOG, UPDATE_RT_EXTENDED_TIME } from "../actionTypes"

export const updateLiveRTTimer = (data) => {
    return {
        type: SET_LIVE_RT_TIMER,
        payload: data,
    }
}

export const resetLiveRTTimer = () => {
    return {
        type: RESET_LIVE_RT_TIMER,
    }
}

export const liveRTExtended = (data) => {
    return {
        type: LIVE_RT_EXTENDED,
        payload: data,
    }
}

export const updateRTExtendedTime = (data) => {
    return {
        type: UPDATE_RT_EXTENDED_TIME,
        payload: data,
    }
}

export const updateExtendDialog = (data) => {
    return {
        type: UPDATE_EXTEND_DIALOG,
        payload: data,
    }
}

export const updateSelectedWildMsg = (data) => {
    return { 
        type: ACTIVE_WILDCARD_MESSAGE,
        payload: data,
    }
} 