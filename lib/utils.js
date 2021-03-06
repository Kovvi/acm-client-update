'use strict';

const crypto = require('crypto');
const is = require('is-type-of');
const assert = require('assert');
const qs = require('querystring');
const iconv = require('iconv-lite');
const urlencode = require('urlencode');

const sep = '&';
const eq = '=';
const REG_VALID_CHAR = /^[a-z0-9A-Z_\.\-\:]+$/;

/**
 * 获取字符串的 md5 值
 * @param {String} val - 字符串
 * @return {String} md5
 */
exports.getMD5String = function getMD5String(val) {
  if (is.nullOrUndefined(val)) {
    return '';
  }
  const md5 = crypto.createHash('md5');
    // 注意：这里的编码是 gbk ！！！
    // 手动修改为utf-8
  md5.update(iconv.encode(val, 'utf-8'));
  return md5.digest('hex');
};

exports.encodingParams = function encodingParams(data) {
  return qs.stringify(data, sep, eq, {
    encodeURIComponent(str) {
        // diamond server 默认是 GBK 编码
        // 手动修改为utf-8
      return urlencode.encode(str, 'utf-8');
    },
  });
};

/**
 * 是否是合法字符
 * @param {String} val - 字符串
 * @return {Boolean} valid or not?
 */
exports.isValid = function isValid(val) {
  return val && REG_VALID_CHAR.test(val);
};

// Helper
// --------------------
exports.checkParameters = function checkParameters(dataIds, group, datumId) {
  if (Array.isArray(dataIds)) {
    const invalidDataIds = dataIds.filter(function(dataId) {
      return !exports.isValid(dataId);
    });
    assert(invalidDataIds.length === 0, `[dataId] only allow digital, letter and symbols in [ "_", "-", ".", ":" ], but got ${invalidDataIds}`);
  } else {
    assert(dataIds && exports.isValid(dataIds), `[dataId] only allow digital, letter and symbols in [ "_", "-", ".", ":" ], but got ${dataIds}`);
  }
  assert(group && exports.isValid(group), `[group] only allow digital, letter and symbols in [ "_", "-", ".", ":" ], but got ${group}`);
  if (datumId) {
    assert(exports.isValid(datumId), `[datumId] only allow digital, letter and symbols in [ "_", "-", ".", ":" ], but got ${datumId}`);
  }
};
