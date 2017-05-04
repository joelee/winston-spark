'use strict'

var winston = require('winston')
var util = require('util')
var CiscoSpark = require('node-ciscospark')

var SparkLogger = winston.transports.SparkLogger = function (options) {
  this.name = 'sparkLogger'

  this.level = options.level || 'info'
  this.accessToken = options.accessToken
  this.sparkRoom = options.roomId
  this.hideMeta = options.hideMeta
  this.spark = new CiscoSpark(options.accessToken, 'winston-spark (https://github.com/joelee/winston-spark)')
}

util.inherits(SparkLogger, winston.Transport)

SparkLogger.prototype.log = function (level, msg, meta, callback) {
  if (!this.accessToken || !this.sparkRoom) {
    return callback(new Error('Missing accessToken and/or sparkRoom options'))
  }

  var text = '**' + level + '**: ' + msg
  if (!this.hideMeta && meta) text += '<br>\r\n`' + JSON.stringify(meta) + '`'

  this.spark.messages.create({
    roomId: this.sparkRoom,
    markdown: text
  }, function (err) {
    callback(err, true)
  })
}

module.exports = SparkLogger
