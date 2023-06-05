import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader, Row, Label, Col } from 'reactstrap';
import {Link} from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form'
import { Loading } from './LoadingComponent';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);

        this.state={
            modalIsOpen: false
        }
        this.toggleModalIsOpen = this.toggleModalIsOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModalIsOpen(){
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
    }

    handleSubmit(values) {
        this.toggleModalIsOpen();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.message);
    }

    render(){
        return(
            <>
                <button className="btn btn-outline-secondary" onClick={this.toggleModalIsOpen}><span className="fa fa-pencil"></span> Submit Comment</button> 

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModalIsOpen} fade={false}>
                    <ModalHeader toggle={this.toggleModalIsOpen}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="Rating" md={2}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={2}>YourName</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            minLength: minLength(3), maxLength: maxLength(15)
                                        }} />
                                    <Errors 
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: "Must be greater than 3 characters",
                                            maxLength: "Must be less than 15 characters"
                                        }} />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="message" md={2}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".message" id="message" 
                                        name="message" rows="6"
                                        className="form-control"/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={{size: 12}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

function RenderComments({ commentsArray, addComment, dishId }) {
    var comm = commentsArray.map((comment) => {
        return(
            <div tag="li" key={comment.id}>
                <p>{comment.comment}<br /><br /> --{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
            </div>
        );
    });

    if(commentsArray != null)
        return(
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <div list>
                    {comm}
                </div>
                <CommentForm dishId={dishId} addComment={addComment} />
            </div>
        );
    else
        return(
            <div></div>
        );
}

const DishDetail = (props) => {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if(props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if(props.dish != null)
        return ( 
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <Card>
                            <CardImg top src={props.dish.image} alt={props.dish.name} />
                            <CardBody>
                                <CardTitle>{props.dish.name}</CardTitle>
                                <CardText>{props.dish.description}</CardText>
                            </CardBody>
                        </Card>
                    </div>
                    <RenderComments commentsArray = {props.comments} addComment={props.addComment} dishId={props.dish.id} />
                </div>
            </div>);
    else
        return (<div></div>);
}

export default DishDetail;