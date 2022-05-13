export type Application = {
  id: string;
  code: string;
  name: string;
  internalUrl: string;
  homepageUrl: string;
  status: boolean;
  clientId: string;
  clientSecret: string;
  redirectUris: string;
  loginUris: string;
  tokenFormat: string;
} & ModificationFields;
