Location.create city: 'Seattle', state: 'WA', lat: 47.603569, lng: -122.329453
Location.create city: 'Las Vegas', state: 'NV', lat: 36.171909, lng: -115.139969

Business.create({
  name: 'Lost Lake Cafe',
  address: '1505 10th Ave, Seattle, WA',
  lat: 47.614282,
  lng: -122.319453,
  website: 'http://lostlakecafe.com/',
  facebook: 'https://www.facebook.com/LostLakeCafe',
  twitter: 'https://twitter.com/lostlakecafe',
  yelp: 'http://www.yelp.com/biz/lost-lake-cafe-and-lounge-seattle',
  location: Location.where(city: 'Seattle').first
})
Business.create({
  name: '5 Point Cafe',
  address: '415 Cedar St, Seattle, WA',
  lat: 47.618198,
  lng: -122.347504,
  website: 'http://the5pointcafe.com/',
  facebook: 'https://www.facebook.com/The5PointCafe',
  twitter: 'https://twitter.com/The5PointCafe',
  yelp: 'http://www.yelp.com/biz/the-5-point-caf%C3%A9-seattle-2',
  location: Location.where(city: 'Seattle').first
})
Business.create({
  name: "Sapphire Gentlemen's Club",
  address: '3025 Industrial Rd, Las Vegas, NV',
  lat: 36.135075,
  lng: -115.171349,
  website: 'http://www.sapphirelasvegas.com',
  facebook: '',
  twitter: '',
  yelp: '',
  location: Location.where(city: 'Las Vegas').first
})
