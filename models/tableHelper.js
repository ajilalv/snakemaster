//sql table names
const tablenames = {
  rawdata: "VavaData",
  guests: "Guests",
  places: "Places",
  locations: "Locations"
};

function getGroupsColName(id) {
  switch (Number(id)) {
    case 1:
      return ["DIS", tablenames.places];
    case 2:
      return ["CITY", tablenames.places];
    case 3:
      return ["PLACE", tablenames.places];
    case 4:
      return ["LOC", tablenames.locations];
    default:
      return ["NAME", tablenames.guests];
  }
}

module.exports = { tablenames, getGroupsColName };
