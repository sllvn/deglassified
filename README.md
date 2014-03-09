# Deglassified

Cataloguing businesses with policies against Google Glass.

## API Spec

#### List locations (Cities)

`GET /api/locations`

#### List businesses

`GET /api/locations/{location_slug}`

All businesses for that location will be returned inside a `businesses` array.

#### Find businesses near latlng coords

`GET /api/businesses?lat={latitude}&lng={longitude}&radius={radius_in_meters}`

Return all businesses within a search radius. Lat and lng are required, radius defaults to 1000 meters if omitted. Results are sorted by distance from specified lat/lng.

