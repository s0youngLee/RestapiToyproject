import { Axios } from "axios";
import React from "react";
import { Component } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import './App.css'


class Write extends Component {

    state = {
        userId : "",
        content : ""
    };

    // Axios.post 있었음

    // handle.Change 있었음

    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control as="input" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" />
                    </Form.Group>
                </Form>
                <Button variant="info">Add</Button>
                <Button id="btn-remove">Back</Button>
            </div>
        );
    }
}

export default Write;