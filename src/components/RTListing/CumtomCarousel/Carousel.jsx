import React, { useEffect, useState } from 'react'
import './carousel.css';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Grid } from '@mui/material';
import ScreenSize from './ScreenSize';
import { useDispatch, useSelector } from 'react-redux';
import { getRTListCategoryData } from '../../../redux/actions/rtListingAction/mineRtAction';
const Carousel = (props) => {
    const {children, width, type, user_id} = props

    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(children.length)
    const dispatch = useDispatch();
    const [touchPosition, setTouchPosition] = useState(null)
    const access = localStorage.access;

    // Set the length to match current children from props
    useEffect(() => {
        setLength(children.length)
    }, [children])
    
    // const onClickHandle =() => {
    //   }

    const next = () => {
        if (currentIndex < (length - 1)) {
            setCurrentIndex(prevState => prevState + 1)
        }
        // onClickHandle()
    }

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevState => prevState - 1)
        }
        // onClickHandle()
    }

    const handleTouchStart = (e) => {
        const touchDown = e.touches[0].clientX
        setTouchPosition(touchDown)
    }

    const handleTouchMove = (e) => {
        const touchDown = touchPosition

        if(touchDown === null) {
            return
        }

        const currentTouch = e.touches[0].clientX
        const diff = touchDown - currentTouch

        if (diff > 5) {
            next();
        }

        if (diff < -5) {
            prev()
        }

        setTouchPosition(null)
    }

    return (
        <Grid container>
        <div className="carousel-container">
            <div className="carousel-wrapper">
                {/* You can alwas change the content of the button to other things */}
                {
                    currentIndex > 0 &&
                    <Grid item sm={1} sx={{maxWidth: "2%!important"}}>
                    <button onClick={() => {
                        prev();
                        onClickHandle(type);
                        }} className="left-arrow">
                       <ArrowBackIosNewRoundedIcon/>
                    </button>
                    </Grid>
                }
                <div
                    className="carousel-content-wrapper"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    <div
                        className="carousel-content"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {children}
                    </div>
                </div>
                {/* You can alwas change the content of the button to other things */}
                {
                    currentIndex < (length/ScreenSize(width))-1 &&
                    <Grid item sm={1} sx={{maxWidth: "2%!important"}}>

                    <button onClick={() => {
                        next();
                        onClickHandle(type)
                        }} className='right-arrow' >
                        <ArrowForwardIosRoundedIcon/>

                     </button>
                     </Grid>

                }
            </div>
        </div>
        </Grid>
    )
}

export default Carousel