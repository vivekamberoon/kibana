/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

interface ActionGroupDefinition {
  id: string;
  name: string;
}

type ActionGroupDefinitions = Record<string, ActionGroupDefinition>;

export const ACTION_GROUP_DEFINITIONS: ActionGroupDefinitions = {
  MONITOR_STATUS: {
    id: 'xpack.uptime.alerts.actionGroups.monitorStatus',
    name: 'Uptime Down Monitor',
  },
  TLS: {
    id: 'xpack.uptime.alerts.actionGroups.tls',
    name: 'Uptime TLS Alert',
  },
};

export const CLIENT_ALERT_TYPES = {
  MONITOR_STATUS: 'xpack.uptime.alerts.monitorStatus',
  TLS: 'xpack.uptime.alerts.tls',
};
