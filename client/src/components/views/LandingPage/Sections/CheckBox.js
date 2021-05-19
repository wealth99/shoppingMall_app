import React, { useState } from 'react';
import { Collapse, Checkbox  } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([]);

    const handleToogle = (value) => {
        // 누른 것의 Index를 구하고
        const currentIndex = Checked.indexOf(value);

        // 전체 Checked 된 State 에서 현재 누른 Checkbox가 이미 있다면
        const newChecked = [...Checked];

        // Stata 넣어준다
        if(currentIndex === -1) {
            newChecked.push(value);
        // 빼주고
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        props.handlefilters(newChecked);

    }

    const renderChackboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox value={value.name} onChange={() => handleToogle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false : true}>
                {value.name}
            </Checkbox>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['1']} >
                <Panel header="This is panel header 1" key="1">
                    {renderChackboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
