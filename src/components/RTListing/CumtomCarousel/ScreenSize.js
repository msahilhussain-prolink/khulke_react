const ScreenSize = (size) => {
    switch(size){
        case (size < 550): 
         return 1
        case (size > 750 && size < 1300):
            return 2
        case (size > 1300 && size < 1600):
            return 3
        case (size > 1600):
            return 4
        default:
            return 3
    }

}
export default ScreenSize;