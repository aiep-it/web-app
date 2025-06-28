import { createDirectus, rest, staticToken } from '@directus/sdk';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL || '';
const token = process.env.NEXT_PUBLIC_CMS_STATIC_TOKEN || '';


export const cms = createDirectus(CMS_URL)
  .with(staticToken(token))
  .with(rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
  }));


export const COLLECTIONS = {
    NodeView: 'NodeView',

}