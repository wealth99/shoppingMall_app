import React, { useEffect } from 'react';
import axios from 'axios';

function DetailProductPage(props) {

    const productId = props.match.params.productId;

    useEffect(() => {

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(res => {
                if(res.data.success) {
                    console.log(res.data);
                } else {
                    alert('상세 정보를 가져오는데 실패했습니다.');
                }
            })

    }, [])

    return (
        <div>
            DetailProductPagesss
        </div>
    )
}

export default DetailProductPage;