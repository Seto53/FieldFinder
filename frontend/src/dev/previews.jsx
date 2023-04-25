import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Admin from "../components/Admin";
import App from "../App";
import Account from "../components/Account";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Admin">
                <Admin/>
            </ComponentPreview>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Account">
                <Account/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
