import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

function FileUpload(props) {

    const [Images, setImages] = useState([]);

    const dropHandler = (files) => {

        let formData = new FormData();

        const config = {
            header: {'content-type': 'multipart/fomr-data'}
        }

        formData.append('file', files[0]);

        axios.post('/api/product/image', formData, config)
            .then(res => {
                if(res.data.success) {
                    setImages([...Images, res.data.filePath]);
                    props.refreshFunction([...Images, res.data.filePath]); // props 를 통해 부모에게 이미지 전달 (올릴때)
                } else {
                    alert('파일을 저장하는데 실패했습니다');
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages= [...Images]

        newImages.splice(currentIndex, 1);
        setImages(newImages);
        
        props.refreshFunction(newImages); // props 를 통해 부모에게 이미지 전달 (삭제할때)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <div style={{  display: 'flex',  alignItems: 'center', justifyContent: 'center', width: 300, height: 240, border: '1px solid lightgray' }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <PlusOutlined style={{ fontSize: '3rem' }}/>
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: 300, height: 240, overflowX: 'scroll' }}>
                    {Images.map((image, index) => (
                        <div onClick={() => deleteHandler(image)} key={index}>
                            <img style={{ minWidth: 300, width: 300, height: 240 }} src={`http://localhost:5000/${image}`}/>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FileUpload
