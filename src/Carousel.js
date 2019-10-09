import React,{ Component } from 'react';
import './Carousel.css';
import carousel from 'react-bootstrap/carousel'
import Slide from './Slide';
import api from './data.json';
import scrollTo from './scrollToAnimate';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/Button';
import CreateCourse from './component/createCourse';
import EditCourse from './component/editCourse';
import Icon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
class Carousel extends Component {
    
    constructor(props){
    super(props);
    this.handleLeftNav= this.handleLeftNav.bind(this);
    this.onResize = this.onResize.bind(this); 
    this.throttleResize = throttle(this.onResize,250); // implementing throttling 
    this.throttleScroll = throttle(this.onScroll,250);
    this.animatingLeft = false;
    this.animatingRight = false;
    this.state ={
        addModalShow:false,
        
        editModalShow:false,
      
        courses:[],
        isLoaded:false,
        numOfSlidesToscroll: 7,
        allTheWayLeft: false,        //for hiding or showing the nab buttons
        allTheWayRight:false
        }
    }
    onSubmit =(newCourse) => {
        this.setState({newCourse: newCourse})
    }
    onScroll = (e) =>{
     
        this.checkIfAllTheWayOver();
    }
    onResize(){
        this.checkNumOfSlidesToScroll();
  
    }
    onKeyDown =(e) =>{
        const {keyCode} = e;
        var leftArrow = keyCode === 37;
        var rightArrow = keyCode === 39;
        var animatingLeft = this.animatingLeft;
        var animatingRight = this.animatingRight;
        if(leftArrow && !this.state.allTheWayLeft) {
            if(!this.animatingLeft){
                 this.animatingLeft = true;
                this.handleLeftNav().then(()=>{
                  this.animatingLeft = false;  
            });
        }
        } else if(rightArrow && !this.state.allTheWayRight){
            if(!this.animatingRight){
                this.animatingRight = true;
            this.handleRightNav().then(()=>{
                this.animatingRight = false; 
            });
        }
        }
    }
    checkIfAllTheWayOver() {
        const { carouselViewport } = this.refs;
        //if scrollLeft == 0 , do not  show button
        var allTheWayLeft = false;
        if(carouselViewport.scrollLeft === 0)
            allTheWayLeft =true;
       // if scrollLeft + lengthOfViewPortOffSetWidth === realLength of the viewport
       // 50 courses each with width of 120.50 *120 === real length of viewport
       //do not show right button
       
       var allTheWayRight = false;
       var amountScrolled = carouselViewport.scrollLeft;
       var viewportLength = carouselViewport.clientWidth;
       var totalWidthOfCarousel = carouselViewport.scrollWidth;
      
       
       if(Math.round(amountScrolled + viewportLength) === totalWidthOfCarousel){
           allTheWayRight = true;
       }
        if(this.state.allTheWayLeft !== allTheWayLeft || this.state.allTheWayRight !== allTheWayRight){
            this.setState({
                allTheWayLeft 
            })
        }
    }
    componentDidMount() {
        fetch(api.url)
            .then(res => res.json())
            .then(json=>{
                this.setState({
                    isLoaded:true,
                    courses:json,
                })
                this.CustomShuffle(this.state.courses) 
            });
       
        this.checkNumOfSlidesToScroll();
        this.checkIfAllTheWayOver();
        window.addEventListener('resize', this.throttleResize);
        window.addEventListener('keydown',this.onKeyDown);
    }
    CustomShuffle(coursesList) {

        //shuffle the elements in between first and the last
        var max = coursesList.length - 2;
        var min = 2;
        for (var i = max; i >= min; i--) {
          var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
          var itemAtIndex = coursesList[randomIndex];
          coursesList[randomIndex] = coursesList[i];
          coursesList[i] = itemAtIndex;
        }
        this.setState({
            isLoaded:true,
            courses:coursesList
        })
      }
    refreshCourses(){
        fetch(api.url)
            .then(res => res.json())
            .then(json=>{
                this.setState({
                    isLoaded:true,
                    courses:json,
                })
            });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.throttleResize); 
        window.removeEventListener('keydown',this.onKeyDown);
    }
    checkNumOfSlidesToScroll(){
        var numOfSlidesToscroll;
        if(window.innerWidth < 900)
            numOfSlidesToscroll = 'full';
        else
            numOfSlidesToscroll = 4;
        if(this.state.numOfSlidesToscroll !== numOfSlidesToscroll)
        this.setState({
            numOfSlidesToscroll
        })
    }
    widthAndTimeToScroll(){
        const { carouselViewport } = this.refs;
        var numOfSlidesToscroll = this.state.numOfSlidesToscroll;
        if(numOfSlidesToscroll === 'full'){
            return{
                widthToScroll: carouselViewport.offsetWidth,
                timeToScroll:400
            }
        }else{
            var widthOfSlide = document.querySelector('.slide').offsetWidth;
            var timeToMoveOneSlide = 200;
            return{
                widthToScroll : numOfSlidesToscroll * widthOfSlide,
                timeToScroll: Math.min((numOfSlidesToscroll * timeToMoveOneSlide), 400)
            }
        }
    }
    handleLeftNav(e){
        const { carouselViewport } = this.refs;
        var {widthToScroll , timeToScroll} = this.widthAndTimeToScroll();
        var newPosition = carouselViewport.scrollLeft - widthToScroll;
        var promise = scrollTo({
           element: carouselViewport,
           to: newPosition,
            duration: timeToScroll,
             scrollDirection:'scrollLeft',
             callBack:this.checkIfAllTheWayOver,
             context:this
             
            });
            return promise;
    }
    handleRightNav = (e) =>{
        const { carouselViewport } = this.refs;
        var {widthToScroll , timeToScroll} = this.widthAndTimeToScroll();
        var newPosition = carouselViewport.scrollLeft + widthToScroll;
         var promise = scrollTo({
           element: carouselViewport,
           to: newPosition,
            duration: timeToScroll,
             scrollDirection:'scrollLeft',
             callBack:this.checkIfAllTheWayOver,
             context:this
            });
            return promise;  // using promise so that carousel moves smoothly on keyboard events
    }
    renderSlides(courses) {
        return courses.map((course)=>{
           return (
            
               <div className="carousel slide card mb-2 card-title font-weight-bold"
                    name={course.courseName}
                    key={course.courseId}>{course.courseName}
                    <div className="controls-top card-body">
                        
                        <Button className="edit-button" 
                        variant="info" 
                        onClick={()=> this.setState({
                            editModalShow:true,courseid:course.courseId,coursename:course.courseName
                            })}>
                                <Edit>Edit</Edit>
                        </Button>
                        <EditCourse
                        show={ this.state.editModalShow}
                        onHide={ this.editModalClose}
                        courseid ={this.state.courseid}
                        coursename = {this.state.coursename}
                        />
                        
                        
                            <Button className='ml-2' variant="danger" onClick={()=>this.deleteCourse(course.courseId )}><Icon>Delete</Icon></Button>
                       
                    </div>
                    </div>
              
            );
        })
    }
    addModalClose(){
        fetch(api.url)
            .then(res => res.json())
            .then(json=>{
                this.setState({
                    isLoaded:true,
                    courses:json,
                    addModalShow:false
                })
            });
        
        window.location.reload();
    }
    editModalClose(){
        fetch(api.url)
            .then(res => res.json())
            .then(json=>{
                this.setState({
                    isLoaded:true,
                    courses:json,
                    editModalShow:false
                })
            });
          
        window.location.reload();
    }
    render(){

        const{ 
            allTheWayLeft,
            allTheWayRight,
            courses,
            isLoaded,
            courseID,
            courseNAME
        } = this.state;
      
        const navClasses = classNames({
            'carousel-nav':true
        })
        const leftNavClasses =classNames({
            'carousel-left-nav':true,
            'carousel-nav-disabled': allTheWayLeft

        },navClasses);
        const rightNavClasses = classNames({
            'carousel-right-nav':true,
            'carousel-nav-disabled': allTheWayRight
        },navClasses);
      //  let addModalClose =() => this.setState({addModalShow:false});
        return(  
        
            <div>
            <div className ="create-course">
                
                <Button  variant="primary" onClick={()=> this.setState({addModalShow:true})}>Add New Course</Button>
                <CreateCourse 
                show= {this.state.addModalShow}
                onHide={this.addModalClose} ></CreateCourse>
            </div>
            <div className='carousel-container'>
               
                

                <button 
                className={leftNavClasses}
                onClick={this.handleLeftNav}
                >
                    &#60;
                </button>
                <div className="carousel-viewport" 
                ref = "carouselViewport"
                onScroll={this.throttleScroll}>
                    {this.renderSlides(courses)}
                </div>
                <button 
                className={rightNavClasses}
                onClick={this.handleRightNav}
                >
                &#62;
                </button>
            </div>
            </div>
        );
    }
  
    deleteCourse = (id) => {
      if(window.confirm('Are you Sure? '))
         {
            const { courses } = this.state;

            fetch( api.url +'/'+ id,{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                }
            } ).then(()=>{
                this.refreshCourses();
            })
        }
    } 
}


export default Carousel;