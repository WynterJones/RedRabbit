'use strict'

const calculate = {

  average: (list) => {
    return list.reduce((prev, curr) => prev + curr) / list.length;
  }

}

module.exports = calculate
