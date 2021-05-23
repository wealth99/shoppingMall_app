 import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Col, Card, Row } from 'antd'; 
import { RocketOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
        
        getProducts(body);

    }, []);

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
        .then(res => {
            if(res.data.success) {
                body.loadMore ? setProducts([...Products, ...res.data.productsInfo]) : setProducts(res.data.productsInfo);
                setPostSize(res.data.postSize);
            } else {
                alert('상품들을 가져오는데 실패했습니다.');
            }
        })
    }

    const loadoreHandler = () => {
        let skip = Skip + Limit;
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body);
        setSkip(skip);
    }

    const renderCards = Products.map((product, index) => {
        return <Col key={index} lg={6} md={8} xs={24} style={{ marginBottom: 16 }}>
                <Card cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>} >
                    <Meta title={product.title} description={`$${product.price}`} />
                </Card>
            </Col>
    });

    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body);
        setSkip(0);
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for(let key in data) {
            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }

        return array;
    }

    const handlefilters = (filters, category) => {
        const newFilters = { ...Filters };
        newFilters[category] = filters;

        if(category === 'price') {
            let priceValues = handlePrice(filters);
            newFilters[category] = priceValues;
        }

        showFilteredResults(newFilters);
        setFilters(newFilters);
    }

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0);
        getProducts(body)
    }
    
    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <RocketOutlined /> </h2>
            </div>

            {/* Filter */}
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={continents} handlefilters={filters => handlefilters(filters, 'continents') } />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handlefilters={filters => handlefilters(filters, 'price') }/>
                </Col>
            </Row>

            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>

            {/* Cards */}
            <Row gutter={16, 16}>
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadoreHandler}>더보기</button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage;