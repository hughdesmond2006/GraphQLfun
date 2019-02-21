import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import "./Events.css";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

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
    this.setState({ creating: true });
  };

  //add event..
  modalConfirmHandler = () => {
    this.setState({ creating: false });
    console.log("this cant be null:" + this);
    console.dir(this);
    const title = this.titleElement.current.value;
    const price = +this.priceElement.current.value; //+ converts the string to a number
    const date = this.dateElement.current.value;
    const description = this.descriptionElement.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    //es6 shortcut, if props have same name as their value var
    // then no need for prop: prop..
    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
            mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
                createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
                    _id
                    title
                    description
                    date
                    price
                }
            }
        `,
      variables: {
        title: title,
        description: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    //sends http req to browser
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        //before we fetched all events and changed whole state to new list
        //now we just set state to the same + the newly created event....much more efficient
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];

          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.dir(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
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
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.dir(resData);
        const events = resData.data.events;

        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })
      .catch(err => {
        console.dir(err);

        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = eventId => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
                mutation BookEvent($id: ID!){
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    //sends http req to browser
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.dir(resData);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.dir(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText={"Confirm"}
          >
            <form>
              <div className={"form-control"}>
                <label htmlFor={"title"}>Title</label>
                <input type={"text"} id={"title"} ref={this.titleElement} />
              </div>
              <div className={"form-control"}>
                <label htmlFor={"price"}>Price</label>
                <input type={"number"} id={"price"} ref={this.priceElement} />
              </div>
              <div className={"form-control"}>
                <label htmlFor={"date"}>Date</label>
                <input
                  type="datetime-local"
                  id={"date"}
                  ref={this.dateElement}
                />
              </div>
              <div className={"form-control"}>
                <label htmlFor={"description"}>Description</label>
                <textarea
                  id={"description"}
                  rows={"4"}
                  ref={this.descriptionElement}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className={"events-control"}>
            <p>Share your own events!</p>
            <button className={"btn"} onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
