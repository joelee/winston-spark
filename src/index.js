'use strict'

var winston = require('winston')
var util = require('util')
var request = require('request')

var sparkUrlEndpoint = 'https://api.ciscospark.com/v1/messages'

var SparkLogger = winston.transports.SparkLogger = function (options) {
  this.name = 'sparkLogger'

  this.level = options.level || 'info'
  this.accessToken = options.accessToken
  this.sparkRoom = options.roomId
  this.hideMeta = options.hideMeta
}

util.inherits(SparkLogger, winston.Transport)

SparkLogger.prototype.log = function (level, msg, meta, callback) {
  if (!this.accessToken || !this.sparkRoom) {
    return callback(new Error('Missing accessToken and/or sparkRoom options'))
  }

  var text = '**' + level + '**: ' + msg
  if (!this.hideMeta && meta) text += '<br>\r\n`' + JSON.stringify(meta) + '`'

  var options = {
    url: sparkUrlEndpoint,
    headers: {
      Authorization: 'Bearer ' + this.accessToken,
      'User-Agent': 'winston-spark/1.0 (https://github.com/Joeworks/winston-spark)'
    },
    form: {
      'roomId': this.sparkRoom,
      'markdown': text
    }
  }

  request.post(options, function (err) {
    callback(err, true)
  })
}

module.exports = SparkLogger
