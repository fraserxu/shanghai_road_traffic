var fs = require('fs')
var d3 = require('d3')
var moment = require('moment')
var csv = require('./csv.js')

var zhangjiang = []
var timeIndex = []
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse

function toInt (d) {
  return parseInt(d.replace(':', ''))
}

function parsedDateObj (d) {
  return moment(new Date(parseDate(d)))
}

csv.each('./road_indicator.csv').on('data', function(data) {
  // station equal to 20XN_zhangjiang000 is jingan
  // station equal to 20XN_zhangjiang000 is wujiaochang
  if (data[1] === '20DZ_ZJ0000') {
    zhangjiang.push([
      data[1],
      data[2],
      data[3]
    ])
  }
}).on('end', function() {

  var uniqueHour = []

  var dateWithoutDay = zhangjiang.sort(function(p, c) {
    if (parsedDateObj(p[1]).isBefore(parsedDateObj(c[1]))) {
      return 1;
    }
    if (parsedDateObj(p[1]).isAfter(parsedDateObj(c[1]))) {
      return -1;
    }
    // a must be equal to b
    return 0;
  })
  .map(function(d) {
    var parsedDate = parseDate(d[1])
    var _parsedDateObj = new Date(parsedDate)
    var _time = _parsedDateObj.getHours() + ':' + _parsedDateObj.getMinutes()
    return [
      _time,
      d[2]
    ]
  }).filter(function(d) {
    if (timeIndex.indexOf(d[0]) === -1) {
      timeIndex.push(d[0])
      return true
    }
  })
  console.log('timeIndex', timeIndex)

  fs.writeFile('./zhangjiang.json', JSON.stringify(dateWithoutDay, null, 2), function(err, res) {
    console.log('done')
  })
})

