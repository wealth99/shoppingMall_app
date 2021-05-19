import React from 'react';
import { Carousel } from 'antd'; 

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay>
            {props.images.map((image, index) => {
                return <div key={index}>
                    <img style={{ width:'100%', minHeight: '180px', maxHeight: '180px' }}  src={`http://localhost:5000/${image}`} />
                </div>
            })}
            </Carousel>
        </div>
    )
}

export default ImageSlider
