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
    res.json(results);
  })
  .catch(err => {
    res.json(err)
  });
});

router.post('/address', (req, res) => {
  let addressQuery = querystring.escape(req.body.name);
  let serviceId = req.body.service_id;
  let parcelId = req.body.parcel_id;
  let areaName = req.body.area_name;
  let areaId = req.body.area_id;

  config.path = `/api/places?formatted_address=${addressQuery}&parcel_id=${parcelId}&area_id=${areaId}&area_name=${areaName}&svc_id=${serviceId}`;

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
