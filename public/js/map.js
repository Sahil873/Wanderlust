// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// let mapToken = mapToken;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// console.log();

const marker = new mapboxgl.Marker()
  .setLngLat(coordinates) // listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listingLocation}</h4>
      <p>Exact Location Will Be Provided After Booking</p>`
    )
  )
  .addTo(map);
