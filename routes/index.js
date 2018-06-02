const express = require('express');
const querystring = require('querystring');
const request = require('../lib/request');
const router = express.Router();

let config = require('../lib/config');

router.post('/suggest', (req, res) => {

  let addressQuery = querystring.escape(req.body.address);
  config.path = `/api/areas/Austin/services/323/address-suggest?q=${addressQuery}`;

  request(config)
  .then(results => {
    let data = results.map(element => ({
      parcel_id: element.parcel_id,
      name: element.name,
      area_id: element.area_id,
      service_id: element.service_id
    }));
    res.json(data);
  })
  .catch(err => {
    res.json(err)
  });
});

router.post('/address', (req, res) => {
  let serviceId = req.body.service_id;
  let parcelId = req.body.parcel_id;
  let areaId = req.body.area_id;

  config.path = `/api/places?parcel_id=${parcelId}&area_id=${areaId}&svc_id=${serviceId}`;

  request(config)
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    res.json(err)
  });
});

router.post('/calendar', (req, res) => {
  config.path = `/api/places/${req.body.id}/services/323/events?`;

  request(config)
  .then(results => {
    let daysWithEvents = results.events.map(element => {
      return element.day;
    });
    console.log(daysWithEvents);
    res.json(results);
  })
  .catch(err => {
    res.json(err)
  });
});

module.exports = router;
