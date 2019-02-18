import React, {Component} from 'react';

import Modal from '../components/Modal/Modal';
import './Events.css';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElement = React.createRef();
        this.priceElement = React.createRef();
        this.dateElement = React.createRef();
        this.descriptionElement = React.createRef();

        this.modalConfirmHandler = this.modalConfirmHandler.bind(this);
    }

    //fetch events right after events page is mounted..
    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    };

    //add event..
    modalConfirmHandler = () => {
        this.setState({creating: false});
        console.log("this cant be null:" + this);
        console.dir(this);
        const title = this.titleElement.current.value;
        const price = +this.priceElement.current.value;           //+ converts the string to a number
        const date = this.dateElement.current.value;
        const description = this.descriptionElement.current.value;

        if(title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        //es6 shortcut, if props have same name as their value var
        // then no need for prop: prop..
        const event = {title, price, date, description};
        console.log(event);


        const requestBody = {
            query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description:"${description}", price:${price}, date:"${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        _id
                        email
                    }
                }
            }
        `
        };

        const token = this.context.token;

        //sends http req to browser
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed!');
            }
            return res.json();
        }).then((resData) => {
            console.dir(resData);

            this.fetchEvents();
        }).catch(err => {
            console.dir(err);
        });


    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    fetchEvents(){
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        //sends http req to browser
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed!');
            }
            return res.json();
        }).then((resData) => {
            console.dir(resData);

            const events = resData.data.events;
            this.setState({events: events});
        }).catch(err => {
            console.dir(err);
        });
    }

    render(){
        //map is good for transforming raw data into html tags
        const eventList = this.state.events.map(event => {
            return <li key={event._id} className={"events__list-item"}>{event.title}</li>;
        });

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && (
                    <Modal
                        title={"Add Event"}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}>
                        <form>
                            <div className={"form-control"}>
                                <label htmlFor={'title'}>Title</label>
                                <input type={'text'} id={'title'} ref={this.titleElement}></input>
                            </div>
                            <div className={"form-control"}>
                                <label htmlFor={'price'}>Price</label>
                                <input type={'number'} id={'price'} ref={this.priceElement}></input>
                            </div>
                            <div className={"form-control"}>
                                <label htmlFor={'date'}>Date</label>
                                <input type="datetime-local" id={'date'} ref={this.dateElement}></input>
                            </div>
                            <div className={"form-control"}>
                                <label htmlFor={'description'}>Description</label>
                                <textarea id={'description'} rows={'4'} ref={this.descriptionElement}></textarea>
                            </div>
                        </form>
                    </Modal>)}
                {this.context.token && (
                    <div className={'events-control'}>
                        <p>Share your own events!</p>
                        <button className={'btn'} onClick={this.startCreateEventHandler}>Create Event</button>
                    </div>
                )}
                <ul className={"events__list"}>{eventList}</ul>
            </React.Fragment>
        );
    }
}

export default EventsPage;