import React from 'react';
import Slide from '../Slide';

 const courseSlide = (props) =>{
     console.log( props);
    return( 
    
        <div class="slide carousel" name = {props.courseName}>
        <div class="control-loops">
            <a class="btn-floating"></a>
        </div>
    </div>
    );
 }

 export default courseSlide