/*global google*/
// Avoid the error that shows us that google is not defined.
import React, {
    Component
} from 'react';
import SideNav from './SideNav.js';
import Header from '../header.js';
import '../App.css';

let places = [];

// FourSquare client ID.
const clientId = 'HW3E1K0QJCLXPGL5FMEHKOGVLHF02FEMYTTVC0OMR4FLYPV3';
const clientSecret = 'RF5ZGFAILNDECRCAHXHFVXURY5KMA0E5I3NS2ZK0HSNZZC13';

export default class App extends Component {
    state = {
        isOpen: false,
        filterMarkers: [],
        defaultMarkers: [],
        map: '',
        infoWindow: ''
    };

	gm_authFailure(){
    window.alert("Google Maps error!")
	}

    // Search the database of the selected places.
    componentDidMount() {
    	window.gm_authFailure = this.gm_authFailure;
        fetch('places_db.json')
            .then(res => res.json())
            .then(data => {
                places = data.places;
                window.initMap = this.initMap;
            });
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBaKHevCxoPXLfpCS684uWz4O8XvIb6pO0&libraries=places&callback=initMap')
    };

    // Start the google map, style it and register it to be available.
    initMap = () => {
        this.setState(() => {
            return {
                map: new google.maps.Map(document.getElementById('map'), {
                    zoom: 12,
                    styles: [{
                            "featureType": "administrative",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.fill",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [{
                                "visibility": "on"
                            }]
                        }
                    ]
                }),
                infoWindow: new google.maps.InfoWindow({})
            }
        });
        this.setMarker();
        google.maps.event.addDomListener(window, 'resize', () => {
            this.autoRecenterMap()
        });
    };

    // Show markers on the google map.
    setMarker = () => {
        let bounds = new google.maps.LatLngBounds();
        let marker = [];
        places.forEach((location, index) => {
            marker.push(new google.maps.Marker({
                map: this.state.map,
                position: {
                    lat: location.lat,
                    lng: location.lng
                },
                title: location.name,
                animation: window.google.maps.Animation.DROP
            }));
            google.maps.event.addListener(marker[index], 'click', () => {
                this.openInfoWindow(marker[index]);
            });

            //Implement map to add new markers
            let markerPosition = new google.maps.LatLng(marker[index].position.lat(), marker[index].position.lng());
            bounds.extend(markerPosition);
            this.autoRecenterMap(bounds)
        });
        this.setState({
            filterMarkers: marker,
            defaultMarkers: marker,
        });
    };

    // Adjust the google map when there are changes in the size of the screen.
    autoRecenterMap = (bounds) => {
        this.state.map.fitBounds(bounds);
        this.state.map.panToBounds(bounds);
    };

    // Agglutinate all Foursquare data.
    fetchData = (marker) => {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180516&ll=${lat},${lng}`;

        this.state.infoWindow.setContent("Getting data");
        fetch(url)
            .then((res) => {
                if (res.status !== 200) {
                    this.state.infoWindow.setContent('Error!');
                    return;
                }
                res.json()
                    .then((data) => {
                        let venue = data.response.venues[0];
                        fetch(`https://api.foursquare.com/v2/venues/${venue.id}/?client_id=${clientId}&client_secret=${clientSecret}&v=20180516`)
                            .then((res1) => {
                                res1.json()
                                    .then(data => {
                                        try {
                                            let detailedData = data.response.venue;
                                            this.state.infoWindow.setContent(`<h4>${marker.title}</h4> <br>Ratings : ${detailedData.rating}<br>Likes : ${detailedData.likes.count}`)
                                        } catch (e) {
                                            console.log(e);
                                            alert('error occurred')
                                        }
                                    })
                            })
                            .catch(e => {
                                console.log(e);
                                alert('error occurred')
                            })
                    })
            })
            .catch(e => {
                console.log(e);
                alert('error occurred')
            });
    };

    // Show information about the different markers.
    openInfoWindow = (marker) => {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);

        this.state.map.panTo(marker.getPosition());
        this.fetchData(marker);
        this.state.infoWindow.open(this.state.map, marker);

    };

    // Filter the locations that the user chooses.
    filter = (event) => {
        this.state.infoWindow.close();
        let filterLocations = [];
        if (event.target.value === '' || filterLocations.length === 0) {
            this.state.defaultMarkers.forEach((marker) => {
                if (marker.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                    marker.setVisible(true);
                    filterLocations.push(marker);
                } else {
                    marker.setVisible(false);
                }
            });
        } else {
            this.state.filterMarkers.forEach((marker) => {
                if (marker.title.toLowerCase().indexOf(event.target.value) >= 0) {
                    marker.setVisible(true);
                    filterLocations.push(marker);
                } else {
                    marker.setVisible(false);
                }
            });
        }
        this.setState({
            filterMarkers: filterLocations
        })
    };

    // Shows and hides the sidebar of the page.
    toggleSideNav = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.state.infoWindow.close();
    };

    render() {
        return ( <
            div >
            <
            Header isOpen = {
                this.state.isOpen
            }
            toggleSideNav = {
                this.toggleSideNav
            }
            aria-label = "toggle Navigation" / >

            <
            div className = "container"
            role = "main" > {
                this.state.isOpen &&
                <
                SideNav style = {
                    {
                        height: window.innerHeight - 48 + "px"
                    }
                }
                places = {
                    this.state.filterMarkers
                }
                openInfoWindow = {
                    this.openInfoWindow
                }
                filter = {
                    this.filter
                }
                isOpen = {
                    this.props.isOpen
                }
                />
            }

            <
            div className = "map-container"
            role = "application"
            tabIndex = "-1" >
            <
            div id = "map"
            style = {
                {
                    height: window.innerHeight - 48 + "px"
                }
            }
            /> <
            /div> <
            /div> <
            /div>

        );
    }
}

// Load map in page.
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName('script')[0];
    var script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = () => {
        alert('error occured. please refresh the page.')
    };
    ref.parentNode.insertBefore(script, ref);
}