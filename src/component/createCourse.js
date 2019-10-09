import React, {Component} from 'react';
import { Modal,Row,Col,Form} from 'react-bootstrap'; 
import Button from 'react-bootstrap/Button';
import api from '../data.json';


  class createCourse extends Component {
    constructor(props){
        super(props);
         
    }
    
    handleSubmit =(e)=>{
        e.preventDefault();
        fetch(api.url,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'content-type':'application/json'
            },
            body:JSON.stringify({
                courseId: null,
                courseName: e.target[0].value
                
            })
        }).then(res=> res.json())
        .then((result)=>{ 
            this.props.onHide()
        }, 
        (error) => {
            alert('failed')
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
          Create New Course
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
                <Row>
                    <Col sm={6}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="courseName">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control type="text"
                            name="courseName"
                            required
                            placeholder="course name"/>                          
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="Submit">Add Course</Button>
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
export default createCourse;
