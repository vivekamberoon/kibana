/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SearchEsListSchema } from '../../../common/schemas';

import { DATE_NOW, DESCRIPTION, NAME, USER } from './lists_services_mock_constants';

export const getSearchEsListMock = (): SearchEsListSchema => ({
  created_at: DATE_NOW,
  created_by: USER,
  description: DESCRIPTION,
  meta: {},
  name: NAME,
  tie_breaker_id: '6a76b69d-80df-4ab2-8c3e-85f466b06a0e',
  type: 'ip',
  updated_at: DATE_NOW,
  updated_by: USER,
});
