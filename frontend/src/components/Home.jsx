import '../App.css';
import Map from "./Map";

function Home({user, courts, selectedSport, refreshData}) {

    return (
        <div className="map-container">
            <Map courts={courts} refreshData={refreshData} selectedSport={selectedSport} user={user}/>
        </div>
    );
}

export default Home
