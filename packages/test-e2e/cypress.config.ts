import { env } from 'node:process'

const { CI_TENANT_ID } = env

export default {
  e2e: {
    setupNodeEvents(on, config) {
    },
  },
  "hosts": {
    [`${CI_TENANT_ID}.localhost`]: "127.0.0.1"
  }
};
