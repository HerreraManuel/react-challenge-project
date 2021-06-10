import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

const DELETE_ORDER_URL = `${SERVER_IP}/api/delete-order`
const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`

class ViewOrders extends Component {
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            isEditing: false,
            quantity: '',
        };
    }

    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
            });
    }

    editOrder(){
        this.setState({isEditing: !this.state.isEditing});
    }

    menuQuantityChosen(event) {
        console.log(event.target.value)
        this.setState({quantity: event.target.value})
    }

    /*
    Edit order functionality.
    Issues: When an EDIT button is clicked, every order is toggled to edit.
            While the drop down menu selection is applied to each other, only
            the saved item is adjusted. In addition, a refresh will show the true updated quantity
    I would need to debug the problem with quantity showing only after a refresh.
     */
    updateOrder(order){
        fetch(EDIT_ORDER_URL, {
            method: 'POST',
            body: JSON.stringify({
                id: order._id,
                order_item: order.order_item,
                quantity: this.state.quantity,
                ordered_by: order.ordered_by
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.ok){
                console.log('Order Updated')
            } else {
                console.log('Unable to update order')
            }})
        this.setState({isEditing: false})
    }

    deleteOrder(order_id){
        fetch(DELETE_ORDER_URL, {
            method: 'POST',
            body: JSON.stringify({
                id: order_id,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.ok){
                console.log('SUCCESS')
            } else {
                console.log('Not Successful')
        }})
        .then(
             this.setState(prevState => ({
                orders: prevState.orders.filter(order => order._id !== order_id)
        })))
        .catch(error => console.log(error))
    }

    render() {
        return (
            <Template>
                <div className="container-fluid">
                    {this.state.orders.map(order => {
                        const createdDate = new Date(order.createdAt);
                        return (
                            <div className="row view-order-container" key={order._id}>
                                <div className="col-md-4 view-order-left-col p-3">
                                    <h2>{order.order_item}</h2>
                                    <p>Ordered by: {order.ordered_by || ''}</p>
                                </div>
                                <div className="col-md-4 d-flex view-order-middle-col">
                                    <p>Order placed at {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}</p>
                                    {this.state.isEditing ? (
                                        <select value={this.state.quantity} onChange={(event) => this.menuQuantityChosen(event, this.value)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                    ) : (
                                        <p>Quantity: {order.quantity}</p>
                                    )
                                    }
                                 </div>
                                 <div className="col-md-4 view-order-right-col">
                                     {this.state.isEditing ? (
                                         <button className="btn btn-success" onClick={(event) => this.updateOrder(order)}>Save Edit</button>
                                     ) : (
                                         <button className="btn btn-success" onClick={(event) =>
                                         this.editOrder()}>Edit</button>
                                     )}
                                    <button className="btn btn-danger" onClick={() => this.deleteOrder(order._id)}>Delete</button>
                                 </div>
                            </div>
                       );
                    })}
                </div>
            </Template>
        );
    }
}

export default ViewOrders;
