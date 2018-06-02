const express = require("express");
const querystring = require("querystring");
const request = require("../lib/request");
const moment = require("moment");
const router = express.Router();

let config = require("../lib/config");

router.post("/suggest", (req, res) => {
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
      res.json(err);
    });
});

router.post("/address", (req, res) => {
  let serviceId = req.body.service_id;
  let parcelId = req.body.parcel_id;
  let areaId = req.body.area_id;

  config.path = `/api/places?parcel_id=${parcelId}&area_id=${areaId}&svc_id=${serviceId}`;

  request(config)
    .then(result => {
      res.json(result.place.id);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/calendar", (req, res) => {
  config.path = `/api/places/${
    req.body.id
  }/services/323/events?hide=reminder_only`;

  request(config).then(results => {
    let data = results.events
      .map(
        element =>
          element.flags && {
            date: element.day,
            services: element.flags.map(el => el.name)
          }
      )
      .filter(element => element);
    res.json(data);
  });
});

router.post("/nextbulkpickup", (req, res) => {
  const after = moment().format("YYYY-MM-DD");
  const before = moment()
    .add(1, "y")
    .format("YYYY-MM-DD");
  config.path = `/api/places/${
    req.body.id
  }/services/323/events?hide=reminder_only&after=${after}&before=${before}`;
  request(config).then(results => {
    let data = results.events
      .filter(
        event =>
          event.flags && event.flags.find(f => f.name == "BulkItemCollection")
      )
      .map(element => element.day)
      .filter(element => element);
    res.json(data);
  });
});

module.exports = router;
