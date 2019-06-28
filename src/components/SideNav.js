import React, {
    Component
} from 'react';
import '../App.css'

export default class Sidebar extends Component {
    constructor() {
        super();

        this.state = {
            query: ''
        }
    }
    render() {
        return ( <
            div className = "nav"
            style = {
                {
                    height: window.innerHeight - 80 + "px"
                }
            } >
            <
            div >
            <
            input className = "input-filter"
            type = "text"
            placeholder = "Locations..."
            id = "filter"
            aria-label = "filter search"
            onChange = {
                this.props.filter
            }
            /> <
            ul className = "locations"
            aria-label = "list of places"
            role = "navigation" > {
                this.props.places.map((mark, index) => {
                        return ( < li className = "location"
                        role ="listitem"
                            onClick = {
                                this.props.openInfoWindow.bind(this, mark)
                            }
                            value = {
                                this.state.query
                            }
                            key = {
                                index
                            }
                            tabIndex = {
                                this.props.isOpen ? -1 : 0
                            } > {
                                mark.title
                            } < /li>)

                        })
                } <
                /ul> <
                /div> <
                /div>
            );
        }
    }