//validates that a string is between a set length, used for getter
const validateLength = function(minLength, maxLength) {
    minLength = minLength || 0;
    maxLength = maxLength || Infinity;
    return {
      validator : function(value) {
        if (value === undefined) return true;
        return value.length >= minLength && value.length <= maxLength;
      },
      message : 'Optional field is shorter than the minimum allowed length (' + minLength + ') or larger than the maximum allowed length (' + maxLength + ')'
    }
}

module.exports = { validateLength }