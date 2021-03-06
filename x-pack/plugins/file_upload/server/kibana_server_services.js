/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

let dataClient;

export const setElasticsearchClientServices = (elasticsearch) => {
  ({ dataClient } = elasticsearch);
};
export const getDataClient = () => dataClient;

let internalRepository;
export const setInternalRepository = (createInternalRepository) => {
  internalRepository = createInternalRepository();
};
export const getInternalRepository = () => internalRepository;
