import $ from 'jquery';

export const getCurrentlySetColor = (type) => {
  return $('#game-master').css('--' + type);
}
