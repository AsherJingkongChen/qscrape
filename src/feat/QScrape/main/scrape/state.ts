import { Resource } from '../../../../core';

/**
 * The state of `scrape()` and its subroutines
 */
export const state = {
  altName: '',
  link: '',
  name: '',
  relatedResources: <Resource[]>[],
  textContent: '',
  reset() {
    this.altName = '';
    this.link = '';
    this.name = '';
    this.relatedResources = [];
    this.textContent = '';
  },
};
