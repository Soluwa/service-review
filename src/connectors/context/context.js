import urljoin from 'url-join';
import request from '../connectors-helper';

export const getConversation = async convId =>
  request(urljoin('/conversation/', encodeURIComponent(convId)), 'GET');

export const getConversations = async conversations =>
  request('/conversation/list', 'POST', {}, conversations);
