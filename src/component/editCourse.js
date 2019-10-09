import React, {Component} from 'react';
import { Modal,Row,Col,Form} from 'react-bootstrap'; 
import Button from 'react-bootstrap/Button';
import { IconButton } from '@material-ui/core';
import api from '../data.json';

class editCourse extends Component {
    constructor(props){
        super(props);
        this.state ={snackbaropen:false,snackbarmsg: ''};
         this.handleSubmit = this.handleSubmit.bind(this);
    }

   /* snackbarClose =(e) => {
        this.setState({snackbaropen:false});
    }*/
    handleSubmit =(e)=>{
        e.preventDefault();
        var url = api.url + "/" +  e.target.courseId.value
        fetch(url,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'content-type':'application/json'
            },
            body:JSON.stringify({
                courseId: e.target.courseId.value,
                courseName:e.target.courseName.value
            })
        })
        .then((result)=>{ 
          //  this.setState({snackbaropen:true,snackbarmsg:'failed'});
          alert('updated');
            this.props.onHide();
        }, 
        (error) => {
          //  this.setState({snackbaropen:true,snackbarmsg:'failed'});
        })
        
    }
    render(){
        
        return(
                
            <Modal
      {...this.props}
      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Course 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
                <Row>
                    <Col sm={6}>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="courseId">
                            <Form.Label>Course Id</Form.Label>
                            <Form.Control type="text"
                            name="course ID"
                            required
                            disabled
                            defaultValue={this.props.courseid}
                            placeholder="course id"/>                          
                        </Form.Group>
                        <Form.Group controlId="courseName">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control type="text"
                            name="courseName"
                            required
                            defaultValue={this.props.coursename}
                            placeholder="course name"/>                          
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="Submit">Update Course</Button>
                        </Form.Group>
                    </Form>
                    </Col>
                </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
        );
    }
}
export default editCourse;
