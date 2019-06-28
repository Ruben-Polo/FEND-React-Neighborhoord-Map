import React, {
    Component
} from 'react';
import './App.css'

export default class SideNav extends Component {
    render() {
        return ( <
            div className = "header" >
            <
            div onClick = {
                this.props.toggleSideNav
            }
            aria-label = "toggle Navigation"
            className = 'toggle-navbar' > {
                this.props.isOpen ?
                <
                i className = "filter"
                onChange = {
                    this.onChangeQuery
                } >
                Filter <
                /i> : <
                i className = "search"
                onClick = {
                    () => this.toggleSideNav
                } 
                tabIndex="2" >
                Search <
                /i>
            } <
            /div> <
            div className = 'title' >
            Neighborhood Map <
            /div> <
            div >
            <
            img className = 'attribution'
            src = "foursquare-white.png"
            alt = "Foursquare" / >
            <
            /div> <
            /div>


        );

    }
}