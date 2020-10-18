import uuidv5 from 'uuid/v5';
import { sha256 } from 'js-sha256';

/**
 * PasswordEncoder
 * Encode password specific way
 * Caution algorithm shared with API.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
export class PasswordEncoder {
  constructor(iterations = 42) {
    this.iterations = iterations;
  }

  encodePassword(raw, salt = '') {
    let salted = this.mergePasswordAndSalt(raw, salt);

    // First get UUID from username and NS
    salted = uuidv5(salted, process.env.REACT_APP_JWT_USER_UUID);

    let digest = sha256(salted);
    // "stretch" hash
    for (let i = 1; i < this.iterations; ++i) {
      digest = sha256(digest + salted);
    }

    return digest;
  }

  /**
   * Merge raw password and salt in a single string
   * @param {string} raw
   * @param {string} salt
   */
  mergePasswordAndSalt(raw, salt) {
    return raw + (salt ? '{' + salt + '}' : '');
  }

  /**
   * Generate a unique ID from a string
   * @param {string} raw
   */
  generateKey(raw) {
    return uuidv5(sha256(raw), process.env.REACT_APP_JWT_USER_UUID);
  }
}
